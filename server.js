const express = require('express');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const db = require('./db');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5001;
const User = require('./models/User');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const tokenCookie = req.headers.cookie;
  if (tokenCookie != undefined) {
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, 'secretsecret');
    const user = await User.findById(decoded.id);
    res.render('dashboard', {
      name: user.name,
      age: user.age,
      email: user.email
    });
  }
  res.render('index');
});

app.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.find({ email });
    if (user.length > 0) {
      const authResult = await bcrypt.compare(password, user[0].password);
      if (authResult) {
        const token = jwt.sign({ id: user[0]._id }, 'secretsecret', {
          expiresIn: '24h'
        });
        res.cookie('token', token);
        res.render('dashboard', {
          name: user[0].name,
          email: user[0].email,
          age: user[0].age
        });
      } else {
        res.send('Auth Failed');
      }
    }
  } catch (error) {
    res.send('Auth Failed');
  }
});

app.get('/register', async (req, res) => {
  const tokenCookie = req.headers.cookie;
  if (tokenCookie != undefined) {
    const token = tokenCookie.split('=')[1];
    const decoded = jwt.verify(token, 'secretsecret');
    const user = await User.findById(decoded.id);
    res.redirect('/');
  }
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, age, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, age, password: hashedPassword });
    await user.save();
    res.send('User Registered');
  } catch (error) {}
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

app.listen(port, console.log(`Server is running at port ${port}`));
