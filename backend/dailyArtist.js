// dailyArtist.js - Daily artist selection with cron scheduling
const cron = require('node-cron');
const db = require('./database');

// Select a random artist for a given date
const selectDailyArtist = async (date) => {
    try {
        // Check if artist already selected for this date
        const existing = await db.getDailyArtist(date);
        if (existing) {
            console.log(`✓ Daily artist already set for ${date}: ${existing.name}`);
            return existing;
        }

        // Get random artist not used in last 365 days
        const artist = await db.getRandomUnusedArtist(365);

        if (!artist) {
            console.error('❌ No available artists for daily selection');
            // Fallback: get any random active artist
            const fallback = await db.query('SELECT id FROM artists WHERE active = true ORDER BY RANDOM() LIMIT 1');
            if (fallback.rows.length === 0) {
                throw new Error('No active artists in database');
            }
            artist.id = fallback.rows[0].id;
        }

        // Set the daily artist
        await db.setDailyArtist(date, artist.id);

        const selectedArtist = await db.getDailyArtist(date);
        console.log(`✓ Selected daily artist for ${date}: ${selectedArtist.name}`);

        return selectedArtist;
    } catch (error) {
        console.error('Error selecting daily artist:', error);
        throw error;
    }
};

// Get today's date in YYYY-MM-DD format (UTC)
const getTodayDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

// Initialize daily artist for today
const initializeDailyArtist = async () => {
    const today = getTodayDate();
    await selectDailyArtist(today);
};

// Schedule daily artist selection at 00:00 UTC
const scheduleDailySelection = () => {
    // Run at 00:00 UTC every day
    cron.schedule('0 0 * * *', async () => {
        console.log('⏰ Running daily artist selection (00:00 UTC)...');
        const today = getTodayDate();
        await selectDailyArtist(today);
    }, {
        timezone: 'UTC'
    });

    console.log('✓ Daily artist selection cron job scheduled (00:00 UTC)');
};

module.exports = {
    selectDailyArtist,
    initializeDailyArtist,
    scheduleDailySelection,
    getTodayDate,
};
