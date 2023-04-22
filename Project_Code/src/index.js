// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

const user = {
  username: undefined,
  password: undefined,
};

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Serve static files from the resources folder
var path = require('path');
app.use(express.static(path.join(__dirname, 'resources')));

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************



//REGISTER API

app.get('/', (req, res) => {
  res.render('pages/login');
});

app.get('/register', (req, res) => {
    res.render('pages/register', {});
});

// Welcome test case
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});

});
  
app.post('/register', async (req, res) => {

  //hash the password using bcrypt library
  const username = req.body.username;
  const hash = await bcrypt.hash(req.body.password, 10);

  //Catch if a user exists in the table already
  const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);

  if (!user) {
    const query = "insert into users (username, password) values ($1, $2) returning * ;";
    const values = [username, hash];
    db.one(query,values)
    .then((data) => {
      console.log(data);
      //Successfull registration test case
      //res.status(200).json({
        //status: 'Success',
        //message: 'Registration Successful'
      //});
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      //Unsuccessful registration test case default
      //res.status(500).json({
        //status: 'Error',
        //message: 'Registration Failed'
      //});
      res.redirect("/register");
    });
  } else {
    //Unsuccessful registration test case
    //res.status(409).json({
      //status: 'Error',
      //message: 'Username already exists'
    //});
    res.render('pages/register', {
      error: true,
      message: 'Username already exists'
    });
    return;
  }

});

// LOGIN API

// Render Login
app.get('/login', (req, res) => {
	res.render("pages/login");
});

// Try/catch *** do we want to keep db of usernames?? ***


app.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		// Find user by username
		const [userFound] = await db.any('SELECT * FROM users WHERE username = $1', username);

		if (!userFound) {
			// User not found, redirect to register page
			res.render('pages/register', {
        error: true,
        message: 'User Not Found',
      });
		}
    
    user.username = userFound.username;
    user.password = userFound.password;
		// Compare password from request with password in DB
		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			// Passwords don't match, throw error

      // negative test case
      // Send JSON error response with 200 status code
      //res.status(200).json({ status: 'error', message: 'Incorrect Username or Password' });
			res.render('pages/login', {
        error: true,
        message: 'Incorrect Username or Password',
     });

		}

		// Passwords match, save user in session
		req.session.user = user;
		req.session.save();

    //testcase message
    //res.status(200).json({ status: 'Success', message: 'Login Successful', user });
    // Redirect to /discover
    res.redirect('/discover');
    
    //The reason we can't use the code below is that we are using a redirect to discover instead.
    //res.render('pages/discover', {
      //status: 'success',
      //message: 'Login Successful'
    //})


	} catch (error) {
		// Handle error and render login page with error message
		res.render('pages/login', { message: error.message });
	}
});


// Authentication Middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect('/login');
  }
  next();
};

// Authentication Required
app.use(auth);

app.get('/discover', (req, res) => {
  const highest_rated_games =  axios({
    url: "https://api.igdb.com/v4/games",
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Client-ID': '3wjgq5511om2hr753zb9vz2uvhxoae',
        'Authorization': `Bearer ${process.env.API_KEY}`,
    },
    data: "fields id,name,cover.*; sort total_rating desc; limit 25; where total_rating_count > 1000;"

  });


  const newest_games = axios({
    url: "https://api.igdb.com/v4/games",
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Client-ID': '3wjgq5511om2hr753zb9vz2uvhxoae',
        'Authorization': `Bearer ${process.env.API_KEY}`,
    },
    data: "fields id,name,cover.*; sort release_dates desc; where release_dates < 1676745711;limit 25;"

  });

  Promise.all([highest_rated_games, newest_games])
    .then(results => {
      const highest_rated_games = results[0].data;
      const newest_games = results[1].data;
      res.render('pages/discover', {
        highest_rated_games,
        newest_games,
      });
    })
    .catch(error => {
      console.log(error);
      res.render('pages/discover', {
        highest_rated_games: [],
        newest_games: [],
      });
    });
});

app.get("/search",(req,res)=>{
  const search = req.query.search;

  axios({
  url: "https://api.igdb.com/v4/games",
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Client-ID': '3wjgq5511om2hr753zb9vz2uvhxoae',
      'Authorization': `Bearer ${process.env.API_KEY}`,
  },
    params: {
      search: search,
      limit: 25,
      fields: "id,name,cover.*",
    },
    

})
  .then(response => {
      console.log(response.data);
      res.render('pages/search',{
        data: response.data,
      })
  })
  .catch(err => {
      console.error(err);
  });

});

app.get("/gamepage/:id",(req,res)=>{

  const game_id = req.params.id;

  axios({
    url: "https://api.igdb.com/v4/games",
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Client-ID': '3wjgq5511om2hr753zb9vz2uvhxoae',
        'Authorization': `Bearer ${process.env.API_KEY}`,
    },
      data: `fields name,artworks.*,cover.*,  screenshots.*, summary, platforms.*, release_dates.*, similar_games.*, similar_games.cover.*; where id = ${game_id};`
      //category,genres.*, involved_companies.*, ,storyline, tags.*, total_rating, total_rating_count
  
  })
    .then(response => {
        console.log(response.data);
        res.render('pages/gamepage',{
          data: response.data,
        })
    })
    .catch(err => {
        console.error(err);
    });
  });

app.get('/dashboard', async (req, res) => {
  const findUsergames = `SELECT * FROM entries INNER JOIN games
  ON entries.game_id = games.game_id INNER JOIN reviews
  ON entries.review_id = reviews.review_id INNER JOIN users_to_entries
  ON entries.entry_id = users_to_entries.entry_id
  WHERE users_to_entries.username = $1;`;

  db.any(findUsergames, [req.session.user.username])
  .then((games) => {
    console.log(games)
    res.render("pages/dashboard", {
      games,
    });
  })
  .catch((err) => {
    res.render("pages/dashboard", {
      games: [],
      error: true,
      message: err.message,
    });
  });
});


app.post('/add_game', async (req,res) => {
  // db queries
  const insertGame = 'insert into games (game_id, name) values ($1, $2) returning * ;';
  const insertReview = 'insert into reviews (review, rating) values ($1, $2) returning * ;';
  const insertEntry = 'insert into entries (game_id, review_id) values ($1, $2) returning * ;';
  const insertUsers_to_Entries = 'insert into users_to_entries (username, entry_id) values ($1, $2) returning * ;';

  // getting params
  const game_id = req.body.gameId;
  const name = req.body.gameName;
  const rating = req.body.rating;
  const review = req.body.review;
  
  // Before updating games table check if a game already exists in the database
  try {
    console.log("game_id:", game_id);
    const [gameFound] = await db.any(`select game_id from games where game_id = $1`, [game_id])
    if (gameFound.length==0) {
      db.any(insertGame, [game_id, name])
        .then(function (data) {
          res.status(201).json({
          status: 'success',
          data: data,
          });
        })
        .catch(function (err) {
          return console.log(err);
        });
    }

  
    // If the game is already in our database we can update the rest of the tables accordingly
    const [newReview] = await db.any(insertReview, [review, rating])
    const [newEntry] = await db.any(insertEntry, [game_id, newReview.review_id])
    db.any(insertUsers_to_Entries, [req.session.user.username, newEntry.entry_id])
      .then(function (data) {
        res.status(201).json({
          status: 'success',
          data: data,
        });
      })
      .catch(function (err) {
        return console.log(err);
      })
  } catch (error) {
    res.render('pages/discover', { message: error.message });
  }
});


//Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render("pages/login");
});




// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');