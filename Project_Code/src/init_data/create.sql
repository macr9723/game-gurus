CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    game_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    UNIQUE(game_id)
);

CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY NOT NULL,
    review VARCHAR(200),
    rating DECIMAL NOT NULL
);

CREATE TABLE IF NOT EXISTS entries (
    entry_id SERIAL PRIMARY KEY,
    game_id INT NOT NULL REFERENCES games (game_id),
    review_id INT NOT NULL REFERENCES reviews (review_id)
);

CREATE TABLE IF NOT EXISTS users_to_entries (
    username VARCHAR(50) NOT NULL REFERENCES users (username),
    entry_id INT NOT NULL REFERENCES entries (entry_id)
);

CREATE OR REPLACE VIEW
  reviews AS
SELECT users_to_entries.username, reviews.review
FROM users_to_entries
JOIN entries ON users_to_entries.entry_id = entries.entry_id
JOIN reviews ON reviews.review_id = entries.review_id
WHERE entries.game_id = data[0];