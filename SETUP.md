# Spotle TN - Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js installed (v14+)
- [ ] PostgreSQL installed and running (v12+)
- [ ] npm installed

## Step-by-Step Setup

### 1. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE spotle_tn;"

# Initialize schema
psql -U postgres -d spotle_tn -f database/schema.sql

# Load sample data
psql -U postgres -d spotle_tn -f database/seed.sql
```

### 2. Backend Configuration

```bash
# Navigate to project
cd C:\Users\Khali\.gemini\antigravity\scratch\spotle-tn

# Create .env from template
copy .env.example .env

# Edit .env and update:
# - DB_PASSWORD=your_postgres_password
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
# Option 1: Using Python
cd frontend
python -m http.server 8080

# Option 2: Using Node.js
npx http-server frontend -p 8080
```

### 5. Play the Game

Open your browser and visit:
```
http://localhost:8080
```

## Quick Test

Once running, try these steps:

1. Type "Balti" in the search box
2. Select the artist
3. See the color-coded feedback!
4. Continue guessing until you win or use all 10 attempts

## Troubleshooting

**"Cannot connect to database"**
- Ensure PostgreSQL is running
- Check credentials in .env file
- Verify database exists: `psql -U postgres -l`

**"CORS error in browser"**
- Ensure backend is running on port 3000
- Check API_BASE_URL in frontend/api.js

**"Module not found"**
- Run `npm install` in backend directory
- Check Node.js version: `node --version`

## What's Included

- ✅ 25 Tunisian/Maghreb artists
- ✅ Full game logic with color feedback
- ✅ Daily puzzle rotation (00:00 UTC)
- ✅ Statistics tracking
- ✅ Share feature
- ✅ Premium dark mode UI

## Next Steps

1. **Add more artists**: Edit `database/seed.sql`
2. **Customize colors**: Edit `frontend/styles.css` CSS variables
3. **Deploy**: See README.md for deployment guide

Enjoy playing Spotle TN! 🎵
