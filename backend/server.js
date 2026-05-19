// server.js - Express API server for Spotle TN
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./database');
const gameLogic = require('./gameLogic');
const dailyArtist = require('./dailyArtist');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Allow requests from the nginx frontend (port 8080 in Docker) and any hosted domain
app.use(cors({
   const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://yourdomain.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
})),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Rate limiting - prevent spam guessing
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute
    message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/today - Get today's puzzle metadata
app.get('/api/today', async (req, res) => {
    try {
        // Select a random date from the seeded daily_artist table to give a new artist on every reload
        const result = await db.query("SELECT TO_CHAR(date, 'YYYY-MM-DD') AS date FROM daily_artist ORDER BY RANDOM() LIMIT 1");
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No daily artists seeded in database' });
        }
        const randomDate = result.rows[0].date;

        res.json({
            date: randomDate,
            max_guesses: 10,
            attributes: ['debut_year', 'genre', 'nationality', 'gender', 'popularity_rank', 'group_size']
        });
    } catch (error) {
        console.error('Error in /api/today:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/artists - Get all artists for autocomplete
app.get('/api/artists', async (req, res) => {
    try {
        const artists = await db.getAllArtists();
        res.json(artists);
    } catch (error) {
        console.error('Error in /api/artists:', error);
        res.status(500).json({ error: 'Failed to fetch artists' });
    }
});

// POST /api/guess - Submit a guess and get feedback
app.post('/api/guess', async (req, res) => {
    try {
        const { artist_id, date } = req.body;

        // Validation
        if (!artist_id || !date) {
            return res.status(400).json({ error: 'Missing artist_id or date' });
        }

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        }

        // Get guessed artist
        const guessedArtist = await db.getArtistById(artist_id);
        if (!guessedArtist) {
            return res.status(404).json({ error: 'Artist not found' });
        }

        // Get mystery artist for the date
        const mysteryArtist = await db.getDailyArtist(date);
        if (!mysteryArtist) {
            return res.status(404).json({ error: 'No puzzle available for this date' });
        }

        // Check if correct
        const correct = guessedArtist.id === mysteryArtist.id;

        // Calculate feedback
        const feedback = await gameLogic.calculateFeedback(guessedArtist, mysteryArtist);

        res.json({
            correct,
            guessed_artist: {
                id: guessedArtist.id,
                name: guessedArtist.name,
                debut_year: guessedArtist.debut_year,
                genre: guessedArtist.genre,
                nationality: guessedArtist.nationality,
                gender: guessedArtist.gender,
                popularity_rank: guessedArtist.popularity_rank,
                group_size: guessedArtist.group_size
            },
            feedback
        });
    } catch (error) {
        console.error('Error in /api/guess:', error);
        res.status(500).json({ error: 'Failed to process guess' });
    }
});

// GET /api/result - Get the correct answer (only after game ends)
app.get('/api/result', async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Missing date parameter' });
        }

        // Get mystery artist for the date
        const mysteryArtist = await db.getDailyArtist(date);
        if (!mysteryArtist) {
            return res.status(404).json({ error: 'No puzzle available for this date' });
        }

        res.json({
            artist: {
                id: mysteryArtist.id,
                name: mysteryArtist.name,
                debut_year: mysteryArtist.debut_year,
                genre: mysteryArtist.genre,
                nationality: mysteryArtist.nationality,
                gender: mysteryArtist.gender,
                popularity_rank: mysteryArtist.popularity_rank,
                group_size: mysteryArtist.group_size
            }
        });
    } catch (error) {
        console.error('Error in /api/result:', error);
        res.status(500).json({ error: 'Failed to fetch result' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Initialize and start server
const startServer = async () => {
    // Retry DB connection up to 5 times with a 3-second pause between attempts.
    // This handles the edge case where Docker healthcheck passes but the
    // schema init scripts (01-schema.sql / 02-seed.sql) are still running.
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 3000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await db.query('SELECT NOW()');
            console.log('✓ Database connection successful');
            break; // Connection succeeded — exit retry loop
        } catch (error) {
            if (attempt === MAX_RETRIES) {
                console.error(`❌ Database unavailable after ${MAX_RETRIES} attempts. Exiting.`);
                console.error(error.message);
                process.exit(1);
            }
            console.warn(`⏳ DB not ready (attempt ${attempt}/${MAX_RETRIES}), retrying in ${RETRY_DELAY_MS / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
    }

    try {
        // Initialize today's daily artist
        await dailyArtist.initializeDailyArtist();

        // Schedule daily artist selection
        dailyArtist.scheduleDailySelection();

        // Start server
        app.listen(PORT, () => {
            console.log(`\n🚀 Spotle TN API server running on http://localhost:${PORT}`);
            console.log(`📅 Today's date: ${dailyArtist.getTodayDate()}`);
            console.log('\nAvailable endpoints:');
            console.log(`  GET  http://localhost:${PORT}/api/today`);
            console.log(`  GET  http://localhost:${PORT}/api/artists`);
            console.log(`  POST http://localhost:${PORT}/api/guess`);
            console.log(`  GET  http://localhost:${PORT}/api/result?date=YYYY-MM-DD`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
