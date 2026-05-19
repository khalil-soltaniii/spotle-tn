// app.js - Main game logic and state management

// ===== Game State =====
let gameState = {
    date: null,
    guesses: [],
    status: 'playing', // 'playing', 'won', 'lost'
    attempts_used: 0,
    max_guesses: 10,
    artists: [],
    usedArtistIds: new Set(),
};

let globalStats = {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
};

// ===== DOM Elements =====
const elements = {
    artistSearch: document.getElementById('artistSearch'),
    autocompleteDropdown: document.getElementById('autocompleteDropdown'),
    guessGrid: document.getElementById('guessGrid'),
    attemptsUsed: document.getElementById('attemptsUsed'),
    dayCounter: document.getElementById('dayCounter'),
    resultModal: document.getElementById('resultModal'),
    statsModal: document.getElementById('statsModal'),
    modalHeader: document.getElementById('modalHeader'),
    modalBody: document.getElementById('modalBody'),
    shareBtn: document.getElementById('shareBtn'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    statsBtn: document.getElementById('statsBtn'),
    resetBtn: document.getElementById('resetBtn'),
    closeStatsBtn: document.getElementById('closeStatsBtn'),
    toast: document.getElementById('toast'),
    instructions: document.getElementById('instructions'),
    closeInstructions: document.getElementById('closeInstructions'),
};

// ===== Utility Functions =====
const getTodayDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

const calculateDayNumber = (dateString) => {
    const startDate = new Date('2026-01-01');
    const currentDate = new Date(dateString);
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
};

const showToast = (message, duration = 3000) => {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, duration);
};

// ===== LocalStorage Functions =====
const saveGameState = () => {
    // Convert Set to Array for JSON serialization
    const stateToSave = {
        ...gameState,
        usedArtistIds: [...gameState.usedArtistIds]
    };
    localStorage.setItem(`spotle_game_${gameState.date}`, JSON.stringify(stateToSave));
};

const loadGameState = (date) => {
    const saved = localStorage.getItem(`spotle_game_${date}`);
    if (saved) {
        const parsed = JSON.parse(saved);
        // Convert usedArtistIds back to a Set
        parsed.usedArtistIds = new Set(parsed.usedArtistIds || []);
        return parsed;
    }
    return null;
};

const saveStats = () => {
    localStorage.setItem('spotle_stats', JSON.stringify(globalStats));
};

const loadStats = () => {
    const saved = localStorage.getItem('spotle_stats');
    if (saved) {
        globalStats = JSON.parse(saved);
    }
};

// ===== Autocomplete Functions =====
let selectedIndex = -1;

const filterArtists = (query) => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return gameState.artists.filter(artist =>
        artist.name.toLowerCase().includes(lowerQuery)
    );
};

const renderAutocomplete = (artists) => {
    if (artists.length === 0) {
        elements.autocompleteDropdown.classList.remove('show');
        return;
    }

    elements.autocompleteDropdown.innerHTML = artists.map((artist, index) => {
        // BUG FIX: usedArtistIds stores values from PostgreSQL (may be int or string).
        // Compare as strings to avoid type mismatch.
        const isUsed = gameState.usedArtistIds.has(String(artist.id));
        return `
      <div class="autocomplete-item ${index === selectedIndex ? 'selected' : ''} ${isUsed ? 'disabled' : ''}" 
           data-artist-id="${artist.id}" 
           data-index="${index}">
        ${artist.name} ${isUsed ? '(Already guessed)' : ''}
      </div>
    `;
    }).join('');

    elements.autocompleteDropdown.classList.add('show');

    // Add click handlers
    document.querySelectorAll('.autocomplete-item').forEach(item => {
        if (!item.classList.contains('disabled')) {
            item.addEventListener('click', () => {
                const artistId = item.getAttribute('data-artist-id');
                // BUG FIX: find by String comparison so int IDs from DB match string from dataset
                const artist = gameState.artists.find(a => String(a.id) === String(artistId));
                selectArtist(artist);
            });
        }
    });
};

const selectArtist = async (artist) => {
    if (!artist) {
        showToast('Artist not found. Please try again.');
        return;
    }

    // BUG FIX: compare as strings
    if (gameState.usedArtistIds.has(String(artist.id))) {
        showToast('Artist already guessed!');
        return;
    }

    if (gameState.status !== 'playing') {
        showToast('Game has ended!');
        return;
    }

    // Clear search
    elements.artistSearch.value = '';
    elements.autocompleteDropdown.classList.remove('show');
    selectedIndex = -1;

    // Submit guess
    await makeGuess(artist.id);
};

// ===== Guess Grid Functions =====
const renderGuessRow = (guess, feedback) => {
    const row = document.createElement('div');
    row.className = 'guess-row';

    row.innerHTML = `
    <div class="grid-cell artist-name">${guess.name}</div>
    <div class="grid-cell ${feedback.debut_year.color}">
      ${guess.debut_year}${feedback.debut_year.arrow ? `<span class="arrow">${feedback.debut_year.arrow === 'up' ? '⬆️' : '⬇️'}</span>` : ''}
    </div>
    <div class="grid-cell ${feedback.genre.color}">${guess.genre}</div>
    <div class="grid-cell ${feedback.nationality.color}">${guess.nationality}</div>
    <div class="grid-cell ${feedback.gender ? feedback.gender.color : 'gray'}">${guess.gender || ''}</div>
    <div class="grid-cell ${feedback.popularity_rank.color}">
      ${guess.popularity_rank}${feedback.popularity_rank.arrow ? `<span class="arrow">${feedback.popularity_rank.arrow === 'up' ? '⬆️' : '⬇️'}</span>` : ''}
    </div>
    <div class="grid-cell ${feedback.group_size.color}">
      ${guess.group_size}${feedback.group_size.arrow ? `<span class="arrow">${feedback.group_size.arrow === 'up' ? '⬆️' : '⬇️'}</span>` : ''}
    </div>
  `;

    elements.guessGrid.appendChild(row);
};

const renderAllGuesses = () => {
    elements.guessGrid.innerHTML = '';
    gameState.guesses.forEach(guess => {
        renderGuessRow(guess.artist, guess.feedback);
    });
};

// ===== Game Logic =====
const makeGuess = async (artistId) => {
    try {
        // Call API
        const response = await API.submitGuess(artistId, gameState.date);

        // BUG FIX: store as string so Set.has() comparison works consistently
        gameState.usedArtistIds.add(String(artistId));
        gameState.attempts_used++;
        gameState.guesses.push({
            artist: response.guessed_artist,
            feedback: response.feedback,
            correct: response.correct
        });

        // Render guess row
        renderGuessRow(response.guessed_artist, response.feedback);

        // Update attempts counter
        elements.attemptsUsed.textContent = gameState.attempts_used;

        // Check win/lose condition
        if (response.correct) {
            gameState.status = 'won';
            setTimeout(() => showWinModal(response.guessed_artist), 500);
            updateStats(true);
        } else if (gameState.attempts_used >= gameState.max_guesses) {
            gameState.status = 'lost';
            setTimeout(() => showLoseModal(), 500);
            updateStats(false);
        }

        // Save state
        saveGameState();

    } catch (error) {
        console.error('Error making guess:', error);
        showToast('Error submitting guess. Please try again.');
    }
};

// ===== Modal Functions =====
let currentAudio = null;

const playArtistSong = async (artistName) => {
    try {
        // We add Tunisian / Arabic keywords for better search accuracy
        const searchTerm = encodeURIComponent(artistName + ' tunisie');
        const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=1`);
        const data = await response.json();
        
        let track = null;
        if (data.results && data.results.length > 0) {
            track = data.results[0];
        } else {
            // Fallback search just the name if first search failed
            const fallbackResponse = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=1`);
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.results && fallbackData.results.length > 0) {
                track = fallbackData.results[0];
            }
        }

        if (track && track.previewUrl) {
            const audioContainer = document.createElement('div');
            audioContainer.style.marginTop = '1rem';
            audioContainer.style.textAlign = 'center';
            audioContainer.style.background = 'var(--color-bg-elevated)';
            audioContainer.style.padding = '10px';
            audioContainer.style.borderRadius = '12px';
            audioContainer.style.border = '1px solid hsla(280, 85%, 62%, 0.3)';

            audioContainer.innerHTML = `
                <p style="font-size: 0.9rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">
                    🎵 Now Playing: <strong>${track.trackName}</strong>
                </p>
                <audio id="artistAudio" controls autoplay style="width: 100%; height: 35px; border-radius: 8px;">
                    <source src="${track.previewUrl}" type="audio/mpeg">
                </audio>
            `;
            elements.modalBody.appendChild(audioContainer);
            
            currentAudio = document.getElementById('artistAudio');
            currentAudio.volume = 0.5;
            
            // Explicitly call play() to ensure it starts (browsers sometimes ignore the autoplay attribute on dynamic elements)
            const playPromise = currentAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay was prevented by the browser. User must click play.', error);
                });
            }
        }
    } catch (error) {
        console.error('Error fetching song preview:', error);
    }
};

const showWinModal = (artist) => {
    elements.modalHeader.innerHTML = '<h2>🎉 Congratulations!</h2>';
    elements.modalBody.innerHTML = `
    <p style="font-size: 1.2rem; margin-bottom: 1rem; text-align: center;">
      You guessed <strong style="color: var(--color-primary);">${artist.name}</strong> in 
      <strong style="color: var(--color-accent);">${gameState.attempts_used}</strong> ${gameState.attempts_used === 1 ? 'try' : 'tries'}!
    </p>
    <div style="text-align: center; margin-top: 1.5rem;">
      <p style="color: var(--color-text-secondary);">Next puzzle in:</p>
      <p id="countdown" style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);"></p>
    </div>
  `;
    elements.resultModal.classList.add('show');
    startCountdown();
    playArtistSong(artist.name);
};

const showLoseModal = async () => {
    try {
        const result = await API.fetchResult(gameState.date);
        const artist = result.artist;

        elements.modalHeader.innerHTML = '<h2>😔 Better Luck Tomorrow!</h2>';
        elements.modalBody.innerHTML = `
      <p style="font-size: 1.2rem; margin-bottom: 1rem; text-align: center;">
        The mystery artist was <strong style="color: var(--color-primary);">${artist.name}</strong>
      </p>
      <div style="background: var(--color-bg-elevated); padding: 1rem; border-radius: 12px; margin-top: 1rem;">
        <p style="font-size: 0.9rem; color: var(--color-text-secondary);">
          <strong>Year:</strong> ${artist.debut_year}<br>
          <strong>Genre:</strong> ${artist.genre}<br>
          <strong>Country:</strong> ${artist.nationality}<br>
          <strong>Rank:</strong> ${artist.popularity_rank}<br>
          <strong>Group Size:</strong> ${artist.group_size}
        </p>
      </div>
      <div style="text-align: center; margin-top: 1.5rem;">
        <p style="color: var(--color-text-secondary);">Next puzzle in:</p>
        <p id="countdown" style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);"></p>
      </div>
    `;
        elements.resultModal.classList.add('show');
        startCountdown();
        playArtistSong(artist.name);
    } catch (error) {
        console.error('Error fetching result:', error);
    }
};

const startCountdown = () => {
    // Calculate time until next midnight (local time)
    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0).getTime();

    const updateCountdown = () => {
        const currentTime = new Date().getTime();
        const diff = targetTime - currentTime;

        if (diff <= 0) {
            location.reload();
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            countdownEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
};

// ===== Share Function =====
const generateShareText = () => {
    const dayNum = calculateDayNumber(gameState.date);
    let text = `Spotle TN #${dayNum}\n`;

    if (gameState.status === 'won') {
        text += `✅ ${gameState.attempts_used}/${gameState.max_guesses}\n\n`;
    } else {
        text += `❌ ${gameState.attempts_used}/${gameState.max_guesses}\n\n`;
    }

    gameState.guesses.forEach(guess => {
        const feedback = guess.feedback;
        let row = '';
        ['debut_year', 'genre', 'nationality', 'gender', 'popularity_rank', 'group_size'].forEach(attr => {
            if (feedback[attr]) {
                if (feedback[attr].color === 'green') row += '🟩';
                else if (feedback[attr].color === 'yellow') row += '🟨';
                else row += '⬜';
            }
        });
        text += row + '\n';
    });

    return text;
};

const shareResult = () => {
    const shareText = generateShareText();

    if (navigator.share) {
        navigator.share({
            title: 'Spotle TN',
            text: shareText
        }).catch(err => console.log('Error sharing:', err));
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Result copied to clipboard!');
        }).catch(err => {
            console.error('Error copying:', err);
            showToast('Failed to copy result');
        });
    }
};

// ===== Stats Functions =====
const updateStats = (won) => {
    loadStats();

    globalStats.played++;
    if (won) {
        globalStats.won++;
        globalStats.currentStreak++;
        globalStats.maxStreak = Math.max(globalStats.maxStreak, globalStats.currentStreak);
    } else {
        globalStats.currentStreak = 0;
    }

    saveStats();
};

const showStatsModal = () => {
    loadStats();

    const winRate = globalStats.played > 0
        ? Math.round((globalStats.won / globalStats.played) * 100)
        : 0;

    document.getElementById('statPlayed').textContent = globalStats.played;
    document.getElementById('statWinRate').textContent = `${winRate}%`;
    document.getElementById('statCurrentStreak').textContent = globalStats.currentStreak;
    document.getElementById('statMaxStreak').textContent = globalStats.maxStreak;

    elements.statsModal.classList.add('show');
};

// ===== Event Listeners =====
elements.artistSearch.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    const filtered = filterArtists(query);
    selectedIndex = -1;
    renderAutocomplete(filtered);
});

elements.artistSearch.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.autocomplete-item:not(.disabled)');

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        renderAutocomplete(filterArtists(elements.artistSearch.value.trim()));
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        renderAutocomplete(filterArtists(elements.artistSearch.value.trim()));
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
            const artistId = items[selectedIndex].getAttribute('data-artist-id');
            // BUG FIX: String comparison for ID matching
            const artist = gameState.artists.find(a => String(a.id) === String(artistId));
            selectArtist(artist);
        }
    } else if (e.key === 'Escape') {
        elements.autocompleteDropdown.classList.remove('show');
    }
});

// Close autocomplete when clicking outside
document.addEventListener('click', (e) => {
    if (!elements.artistSearch.contains(e.target) && !elements.autocompleteDropdown.contains(e.target)) {
        elements.autocompleteDropdown.classList.remove('show');
    }
});

// Modal event listeners
elements.shareBtn.addEventListener('click', shareResult);
elements.closeModalBtn.addEventListener('click', () => {
    elements.resultModal.classList.remove('show');
    if (currentAudio) {
        currentAudio.pause();
    }
});
elements.statsBtn.addEventListener('click', showStatsModal);
elements.closeStatsBtn.addEventListener('click', () => {
    elements.statsModal.classList.remove('show');
});

// Instructions
elements.closeInstructions.addEventListener('click', () => {
    elements.instructions.classList.add('hidden');
    localStorage.setItem('spotle_instructions_seen', 'true');
});

// Reset game (single listener - de-duplicated)
elements.resetBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to reset today's game? This will clear your progress!")) {
        const date = gameState.date || getTodayDate();

        // Clear all game states
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('spotle_game_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        showToast('Game reset! Refreshing...');
        setTimeout(() => {
            location.reload();
        }, 1200);
    }
});

// ===== Initialization =====
const initGame = async () => {
    try {
        // Get today's date from the API
        const todayData = await API.fetchToday();
        gameState.date = todayData.date;
        gameState.max_guesses = todayData.max_guesses;

        // Update day counter
        const dayNum = calculateDayNumber(gameState.date);
        elements.dayCounter.textContent = `Day #${dayNum}`;

        // Load artists for autocomplete
        gameState.artists = await API.fetchArtists();

        // Check for saved game state
        const savedState = loadGameState(gameState.date);
        if (savedState) {
            // Keep the freshly fetched artists, don't overwrite them with old localStorage data
            const freshArtists = gameState.artists;
            gameState = savedState;
            gameState.artists = freshArtists;
            
            renderAllGuesses();
            elements.attemptsUsed.textContent = gameState.attempts_used;

            // If game already ended, show modal
            if (gameState.status === 'won') {
                const lastGuess = gameState.guesses[gameState.guesses.length - 1];
                showWinModal(lastGuess.artist);
            } else if (gameState.status === 'lost') {
                showLoseModal();
            }
        } else {
            elements.attemptsUsed.textContent = '0';
        }

        // Show instructions for first-time users
        const instructionsSeen = localStorage.getItem('spotle_instructions_seen');
        if (!instructionsSeen) {
            elements.instructions.classList.remove('hidden');
        } else {
            elements.instructions.classList.add('hidden');
        }

        console.log('✓ Game initialized successfully');
    } catch (error) {
        console.error('Error initializing game:', error);
        showToast('Error loading game. Please refresh the page.');
    }
};

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
