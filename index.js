const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { User } = require('./db');
const { seed } = require("./db/seedFn")

(()=> {
  seed()
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

app.post("/register", async (req,res,next) => {
  try {
    const saltRounds = 10;
    const { username, password } = req.body;
    if (username === null || password == null) throw new Error("")
    const details = await User.findOne({where: {username: username}, raw: true});
    if (details !== null) throw new Error("")
    bcrypt.hash(password, saltRounds, function(err, hash) {
      // Store hash in your password DB.
      if (err) throw new Error("")
      User.create({
        username: username,
        password: hash
      });
      res.status(200).end()
    });
  } catch {
    res.status(400).end()
  }
})
// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password

app.post("/login", async (req,res) => {
  try {
    const { username, password } = req.body;
    if (username === null || password == null) throw new Error("")
    const details = await User.findOne({where: {username: username}, raw: true});
    if (details.password === null) throw new Error("")
    const result = await bcrypt.compare(password, details.password);
    if (result) return res.status(200).send("Success")
    throw new Error("")
  } catch(error) {
    res.status(400).send("Failed")
  }
})
// we export the app, not listening in here, so that we can run tests
module.exports = app;
