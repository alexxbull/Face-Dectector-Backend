// import dependencies
const bcrypt = require('bcrypt-nodejs')
const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express')
const knex = require('knex')

// import controllers
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

const app = express();

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => res.send('Server is running...'));
app.get('/profile/:id', profile.handleProfileGet(db));
app.post('/imageurl', image.handleApiCall)
app.post('/register', register.handleRegister(db, bcrypt));
app.post('/signin', signin.handleSignin(db, bcrypt))
app.put('/attempts', image.updateAttempts(db))

const PORT = process.env.PORT;

app.listen(PORT || 3001, ()=> {
   console.log(`app is running on port ${PORT}`);
});
