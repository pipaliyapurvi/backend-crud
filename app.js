const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');


const userModel = require('./model/user');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/contact')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, username, password, age } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).send('User already registered');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      username,
      email,
      age,
      password: hash,
    });

    const token = jwt.sign({ email: user.email, userId: user._id }, 'shhhhh', { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true });

    res.status(201).send('Registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login Route (fixed)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ email: user.email, userId: user._id }, 'shhhhh', { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true });

    res.send('Login successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



app.post('/user/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username, email, age, password } = req.body;

    const updateData = { name, username, email, age };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedUser) return res.status(404).send('User not found');

    res.send('User updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



// app.post('/user/delete/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedUser = await userModel.findByIdAndDelete(id);

//     if (!deletedUser) return res.status(404).send('User not found');

//     res.send('User deleted successfully');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });


// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
