-- Spotle TN Database Schema
-- PostgreSQL 12+

-- Drop existing tables if recreating
DROP TABLE IF EXISTS daily_artist CASCADE;
DROP TABLE IF EXISTS genre_families CASCADE;
DROP TABLE IF EXISTS artists CASCADE;

-- Artists table: core entity with all game attributes
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    debut_year INTEGER NOT NULL,
    genre VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    popularity_rank INTEGER NOT NULL,
    group_size INTEGER NOT NULL DEFAULT 1,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('male', 'female', 'mixed', 'group')),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily artist selection: maps dates to mystery artists
CREATE TABLE daily_artist (
    date DATE PRIMARY KEY,
    artist_id UUID NOT NULL REFERENCES artists(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Genre families: defines which genres are "close" for yellow matches
CREATE TABLE genre_families (
    id SERIAL PRIMARY KEY,
    family_name VARCHAR(100) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    UNIQUE(family_name, genre)
);

-- Indexes for performance
CREATE INDEX idx_artists_active ON artists(active);
CREATE INDEX idx_artists_name ON artists(name);
CREATE INDEX idx_daily_artist_date ON daily_artist(date);
CREATE INDEX idx_genre_families_genre ON genre_families(genre);

-- Comments for documentation
COMMENT ON TABLE artists IS 'All available artists in the game database';
COMMENT ON TABLE daily_artist IS 'Daily puzzle assignments - one mystery artist per day';
COMMENT ON TABLE genre_families IS 'Genre groupings for partial match logic';
COMMENT ON COLUMN artists.popularity_rank IS 'Lower rank = more popular (1 is most popular)';
COMMENT ON COLUMN artists.group_size IS 'Number of members (1 for solo artists)';
