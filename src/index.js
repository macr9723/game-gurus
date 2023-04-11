app.get('/', (req, res) => {
    res.render('pages/register', {});
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