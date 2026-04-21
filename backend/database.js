// database.js - PostgreSQL connection and query helpers
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'spotle_tn',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on('connect', () => {
    console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

// Query helper functions
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Get all active artists (for autocomplete)
const getAllArtists = async () => {
    const sql = 'SELECT id, name FROM artists WHERE active = true ORDER BY name ASC';
    const result = await query(sql);
    return result.rows;
};

// Get artist by ID
const getArtistById = async (artistId) => {
    const sql = `
    SELECT id, name, debut_year, genre, nationality, popularity_rank, group_size, gender, active
    FROM artists 
    WHERE id = $1
  `;
    const result = await query(sql, [artistId]);
    return result.rows[0] || null;
};

// Get daily mystery artist for a specific date
const getDailyArtist = async (date) => {
    const sql = `
    SELECT a.id, a.name, a.debut_year, a.genre, a.nationality, 
           a.popularity_rank, a.group_size, a.gender, a.active
    FROM daily_artist da
    JOIN artists a ON da.artist_id = a.id
    WHERE da.date = $1
  `;
    const result = await query(sql, [date]);
    return result.rows[0] || null;
};

// Get genre family for a specific genre
const getGenreFamily = async (genre) => {
    const sql = 'SELECT family_name FROM genre_families WHERE genre = $1';
    const result = await query(sql, [genre]);
    return result.rows.length > 0 ? result.rows[0].family_name : null;
};

// Check if two genres are in the same family
const areGenresRelated = async (genre1, genre2) => {
    if (genre1 === genre2) return true;

    const sql = `
    SELECT COUNT(*) as count
    FROM genre_families gf1
    JOIN genre_families gf2 ON gf1.family_name = gf2.family_name
    WHERE gf1.genre = $1 AND gf2.genre = $2
  `;
    const result = await query(sql, [genre1, genre2]);
    return result.rows[0].count > 0;
};

// Insert or update daily artist
const setDailyArtist = async (date, artistId) => {
    const sql = `
    INSERT INTO daily_artist (date, artist_id)
    VALUES ($1, $2)
    ON CONFLICT (date) DO UPDATE SET artist_id = $2
    RETURNING *
  `;
    const result = await query(sql, [date, artistId]);
    return result.rows[0];
};

// Get random artist that hasn't been used in the last N days
const getRandomUnusedArtist = async (days = 365) => {
    const sql = `
    SELECT id FROM artists
    WHERE active = true
    AND id NOT IN (
      SELECT artist_id FROM daily_artist
      WHERE date > CURRENT_DATE - INTERVAL '${days} days'
    )
    ORDER BY RANDOM()
    LIMIT 1
  `;
    const result = await query(sql);
    return result.rows[0] || null;
};

module.exports = {
    pool,
    query,
    getAllArtists,
    getArtistById,
    getDailyArtist,
    getGenreFamily,
    areGenresRelated,
    setDailyArtist,
    getRandomUnusedArtist,
};
