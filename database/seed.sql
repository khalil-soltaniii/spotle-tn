-- Spotle TN Seed Data
-- Exclusively Tunisian Artists

-- Insert genre families (for yellow match logic)
DELETE FROM genre_families;
INSERT INTO genre_families (family_name, genre) VALUES
-- Hip-Hop family
('Hip-Hop', 'Hip-Hop'),
('Hip-Hop', 'Rap'),
('Hip-Hop', 'Trap'),
-- Traditional family
('Traditional', 'Traditional'),
('Traditional', 'Malouf'),
('Traditional', 'Mezoued'),
('Traditional', 'Stambeli'),
-- Pop family
('Pop', 'Pop'),
('Pop', 'Electro-Pop'),
('Pop', 'Pop-Rock'),
('Pop', 'Oriental'),
-- Electronic family
('Electronic', 'Electronic'),
('Electronic', 'Techno'),
('Electronic', 'House'),
-- Rock family
('Rock', 'Rock'),
('Rock', 'Pop-Rock'),
('Rock', 'Metal'),
-- World family
('World', 'World'),
('World', 'Fusion'),
('World', 'Jazz-Fusion'),
('World', 'Alternative'),
('World', 'Indie');

-- Clear existing data (order matters due to foreign keys)
DELETE FROM daily_artist;
DELETE FROM artists;

-- Insert Tunisian artists
-- BUG FIX: added missing comma after Artmasta row
INSERT INTO artists (name, debut_year, genre, nationality, popularity_rank, group_size, gender, active) VALUES
-- Rap / Trap
('Emel Mathlouthi', 2008, 'Alternative', 'Tunisia', 1, 1, 'female', true),
('Yuma',            2015, 'Indie',       'Tunisia', 2, 2, 'mixed',  true),
('NVST',            2022, 'Electronic',  'Tunisia', 3, 1, 'female', true),
('Amon',            2021, 'Electronic',  'Tunisia', 4, 1, 'male', true),
('COSMIC',          2022, 'Electronic',  'Tunisia', 5, 1, 'male', true), -- POP / ORIENTAL

('Saber Rebai',     1988, 'Pop',       'Tunisia', 1, 1, 'male', true),
('Latifa Arfaoui',  1983, 'Pop',       'Tunisia', 2, 1, 'female', true),
('Amina Fakhet',    1980, 'Oriental',  'Tunisia', 3, 1, 'female', true),
('Nabiha Karaouli', 1990, 'Traditional','Tunisia',4,1,'female',true),
('Zied Gharsa',     1992, 'Malouf',    'Tunisia', 5, 1, 'male', true),

('Mortadha Ftiti',  2017, 'Pop',       'Tunisia', 6, 1, 'male', true),
('Mehdi Mouelhi',   2018, 'Pop',       'Tunisia', 7, 1, 'male', true),
('Sabri Mosbah',    2015, 'Pop',       'Tunisia', 8, 1, 'male', true),
('Ahmed Rebai',     2016, 'Pop',       'Tunisia', 9, 1, 'male', true),-- MEZOUED

('Fawzi Ben Gamra', 2000, 'Mezoued', 'Tunisia', 1, 1, 'male', true),
('Hedi Habbouba',   1970, 'Mezoued', 'Tunisia', 2, 1, 'male', true),
('Samir Loussif',   1988, 'Mezoued', 'Tunisia', 3, 1, 'male', true),
('Lotfi Jormana',   2000, 'Mezoued', 'Tunisia', 4, 1, 'male', true),
('Salah Farzit',    1985, 'Mezoued', 'Tunisia', 5, 1, 'male', true),

('Walid Tounsi',    2005, 'Mezoued', 'Tunisia', 6, 1, 'male', true),
('Cheb Salih',      2005, 'Mezoued', 'Tunisia', 7, 1, 'male', true),
('Cheb Houssem',    2010, 'Mezoued', 'Tunisia', 8, 1, 'male', true),
('Fatma Bousseha',  1985, 'Mezoued', 'Tunisia', 9, 1, 'female', true),
('Noureddine Ben Ayed',1995,'Mezoued','Tunisia',10,1,'male',true),-- RAP / TRAP / DRILL

('Samara',        2017, 'Rap',   'Tunisia', 1, 1, 'male', true),
('A.L.A',         2015, 'Rap',   'Tunisia', 2, 1, 'male', true),
('Balti',         2002, 'Rap',   'Tunisia', 3, 1, 'male', true),
('Sanfara',       2014, 'Rap',   'Tunisia', 4, 1, 'male', true),
('JenJoon',       2020, 'Rap',   'Tunisia', 5, 1, 'male', true),
('Kaso',          2016, 'Rap',   'Tunisia', 6, 1, 'male', true),

('El Castro',     2016, 'Rap',   'Tunisia', 7, 1, 'male', true),
('Ktyb',          2021, 'Drill', 'Tunisia', 8, 1, 'male', true),
('Tchiggy',       2021, 'Trap',  'Tunisia', 9, 1, 'male', true),
('Young Rz',      2021, 'Trap',  'Tunisia', 10,1, 'male', true),

('Stou',          2018, 'Rap',   'Tunisia', 11,1, 'male', true),
('G.G.A',         2013, 'Rap',   'Tunisia', 12,1, 'male', true),
('4lfa',          2020, 'Trap',  'Tunisia', 13,1, 'male', true),
('EMP1RE',        2021, 'Trap',  'Tunisia', 14,1, 'male', true),

('Mouka',         2020, 'Trap',  'Tunisia', 15,1, 'male', true),
('Emino',         2021, 'Trap',  'Tunisia', 16,1, 'male', true),
('RedStar',       2020, 'Rap',   'Tunisia', 17,1, 'male', true),
('SC Papi',       2023, 'Drill', 'Tunisia', 18,1, 'male', true),

('Xiivi',         2020, 'Drill', 'Tunisia', 19,1, 'male', true),
('Naqqa',         2020, 'Rap',   'Tunisia', 20,1, 'male', true),
('Aveyro Ave',    2021, 'Trap',  'Tunisia', 21,1, 'male', true),
('Tati G13',      2020, 'Rap',   'Tunisia', 22,1, 'male', true),

('Linko',         2020, 'Trap',  'Tunisia', 23,1, 'male', true),
('Esserpent',     2021, 'Trap',  'Tunisia', 24,1, 'male', true),
('BLVCK 7050',    2021, 'Trap',  'Tunisia', 25,1, 'male', true),
('Joujma',        2021, 'Rap',   'Tunisia', 26,1, 'male', true);

-- ─── Daily Artist Schedule ─────────────────────────────────────────────────────
-- Seed a daily artist for every day in 2026 by rotating through artists.
-- This ensures there is always a valid puzzle for today's date.
-- The backend's initializeDailyArtist() will handle future dates automatically.
INSERT INTO daily_artist (date, artist_id)
SELECT
    ('2026-01-01'::date + (n || ' days')::interval)::date AS date,
    a.id
FROM generate_series(0, 364) AS n
JOIN (
    SELECT id, ROW_NUMBER() OVER (ORDER BY popularity_rank) - 1 AS rn
    FROM artists
    WHERE active = true
) a ON (n % (SELECT COUNT(*) FROM artists WHERE active = true)) = a.rn
ON CONFLICT (date) DO NOTHING;
