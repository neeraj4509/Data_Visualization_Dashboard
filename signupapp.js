const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const admin = require('firebase-admin');

const app = express();
const port = process.env.PORT || 4006;

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/chart", (req, res) => {
  debugger 
  res.sendFile(path.join(__dirname, 'chart.html'));
});


app.use(express.static(path.join(__dirname, '')));



// Sign up route
app.post('/signup', (req, res) => {
  const { idToken } = req.body;


  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      // Here, you can perform additional server-side actions after successful signup

      res.json({ message: 'Signup successful', uid: uid });
    })
    .catch((error) => {
      console.error('Error during Firebase ID token verification:', error);
      res.status(401).json({ message: 'Unauthorized - Invalid ID token' });
    });
});



app.post('/login', (req, res) => {
  const { idToken } = req.body;

  // Verify the Firebase ID token
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      // Here, you can perform additional server-side actions after successful login

      res.json({ message: 'Login successful', uid: uid });
    })
    .catch((error) => {
      console.error('Error during Firebase ID token verification:', error);
      res.status(401).json({ message: 'Unauthorized - Invalid ID token' });
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
