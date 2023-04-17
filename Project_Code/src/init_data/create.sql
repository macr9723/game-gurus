CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
    --email VARCHAR(200) NOT NULL,
    --age INTEGER NOT NULL,
    --user_platform VARCHAR(50) NOT NULL
);

-- decimal(p,s) p is the amount of #'s allowed before . s is amount allowed after
CREATE TABLE IF NOT EXISTS games (
    game_id INTEGER PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users_to_games (
    game_id NOT NULL REFERENCES games (game_id),
    username NOT NULL REFERENCES users (username)
);


--CREATE TABLE IF NOT EXISTS game_libraries(
    --lib_id NUMERIC PRIMARY KEY,
    --review VARCHAR(250) NOT NULL,
    --user_rating DECIMAL(2,1) NOT NULL,
    --username VARCHAR(50) NOT NULL REFERENCES users (username),
    --game VARCHAR(100) NOT NULL REFERENCES games (name)
--);