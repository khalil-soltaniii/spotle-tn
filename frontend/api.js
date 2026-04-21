// api.js - API communication layer
// API_BASE_URL can be configured based on environment
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'  // Local development
    : 'http://localhost:3000/api'; // Docker or production - update as needed

// API error handler
const handleApiError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// GET /api/today - Get today's puzzle metadata
const fetchToday = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/today`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
};

// GET /api/artists - Get all artists for autocomplete
const fetchArtists = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/artists`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
};

// POST /api/guess - Submit a guess
const submitGuess = async (artistId, date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/guess`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                artist_id: artistId,
                date: date
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
};

// GET /api/result - Get the correct answer
const fetchResult = async (date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/result?date=${date}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
};

// Export API functions
window.API = {
    fetchToday,
    fetchArtists,
    submitGuess,
    fetchResult
};
