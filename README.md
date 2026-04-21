# 🎵 Spotle TN - Tunisian Music Guessing Game

A daily web-based music guessing game featuring Tunisian and Maghreb artists. Players have 10 attempts to guess the mystery artist using attribute-based feedback (similar to Wordle).

## 🌟 Features

- **Daily Puzzle**: New mystery artist every day at 00:00 UTC
- **Attribute Feedback**: Color-coded hints for year, genre, nationality, popularity, and group size
- **Smart Matching**: Partial matches for related genres and regions
- **Statistics Tracking**: Win rate, streaks, and game history
- **Share Results**: Share your emoji grid on social media
- **Premium UI**: Dark mode with vibrant gradients and smooth animations
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## 🚀 Quick Start

### 🐳 Option 1: Docker (Recommended)

The fastest way to get started! Requires only Docker Desktop.

```bash
# Start all services (database, backend, frontend)
docker-compose up -d

# Visit http://localhost:8080 in your browser
```

That's it! See [DOCKER.md](DOCKER.md) for detailed Docker documentation.

### 💻 Option 2: Manual Setup

If you prefer to run the services manually:

### 1. Database Setup

First, create the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE spotle_tn;

# Exit psql
\q
```

Now initialize the schema and seed data:

```bash
# Run schema creation
psql -U postgres -d spotle_tn -f database/schema.sql

# Run seed data
psql -U postgres -d spotle_tn -f database/seed.sql
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp ../.env.example ../.env

# Edit .env with your database credentials
# Update DB_PASSWORD with your PostgreSQL password
```

### 3. Start the Backend Server

```bash
# From the backend directory
npm start
```

The API server will start on `http://localhost:3000`

### 4. Start the Frontend

Open the frontend in a browser:

```bash
# Option 1: Using Python (if installed)
cd frontend
python -m http.server 8080

# Option 2: Using Node.js http-server
npx http-server frontend -p 8080

# Option 3: Open index.html directly in your browser (may have CORS issues)
```

Visit `http://localhost:8080` in your browser to play!

## 📁 Project Structure

```
spotle-tn/
├── backend/
│   ├── server.js           # Express API server
│   ├── database.js         # PostgreSQL connection & queries
│   ├── gameLogic.js        # Feedback calculation logic
│   ├── dailyArtist.js      # Daily artist selection
│   └── package.json        # Backend dependencies
├── frontend/
│   ├── index.html          # Main game page
│   ├── styles.css          # Premium styling
│   ├── app.js              # Game logic & state
│   └── api.js              # API communication
├── database/
│   ├── schema.sql          # Database schema
│   └── seed.sql            # Sample artist data
├── .env.example            # Environment template
└── README.md               # This file
```

## 🔌 API Endpoints

### GET /api/today
Returns metadata for today's puzzle.

**Response:**
```json
{
  "date": "2026-01-15",
  "max_guesses": 10,
  "attributes": ["debut_year", "genre", "nationality", "popularity_rank", "group_size"]
}
```

### GET /api/artists
Returns list of all artists for autocomplete.

**Response:**
```json
[
  { "id": "uuid", "name": "Balti" },
  { "id": "uuid", "name": "Emel Mathlouthi" }
]
```

### POST /api/guess
Submit a guess and receive feedback.

**Request:**
```json
{
  "artist_id": "uuid",
  "date": "2026-01-15"
}
```

**Response:**
```json
{
  "correct": false,
  "guessed_artist": {
    "id": "uuid",
    "name": "Balti",
    "debut_year": 2005,
    "genre": "Rap",
    "nationality": "Tunisia",
    "popularity_rank": 1,
    "group_size": 1
  },
  "feedback": {
    "debut_year": { "color": "yellow", "arrow": "up" },
    "genre": { "color": "green" },
    "nationality": { "color": "green" },
    "popularity_rank": { "color": "gray", "arrow": "down" },
    "group_size": { "color": "yellow", "arrow": "up" }
  }
}
```

### GET /api/result?date=YYYY-MM-DD
Returns the correct artist for a given date (for ended games).

**Response:**
```json
{
  "artist": {
    "id": "uuid",
    "name": "Balti",
    "debut_year": 2005,
    ...
  }
}
```

## 🎨 Feedback System

### Color Codes

- 🟩 **Green**: Exact match
- 🟨 **Yellow**: Close or partial match
- ⬜ **Gray**: Incorrect

### Attribute Rules

| Attribute | Green | Yellow | Gray |
|-----------|-------|--------|------|
| **Year** | Exact match | ±5 years | >5 years difference |
| **Genre** | Same genre | Same genre family | Different |
| **Nationality** | Same country | Same region (Maghreb/Arab/Africa) | Different |
| **Popularity** | Exact rank | ±50 ranks | >50 difference |
| **Group Size** | Exact match | ±2 members | >2 difference |

### Arrows

- ⬆️ **Up**: Mystery artist's value is higher
- ⬇️ **Down**: Mystery artist's value is lower

## 🗄️ Database Schema

### Artists Table
```sql
id              UUID PRIMARY KEY
name            VARCHAR(255) UNIQUE
debut_year      INTEGER
genre           VARCHAR(100)
nationality     VARCHAR(100)
popularity_rank INTEGER
group_size      INTEGER
gender          VARCHAR(20)
active          BOOLEAN
```

### Daily Artist Table
```sql
date       DATE PRIMARY KEY
artist_id  UUID (references artists)
```

### Genre Families Table
```sql
family_name  VARCHAR(100)
genre        VARCHAR(100)
```

## 📊 Adding New Artists

To add new artists to the database:

```sql
INSERT INTO artists (name, debut_year, genre, nationality, popularity_rank, group_size, gender, active)
VALUES ('Artist Name', 2010, 'Genre', 'Country', 100, 1, 'male', true);
```

## ⚙️ Configuration

Edit the `.env` file to configure:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spotle_tn
DB_USER=postgres
DB_PASSWORD=yourpassword

# Server
PORT=3000
NODE_ENV=development
```

## 🚢 Deployment

### Backend Deployment

Deploy the backend API to any Node.js hosting platform:

- **Heroku**: `heroku create` and `git push heroku main`
- **Railway**: Connect GitHub repo
- **DigitalOcean**: Deploy as Node.js app
- **AWS/Azure**: Use App Service or EC2

**Don't forget to:**
1. Set environment variables
2. Create PostgreSQL database
3. Run schema and seed scripts

### Frontend Deployment

Deploy the frontend to any static hosting:

- **Netlify**: Drag and drop `frontend` folder
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Push to `gh-pages` branch
- **AWS S3**: Upload as static website

**Update API URL in `frontend/api.js`:**
```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';
```

## 🔒 Security Features

- Rate limiting (20 requests/minute)
- Input validation
- SQL injection prevention (parameterized queries)
- CORS configuration
- Mystery artist never exposed to client
- Server-side game logic validation

## 🛠️ Development

### Adding Genre Families

```sql
INSERT INTO genre_families (family_name, genre) VALUES
('Hip-Hop', 'Rap'),
('Hip-Hop', 'Trap');
```

### Manual Daily Artist Selection

```sql
INSERT INTO daily_artist (date, artist_id)
VALUES ('2026-01-16', 'artist-uuid-here');
```

### Reset Game State

Clear browser localStorage:
```javascript
localStorage.clear();
```

## 🐛 Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `psql -U postgres`
- Verify credentials in `.env`
- Ensure database exists: `\l` in psql

### CORS Error
- Ensure backend is running
- Check API_BASE_URL in `api.js`
- Enable CORS in backend (already configured)

### Artists Not Loading
- Check network tab in browser DevTools
- Verify backend is running on correct port
- Check `npm start` output for errors

## 📝 License

MIT License - Feel free to use and modify!

## 🙏 Credits

Inspired by Wordle and Heardle. Built for the Tunisian and Maghreb music community.

---

**Enjoy playing Spotle TN! 🎵**
#   s p o t l e - t n  
 