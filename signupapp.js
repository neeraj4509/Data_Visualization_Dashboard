const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');


const app = express();
const port = 3027;

// Create MySQL connection
const db = mysql.createConnection({
  host: 'sql213.infinityfree.com',
  user: 'if0_35726374',
  password: 'NOW8sE4JvS0JI',
  database: 'if0_35726374_demon',
});


// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});
// Middleware for parsing JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use(express.static(path.join(__dirname, '')));


// Sign up route
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  
    db.query('SELECT * FROM users WHERE email = ?', [email], (selectError, selectResults) => {
      if (selectError) {
        console.error('Error checking email existence:', selectError);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }

      // If email already exists, send a response
      if (selectResults.length > 0) {
        res.status(400).json({ message: 'User with this email already exists' });
        return;
      }
    // Insert user data into the database
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (error, results) => {
      if (error) {
        console.error('Error inserting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }

      console.log('User registered successfully');
      res.json({ message: 'User registered successfully' });
    });
  });
});



app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the email and password match a user in the database
  db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
    if (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: true, message: 'Internal Server Error' });
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      // Login successful
      
      res.json({ error: false, message: 'Login successful' , userName: user.name});
    } else {
      // Invalid email or password
      res.status(400).json({ error: true, message: 'Invalid email or password' });
    }
  });
});

app.get("/view-chart", (req, res) => {
  debugger 
  res.sendFile(path.join(__dirname, 'view-chart.html'));
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
