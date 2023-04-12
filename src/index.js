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

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************


app.get('/register', (req, res) => {
    res.render('pages/register');
});
  
// Register
app.post('/register', async (req, res) => {
    //hash the password using bcrypt library
    const username = req.body.username;
    const hash = await bcrypt.hash(req.body.password, 10);
  
    const query = "insert into users (username,password) values $1, $2";
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

app.get('/discover', (req,res)=>{

  axios({
  url: `https://www.giantbomb.com/api/games`,
  method: 'GET',
  dataType: 'json',
  headers: {
    'user-agent':'newcoder',
  },
  params: {
    api_key: process.env.API_KEY,
    limit: 10,
    format: 'json',
    field_list: `image,name`,
    sort: 'number_of_user_reviews:desc'
  },
})
  .then(results => {
    console.log(results.data.results.image); // the results will be displayed on the terminal if the docker containers are running // Send some parameters
    res.render('pages/discover', {
      results,
    });
  })
  .catch(error => {
    console.log(error);
    res.render("pages/discover", {
      results: [],
    });
    // Handle errors
  });
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
			res.redirect("pages/register");
			return;
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

		// Redirect to discover page
    // NO DISCOVER PAGE, just API for now.
		// res.redirect('/discover');
	} catch (error) {
		// Handle error and render login page with error message
		res.render('pages/login', { errorMessage: error.message });
	}
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');