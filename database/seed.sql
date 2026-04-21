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

-- Clear existing artists
DELETE FROM artists;

-- Insert Tunisian artists
-- Rank is approximate for game logic
INSERT INTO artists (name, debut_year, genre, nationality, popularity_rank, group_size, gender, active) VALUES
-- Rap / Trap
('Balti', 2002, 'Rap', 'Tunisia', 1, 1, 'male', true),
('Samara', 2017, 'Rap', 'Tunisia', 2, 1, 'male', true),
('A.L.A', 2015, 'Rap', 'Tunisia', 3, 1, 'male', true),
('Sanfara', 2014, 'Rap', 'Tunisia', 4, 1, 'male', true),
('Kaso', 2016, 'Rap', 'Tunisia', 5, 1, 'male', true),
('Gal3i', 2018, 'Rap', 'Tunisia', 10, 1, 'male', true),
('El Général', 2008, 'Rap', 'Tunisia', 15, 1, 'male', true),
('Artmasta', 2012, 'Rap', 'Tunisia', 18, 1, 'male', true)
('Nidhal', 2015, 'Rap', 'Tunisia', 21, 1, 'male', true),
('Klay BBJ', 2008, 'Rap', 'Tunisia', 22, 1, 'male', true),
('Psyco-M', 2000, 'Rap', 'Tunisia', 23, 1, 'male', true),
('Nordo', 2016, 'Rap', 'Tunisia', 24, 1, 'male', true),
('GGA', 2013, 'Rap', 'Tunisia', 25, 1, 'male', true),
('Tchop', 2017, 'Rap', 'Tunisia', 26, 1, 'male', true),
('Madou MC', 2018, 'Rap', 'Tunisia', 27, 1, 'male', true),
('Armada Squad', 2010, 'Rap', 'Tunisia', 28, 4, 'male', true),
('Tawsen', 2019, 'Rap', 'Tunisia', 29, 1, 'male', true),
('GGA Squad', 2014, 'Rap', 'Tunisia', 30, 3, 'male', true),
('Didine Canon 16', 2015, 'Rap', 'Algeria', 31, 1, 'male', true),
('Lotfi Double Kanon', 1996, 'Rap', 'Algeria', 32, 1, 'male', true),
('Phobia Isaac', 2017, 'Rap', 'Tunisia', 33, 1, 'male', true),
('Mou9awama', 2012, 'Rap', 'Tunisia', 34, 1, 'male', true),
('Ghali', 2019, 'Rap', 'Tunisia', 35, 1, 'male', true),
('T3kl', 2020, 'Rap', 'Tunisia', 36, 1, 'male', true),
('Klayen', 2021, 'Rap', 'Tunisia', 37, 1, 'male', true),
('El Castro', 2016, 'Rap', 'Tunisia', 38, 1, 'male', true),
('Blidoss', 2018, 'Rap', 'Tunisia', 39, 1, 'male', true),
('Kif-Kif', 2015, 'Rap', 'Tunisia', 40, 2, 'male', true)
,

-- Pop / Oriental / Traditional
('Saber Rebai', 1988, 'Pop', 'Tunisia', 6, 1, 'male', true),
('Latifa Arfaoui', 1983, 'Pop', 'Tunisia', 7, 1, 'female', true),
('Amina Fakhet', 1980, 'Oriental', 'Tunisia', 8, 1, 'female', true),
('Nabiha Karaouli', 1990, 'Traditional', 'Tunisia', 12, 1, 'female', true),
('Zied Gharsa', 1992, 'Malouf', 'Tunisia', 14, 1, 'male', true),
('Dali Gana', 2010, 'Pop', 'Tunisia', 25, 1, 'male', true),
('Zaza', 2011, 'Pop', 'Tunisia', 20, 1, 'female', true),

-- Mezoued / Popular
('Hedi Habbouba', 1970, 'Mezoued', 'Tunisia', 9, 1, 'male', true),
('Walid Tounsi', 2005, 'Mezoued', 'Tunisia', 11, 1, 'male', true),
('Fatma Bousseha', 1985, 'Mezoued', 'Tunisia', 13, 1, 'female', true),
('Shamseddine Bacha', 2008, 'Mezoued', 'Tunisia', 22, 1, 'male', true),

-- Alternative / Indie / Jazz
('Emel Mathlouthi', 2008, 'Alternative', 'Tunisia', 16, 1, 'female', true),
('Ghalia Benali', 1992, 'Alternative', 'Tunisia', 17, 1, 'female', true),
('Dhafer Youssef', 1996, 'Jazz-Fusion', 'Tunisia', 19, 1, 'male', true),
('Anouar Brahem', 1981, 'Jazz-Fusion', 'Tunisia', 21, 1, 'male', true),
('Yuma', 2015, 'Indie', 'Tunisia', 23, 2, 'mixed', true),
('Jawhar', 2004, 'Indie', 'Tunisia', 24, 1, 'male', true),
('Nidhal Yahyaoui', 2012, 'Traditional', 'Tunisia', 26, 1, 'male', true),

-- Electronic
('Deena Abdelwahed', 2014, 'Electronic', 'Tunisia', 27, 1, 'female', true),
('Shinigami San', 2008, 'Electronic', 'Tunisia', 28, 1, 'male', true);

-- Reset daily artist to a valid one from the new list
DELETE FROM daily_artist;
INSERT INTO daily_artist (date, artist_id) 
SELECT '2026-01-15', id FROM artists WHERE name = 'Balti';
