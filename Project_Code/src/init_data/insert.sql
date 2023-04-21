-- The following inserts are for testing purposes

INSERT INTO users (username, password) VALUES ('ash_k', '$2b$10$h3tTO6ZKyPf2.rOHlviIFOJjy9xb8aqrBD1TDdR7qn.HA4XWhDlSO'); 
INSERT INTO users (username, password) VALUES ('jared', '$2b$10$h3tTO6ZKyPf2.rOHlviIFOJjy9xb8aqrBD1TDdR7qn.HA4XWhDlSO'); 

INSERT INTO games (game_id, name) VALUES (119277, 'Genshin Impact');
INSERT INTO games (game_id, name) VALUES (138162, 'Umineko no Naku Koro ni Chiru: Shinjitsu to Gensou no Nocturne');
INSERT INTO games (game_id, name) VALUES (11208, 'NieR: Automata');
INSERT INTO games (game_id, name) VALUES (80468, 'NieR RepliCant');
INSERT INTO games (game_id, name) VALUES (1805, 'Crazy Taxi');
INSERT INTO games (game_id, name) VALUES (26450, 'IllBleed');
INSERT INTO games (game_id, name) VALUES (6844, 'LEGO Star Wars III: The Clone Wars');

INSERT INTO reviews (review_id, review, rating) VALUES (1, 'ayaka is pretty :)', 8);
INSERT INTO reviews (review_id, review, rating) VALUES (2, '160 hours so far', 9.9);
INSERT INTO reviews (review_id, review, rating) VALUES (3, '2B or not 2B', 10);
INSERT INTO reviews (review_id, review, rating) VALUES (4, 'dooming humanity is so fun', 8.9);
INSERT INTO reviews (review_id, review, rating) VALUES (5, 'CRAAAAAAZY TAXIIIIII', 10);
INSERT INTO reviews (review_id, review, rating) VALUES (6, 'SEGA DREAM CAST IS SUPERIOR', 8);

INSERT INTO reviews (review_id, review, rating) VALUES (7, 'ewwww', 1);
INSERT INTO reviews (review_id, review, rating) VALUES (8, 'scrub', 1);
INSERT INTO reviews (review_id, review, rating) VALUES (9, 'miiid', 1);
INSERT INTO reviews (review_id, review, rating) VALUES (10, 'even more miiid', 1);
INSERT INTO reviews (review_id, review, rating) VALUES (11, 'CRAAAAAAZY TAXIIIIII', 1);
INSERT INTO reviews (review_id, review, rating) VALUES (12, 'best lego game', 20);

INSERT INTO entries (entry_id, game_id, review_id) VALUES (1, 119277, 1);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (2, 138162, 2);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (3, 11208, 3);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (4, 80468, 4);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (5, 1805, 5);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (6, 26450, 6);

INSERT INTO entries (entry_id, game_id, review_id) VALUES (7, 119277, 7);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (8, 138162, 8);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (9, 11208, 9);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (10, 80468, 10);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (11, 1805, 11);
INSERT INTO entries (entry_id, game_id, review_id) VALUES (12, 6844, 12);

INSERT INTO users_to_entries (username, entry_id) VALUES ('ash_k', 1);
INSERT INTO users_to_entries (username, entry_id) VALUES ('ash_k', 2);
INSERT INTO users_to_entries (username, entry_id) VALUES ('ash_k', 3);
INSERT INTO users_to_entries (username, entry_id) VALUES ('ash_k', 4);
INSERT INTO users_to_entries (username, entry_id) VALUES ('ash_k', 5);
INSERT INTO users_to_entries (username, entry_id) VALUES ('ash_k', 6);

INSERT INTO users_to_entries (username, entry_id) VALUES ('jared', 7);
INSERT INTO users_to_entries (username, entry_id) VALUES ('jared', 8);
INSERT INTO users_to_entries (username, entry_id) VALUES ('jared', 9);
INSERT INTO users_to_entries (username, entry_id) VALUES ('jared', 10);
INSERT INTO users_to_entries (username, entry_id) VALUES ('jared', 11);
INSERT INTO users_to_entries (username, entry_id) VALUES ('jared', 12);