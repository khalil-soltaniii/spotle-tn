// gameLogic.js - Core feedback calculation logic
const db = require('./database');

// Define nationality regions for partial matching
const NATIONALITY_REGIONS = {
    'Tunisia': ['Maghreb', 'North Africa', 'Arab', 'Africa'],
    'Algeria': ['Maghreb', 'North Africa', 'Arab', 'Africa'],
    'Morocco': ['Maghreb', 'North Africa', 'Arab', 'Africa'],
    'Libya': ['Maghreb', 'North Africa', 'Arab', 'Africa'],
    'Mauritania': ['Maghreb', 'North Africa', 'Arab', 'Africa'],
    'Egypt': ['North Africa', 'Arab', 'Africa'],
    'Lebanon': ['Levant', 'Arab', 'Middle East', 'Asia'],
    'Syria': ['Levant', 'Arab', 'Middle East', 'Asia'],
    'Palestine': ['Levant', 'Arab', 'Middle East', 'Asia'],
    'Jordan': ['Levant', 'Arab', 'Middle East', 'Asia'],
    'Iraq': ['Arab', 'Middle East', 'Asia'],
    'Saudi Arabia': ['Arab', 'Middle East', 'Asia'],
    'UAE': ['Arab', 'Middle East', 'Asia'],
};

// Check if two nationalities share a region
const areNationalitiesRelated = (nat1, nat2) => {
    if (nat1 === nat2) return false; // Exact match handled separately

    const regions1 = NATIONALITY_REGIONS[nat1] || [];
    const regions2 = NATIONALITY_REGIONS[nat2] || [];

    // Check for shared region
    return regions1.some(region => regions2.includes(region));
};

// Calculate feedback for debut year
const calculateYearFeedback = (guessedYear, mysteryYear) => {
    const diff = Math.abs(guessedYear - mysteryYear);

    if (diff === 0) {
        return { color: 'green', arrow: null };
    } else if (diff <= 5) {
        return {
            color: 'yellow',
            arrow: guessedYear < mysteryYear ? 'up' : 'down'
        };
    } else {
        return {
            color: 'gray',
            arrow: guessedYear < mysteryYear ? 'up' : 'down'
        };
    }
};

// Calculate feedback for genre
const calculateGenreFeedback = async (guessedGenre, mysteryGenre) => {
    if (guessedGenre === mysteryGenre) {
        return { color: 'green' };
    }

    // Check if genres are in the same family
    const related = await db.areGenresRelated(guessedGenre, mysteryGenre);

    if (related) {
        return { color: 'yellow' };
    } else {
        return { color: 'gray' };
    }
};

// Calculate feedback for nationality
const calculateNationalityFeedback = (guessedNat, mysteryNat) => {
    if (guessedNat === mysteryNat) {
        return { color: 'green' };
    }

    if (areNationalitiesRelated(guessedNat, mysteryNat)) {
        return { color: 'yellow' };
    } else {
        return { color: 'gray' };
    }
};

// Calculate feedback for popularity rank
const calculatePopularityFeedback = (guessedRank, mysteryRank) => {
    const diff = Math.abs(guessedRank - mysteryRank);

    if (diff === 0) {
        return { color: 'green', arrow: null };
    } else if (diff <= 50) {
        // Lower rank = more popular, so if guessed > mystery, mystery is MORE popular (up)
        return {
            color: 'yellow',
            arrow: guessedRank > mysteryRank ? 'up' : 'down'
        };
    } else {
        return {
            color: 'gray',
            arrow: guessedRank > mysteryRank ? 'up' : 'down'
        };
    }
};

// Calculate feedback for group size
const calculateGroupSizeFeedback = (guessedSize, mysterySize) => {
    const diff = Math.abs(guessedSize - mysterySize);

    if (diff === 0) {
        return { color: 'green', arrow: null };
    } else if (diff <= 2) {
        return {
            color: 'yellow',
            arrow: guessedSize < mysterySize ? 'up' : 'down'
        };
    } else {
        return {
            color: 'gray',
            arrow: guessedSize < mysterySize ? 'up' : 'down'
        };
    }
};

// Main feedback calculation function
const calculateFeedback = async (guessedArtist, mysteryArtist) => {
    const feedback = {
        debut_year: calculateYearFeedback(guessedArtist.debut_year, mysteryArtist.debut_year),
        genre: await calculateGenreFeedback(guessedArtist.genre, mysteryArtist.genre),
        nationality: calculateNationalityFeedback(guessedArtist.nationality, mysteryArtist.nationality),
        popularity_rank: calculatePopularityFeedback(guessedArtist.popularity_rank, mysteryArtist.popularity_rank),
        group_size: calculateGroupSizeFeedback(guessedArtist.group_size, mysteryArtist.group_size),
    };

    return feedback;
};

module.exports = {
    calculateFeedback,
    calculateYearFeedback,
    calculateGenreFeedback,
    calculateNationalityFeedback,
    calculatePopularityFeedback,
    calculateGroupSizeFeedback,
};
