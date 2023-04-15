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

var path = require('path');
app.use(express.static(path.join(__dirname, 'resources')));

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

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
  
// Register
app.post('/register', async (req, res) => {
  //hash the password using bcrypt library
  const username = req.body.username;
  const hash = await bcrypt.hash(req.body.password, 10);

  const query = "insert into users (username,password) values ($1, $2) returning *;";
  const values = [username, hash];
  db.one(query,values)
  .then((data) => {
    user.username = username;
    user.password = hash;

    req.session.user = user;
    req.session.save();

    res.redirect("/login");
  })
  .catch((err) => {
    console.log(err);
    res.redirect("/register");
  });
  // To-DO: Insert username and hashed password into 'users' table

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
		const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', username);

		if (!user) {
			// User not found, redirect to register page
      return res.status(401).json({ status: 'error', message: 'Invalid username or password' });
			res.redirect("pages/register");
		}

		// Compare password from request with password in DB
		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			// Passwords don't match, throw error
			throw new Error('Incorrect username or password.');
		}

		// Passwords match, save user in session
		req.session.user = user;
		req.session.save();
    res.status(200).json({ status: 'success', message: 'Success', user });

		// Redirect to discover page
    // NO DISCOVER PAGE, just API for now.
		res.redirect('/discover');
	} catch (error) {
		// Handle error and render login page with error message
		res.render('pages/login', { errorMessage: error.message });
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
  const latestGamesRequest = axios({
    url: 'https://www.giantbomb.com/api/games',
    method: 'GET',
    dataType: 'json',
    headers: {
      'user-agent': 'newcoder',
    },
    params: {
      api_key: process.env.API_KEY,
      limit: 25,
      format: 'json',
      field_list: 'image,name,original_release_date',
      sort: 'original_release_date:desc',
    },
  });

  const highestRatedGamesRequest = axios({
    url: 'https://www.giantbomb.com/api/games',
    method: 'GET',
    dataType: 'json',
    headers: {
      'user-agent': 'newcoder',
    },
    params: {
      api_key: process.env.API_KEY,
      limit: 25,
      format: 'json',
      field_list: 'image,name,original_game_rating',
      sort: 'original_game_rating:desc',
    },
  });

  Promise.all([latestGamesRequest, highestRatedGamesRequest])
    .then(results => {
      const latestGames = results[0].data.results;
      const highestRatedGames = results[1].data.results;
      res.render('pages/discover', {
        latestGames,
        highestRatedGames,
      });
    })
    .catch(error => {
      console.log(error);
      res.render('pages/discover', {
        latestGames: [],
        highestRatedGames: [],
      });
    });
});



app.get('/search', (req,res)=>{

  const search = req.query.search;
  axios({
  url: "https://www.giantbomb.com/api/search",
  method: 'GET',
  dataType: 'json',
  headers: {
    'user-agent':'newcoder',
  },
  params: {
    api_key: process.env.API_KEY,
    limit: 10,
    format: 'json',
    query: search, // this will be replaced with req.body.search, allowing the user to pass in a game title to search for, replace this for now with whatever dummy game name for testing
    resources:'game',
  },
  })
  .then(results => {
    console.log(results.data.results); // the results will be displayed on the terminal if the docker containers are running // Send some parameters
    res.render('pages/search', {
      results,
    });
  })
  .catch(error => {
    console.log(error);
    res.render("pages/search", {
      results: [],
    });
    // Handle errors
  });
  });


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render("pages/logout");
});



// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
module.exports = app.listen(3000);
console.log('Server is listening on port 3000');