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
('Balti',            2002, 'Rap',         'Tunisia', 1,  1, 'male',   true),
('Samara',           2017, 'Rap',         'Tunisia', 2,  1, 'male',   true),
('A.L.A',            2015, 'Rap',         'Tunisia', 3,  1, 'male',   true),
('Sanfara',          2014, 'Rap',         'Tunisia', 4,  1, 'male',   true),
('Kaso',             2016, 'Rap',         'Tunisia', 5,  1, 'male',   true),
('Gal3i',            2018, 'Rap',         'Tunisia', 10, 1, 'male',   true),
('El Général',       2008, 'Rap',         'Tunisia', 15, 1, 'male',   true),
('Artmasta',         2012, 'Rap',         'Tunisia', 18, 1, 'male',   true),
('Nidhal',           2015, 'Rap',         'Tunisia', 21, 1, 'male',   true),
('Klay BBJ',         2008, 'Rap',         'Tunisia', 22, 1, 'male',   true),
('Psyco-M',          2000, 'Rap',         'Tunisia', 23, 1, 'male',   true),
('Nordo',            2016, 'Rap',         'Tunisia', 24, 1, 'male',   true),
('GGA',              2013, 'Rap',         'Tunisia', 25, 1, 'male',   true),
('Tchop',            2017, 'Rap',         'Tunisia', 26, 1, 'male',   true),
('Madou MC',         2018, 'Rap',         'Tunisia', 27, 1, 'male',   true),
('Armada Squad',     2010, 'Rap',         'Tunisia', 28, 4, 'male',   true),
('Tawsen',           2019, 'Rap',         'Tunisia', 29, 1, 'male',   true),
('GGA Squad',        2014, 'Rap',         'Tunisia', 30, 3, 'male',   true),
('Didine Canon 16',  2015, 'Rap',         'Algeria', 31, 1, 'male',   true),
('Lotfi Double Kanon',1996,'Rap',         'Algeria', 32, 1, 'male',   true),
('Phobia Isaac',     2017, 'Rap',         'Tunisia', 33, 1, 'male',   true),
('Mou9awama',        2012, 'Rap',         'Tunisia', 34, 1, 'male',   true),
('Ghali',            2019, 'Rap',         'Tunisia', 35, 1, 'male',   true),
('T3kl',             2020, 'Rap',         'Tunisia', 36, 1, 'male',   true),
('Klayen',           2021, 'Rap',         'Tunisia', 37, 1, 'male',   true),
('El Castro',        2016, 'Rap',         'Tunisia', 38, 1, 'male',   true),
('Blidoss',          2018, 'Rap',         'Tunisia', 39, 1, 'male',   true),
('Kif-Kif',          2015, 'Rap',         'Tunisia', 40, 2, 'male',   true),

-- Pop / Oriental / Traditional
('Saber Rebai',      1988, 'Pop',         'Tunisia', 6,  1, 'male',   true),
('Latifa Arfaoui',   1983, 'Pop',         'Tunisia', 7,  1, 'female', true),
('Amina Fakhet',     1980, 'Oriental',    'Tunisia', 8,  1, 'female', true),
('Nabiha Karaouli',  1990, 'Traditional', 'Tunisia', 12, 1, 'female', true),
('Zied Gharsa',      1992, 'Malouf',      'Tunisia', 14, 1, 'male',   true),
('Dali Gana',        2010, 'Pop',         'Tunisia', 20, 1, 'male',   true),
('Zaza',             2011, 'Pop',         'Tunisia', 19, 1, 'female', true),

-- Mezoued / Popular
('Hedi Habbouba',    1970, 'Mezoued',     'Tunisia', 9,  1, 'male',   true),
('Walid Tounsi',     2005, 'Mezoued',     'Tunisia', 11, 1, 'male',   true),
('Fatma Bousseha',   1985, 'Mezoued',     'Tunisia', 13, 1, 'female', true),
('Shamseddine Bacha',2008, 'Mezoued',     'Tunisia', 16, 1, 'male',   true),

-- Alternative / Indie / Jazz
('Emel Mathlouthi',  2008, 'Alternative', 'Tunisia', 17, 1, 'female', true),
('Ghalia Benali',    1992, 'Alternative', 'Tunisia', 41, 1, 'female', true),
('Dhafer Youssef',   1996, 'Jazz-Fusion', 'Tunisia', 42, 1, 'male',   true),
('Anouar Brahem',    1981, 'Jazz-Fusion', 'Tunisia', 43, 1, 'male',   true),
('Yuma',             2015, 'Indie',       'Tunisia', 44, 2, 'mixed',  true),
('Jawhar',           2004, 'Indie',       'Tunisia', 45, 1, 'male',   true),
('Nidhal Yahyaoui',  2012, 'Traditional', 'Tunisia', 46, 1, 'male',   true),

-- Electronic
('Deena Abdelwahed', 2014, 'Electronic',  'Tunisia', 47, 1, 'female', true),
('Shinigami San',    2008, 'Electronic',  'Tunisia', 48, 1, 'male',   true),
('Amina Annabi',      1978, 'Pop',            'Tunisia', 41, 1, 'female', false),
('Lotfi Bouchnak',    1979, 'Traditional',    'Tunisia', 42, 1, 'male',   true),
('Sonia Mbarek',    1978, 'Arabic music',   'Tunisia', 43, 1, 'female', true),
('Chahrazed Helal',   1998, 'Arabic music',   'Tunisia', 44, 1, 'female', true),
('Shayma Helali',     2006, 'Arabesque',      'Tunisia', 45, 1, 'female', true),
('Nader Guirat',      2008, 'Pop rock',       'Tunisia', 46, 1, 'male',   true),
('Kacem Kefi',        1970, 'Traditional',    'Tunisia', 47, 1, 'male',   false),
('Sabri Mosbah',      2015, 'Pop',            'Tunisia', 48, 1, 'male',   true),
('Ahmed Rebai',       2016, 'Arabic music',   'Tunisia', 49, 1, 'male',   true),
('Belgacem Bouguenna',2009, 'Mezoued',        'Tunisia', 50, 1, 'male',   false),
('Kafon',             2013, 'Hip-hop',        'Tunisia', 51, 1, 'male',   false),
('Marwan Ali',        2007, 'Pop',            'Tunisia', 52, 1, 'male',   true),
('Mehdi Ayachi',      2017, 'Arabic pop',     'Tunisia', 53, 1, 'male',   true),
('Naâma',             1958, 'Arabic music',   'Tunisia', 54, 1, 'female', false),
('Thekra',            1980, 'Arabesque',      'Tunisia', 55, 1, 'female', false),('Fawzi Ben Gamra',    2000, 'Mezoued',   'Tunisia', 56, 1, 'male', true),
('Cheb Bachir',        2005, 'Mezoued',   'Tunisia', 57, 1, 'male', true),
('Houcine Jaziri',     1998, 'Mezoued',   'Tunisia', 58, 1, 'male', true),
('Ridha Chmakhi',      2002, 'Mezoued',   'Tunisia', 59, 1, 'male', true),
('Noureddine Ben Ayed',1995, 'Mezoued',   'Tunisia', 60, 1, 'male', true),
('Mokhtar Aloui',      2003, 'Mezoued',   'Tunisia', 61, 1, 'male', true),
('Habib Jbali',        1999, 'Mezoued',   'Tunisia', 62, 1, 'male', true),
('Abdelhamid Bousbia', 2001, 'Mezoued',   'Tunisia', 63, 1, 'male', true),
('Karim Boussaha',     2004, 'Mezoued',   'Tunisia', 64, 1, 'male', true),
('Sofiene Safi',       2006, 'Mezoued',   'Tunisia', 65, 1, 'male', true),
('Mourad Jebali',      2000, 'Mezoued',   'Tunisia', 66, 1, 'male', true),
('Ali Guesmi',         1997, 'Mezoued',   'Tunisia', 67, 1, 'male', true),

-- Wedding / Popular Pop
('Omar Dhifallah',     2010, 'Popular',   'Tunisia', 68, 1, 'male', true),
('Mahdi Ayari',        2012, 'Popular',   'Tunisia', 69, 1, 'male', true),
('Hatem Karoui',       2011, 'Popular',   'Tunisia', 70, 1, 'male', true),
('Skander Hamdi',      2013, 'Popular',   'Tunisia', 71, 1, 'male', true),
('Walid Nahdi',        2014, 'Popular',   'Tunisia', 72, 1, 'male', true),

-- Female Mezoued / Popular
('Najet Attia',        1990, 'Mezoued',   'Tunisia', 73, 1, 'female', true),
('Zina Gasrinia',      2005, 'Popular',   'Tunisia', 74, 1, 'female', true),
('Asma Ben Ahmed',     2008, 'Popular',   'Tunisia', 75, 1, 'female', true),
('Mouna Jbali',        2010, 'Popular',   'Tunisia', 76, 1, 'female', true),
('Weld El 15',        2013, 'Rap', 'Tunisia', 77, 1, 'male', true),
('K2Rhym',            2010, 'Rap', 'Tunisia', 78, 1, 'male', true),
('Master Sina',       2009, 'Rap', 'Tunisia', 80, 1, 'male', true),
('Black Diamond',     2017, 'Rap', 'Tunisia', 83, 2, 'male', true),
('MC Kanz',           2014, 'Rap', 'Tunisia', 84, 1, 'male', true),
('Vipa',              2019, 'Rap', 'Tunisia', 85, 1, 'male', true),
('RedStar',           2017, 'Rap', 'Tunisia', 89, 1, 'male', true),
('Zomra',             2020, 'Rap', 'Tunisia', 90, 1, 'male', true);

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
