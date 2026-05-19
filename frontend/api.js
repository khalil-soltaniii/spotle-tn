// api.js - API communication layer

const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' || 
                window.location.hostname === ''; // Covers file:/// URLs

// In local development, safely force connection to the backend port 3000
// In production (GitHub Pages/VPS), use the relative /api proxy path
const API_BASE_URL = isLocal
    ? 'http://localhost:3000/api'
    : '/api';

// API error handler
const handleApiError = (error) => {
    console.error('API Error:', error);
    throw error;
};

// GET /api/today
const fetchToday = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/today`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
};

// GET /api/artists
const fetchArtists = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/artists`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
};

// POST /api/guess
const submitGuess = async (artistId, date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/guess`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ artist_id: artistId, date: date })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
};

// GET /api/result
const fetchResult = async (date) => {
    try {
        const response = await fetch(`${API_BASE_URL}/result?date=${date}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        handleApiError(error);
    }
};

// Export
window.API = {
    fetchToday,
    fetchArtists,
    submitGuess,
    fetchResult
};