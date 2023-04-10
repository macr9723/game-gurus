CREATE TABLE IF NOT EXISTS users(
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL,
    age INTEGER NOT NULL,
    user_platform VARCHAR(50) NOT NULL
);

-- decimal(p,s) p is the amount of #'s allowed before . s is amount allowed after
CREATE TABLE IF NOT EXISTS games(
    name VARCHAR(100) PRIMARY KEY,
    year INTEGER NOT NULL,
    avg_rating DECIMAL(2,1) NOT NULL
);

CREATE TABLE IF NOT EXISTS game_libraries(
    lib_id NUMERIC PRIMARY KEY,
    review VARCHAR(250) NOT NULL,
    user_rating DECIMAL(2,1) NOT NULL,
    username VARCHAR(50) NOT NULL REFERENCES users (username),
    game VARCHAR(100) NOT NULL REFERENCES games (name)
);

CREATE TABLE IF NOT EXISTS genres (
    genre_id NUMERIC PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS platforms (
    platform_id NUMERIC PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS platforms_to_games(
    plaform_id INTEGER NOT NULL REFERENCES platforms (platform_id),
    game VARCHAR(100) NOT NULL REFERENCES games (name)
);

CREATE TABLE IF NOT EXISTS genres_to_games(
    genre_id INTEGER NOT NULL REFERENCES genres (genre_id),
    game VARCHAR(100) NOT NULL REFERENCES games (name)
);