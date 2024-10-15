const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Sample user data (for demonstration purposes)
const users = [
  { id: 1, username: 'testuser', passwordHash: bcrypt.hashSync('password123', 10) } // Password is "password123"
];

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware to manage user sessions
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find the user by username
  const user = users.find(u => u.username === username);

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    // Set session data and authenticate the user
    req.session.userId = user.id;
    res.send('Login successful! Welcome, ' + user.username);
  } else {
    res.send('Invalid username or password');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('You have been logged out');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
