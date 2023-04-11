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

// TODO - Include your API routes here
app.get('/',(req,res)=>{
    res.redirect('/login');
});

app.get('/login',(req,res)=>{
    res.render('pages/login');
});

app.get('/register',(req, res) =>{
  res.render('pages/register');
});

// Register
app.post('/register', async (req, res) => {
  //hash the password using bcrypt library
  const hash = await bcrypt.hash(req.body.password, 10);

  // To-DO: Insert username and hashed password into 'users' table
  const query = `INSERT INTO users (username,password) VALUES ('${req.body.username}','${hash}') RETURNING *;`;

  db.one(query)
  .then((data) =>{

    

    user.username = data.username;
    user.password = data.password;

    res.redirect('/login')
  })
  .catch((err) => {
    console.log(err);
    res.redirect('/register');
  });

});

app.post('/login', (req,res) => {
  // check if password from request matches with password in DB

  const query = `SELECT * FROM users WHERE username = '${req.body.username}';`;

  db.one(query)
  .then(async (data)=>{

    const match = await bcrypt.compare(req.body.password, data.password);

    if(match == true){
      //save user details in session like in lab 8
  
      user.username = req.body.username;
      user.password = req.body.password;
  
      req.session.user = user;
      req.session.save();
      res.redirect('/discover');
    }else{
      throw new Error('Incorrect username or password.');

    }

  })
  .catch((err)=>{
    res.redirect('/register');
    console.log(err);
  });

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


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render("pages/logout");
});




// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');

// HINTS
//docker-compose down --volumes