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
app.use(cors());
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
        const today = dailyArtist.getTodayDate();

        res.json({
            date: today,
            max_guesses: 10,
            attributes: ['debut_year', 'genre', 'nationality', 'popularity_rank', 'group_size']
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
    try {
        // Test database connection
        await db.query('SELECT NOW()');
        console.log('✓ Database connection successful');

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
