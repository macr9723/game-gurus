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

INSERT INTO reviews (review, rating) VALUES ('ayaka is pretty :)', 8); --1
INSERT INTO reviews (review, rating) VALUES ('160 hours so far', 9.9); --2
INSERT INTO reviews (review, rating) VALUES ('2B or not 2B', 10); --3
INSERT INTO reviews (review, rating) VALUES ('dooming humanity is so fun', 8.9); --4
INSERT INTO reviews (review, rating) VALUES ('CRAAAAAAZY TAXIIIIII', 10); --5
INSERT INTO reviews (review, rating) VALUES ('SEGA DREAM CAST IS SUPERIOR', 8); --6

INSERT INTO reviews (review, rating) VALUES ('ewwww', 1); --7
INSERT INTO reviews (review, rating) VALUES ('scrub', 1); --8
INSERT INTO reviews (review, rating) VALUES ('miiid', 1); --9
INSERT INTO reviews (review, rating) VALUES ('even more miiid', 1); --10
INSERT INTO reviews (review, rating) VALUES ('CRAAAAAAZY TAXIIIIII', 1); --11
INSERT INTO reviews (review, rating) VALUES ('best lego game', 20); --12

INSERT INTO entries (game_id, review_id) VALUES (119277, 1); --1
INSERT INTO entries (game_id, review_id) VALUES (138162, 2); --2
INSERT INTO entries (game_id, review_id) VALUES (11208, 3); --3
INSERT INTO entries (game_id, review_id) VALUES (80468, 4); --4
INSERT INTO entries (game_id, review_id) VALUES (1805, 5); --5
INSERT INTO entries (game_id, review_id) VALUES (26450, 6); --6

INSERT INTO entries (game_id, review_id) VALUES (119277, 7); --7
INSERT INTO entries (game_id, review_id) VALUES (138162, 8); --8
INSERT INTO entries (game_id, review_id) VALUES (11208, 9); --9
INSERT INTO entries (game_id, review_id) VALUES (80468, 10); --10
INSERT INTO entries (game_id, review_id) VALUES (1805, 11); --11
INSERT INTO entries (game_id, review_id) VALUES (6844, 12); --12

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