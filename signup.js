// signup.js
import {createUserWithEmailAndPassword, updateProfile } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

function signUp() {

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  createUserWithEmailAndPassword(window.firebaseAuth,email, password)
    .then((userCredential) => {
      // User created successfully
      return updateProfile(userCredential.user,{
        displayName: name
      });
    })
    .then(() => {
      // Profile updated successfully
      alert("User registered successfully.");

      // Redirect to login page or another page
      window.location.href = 'login.html'; // Adjust the redirection as needed
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error during signup:", error);
      alert("Error during signup. " + error.message);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('signupButton').addEventListener('click', signUp);
});
