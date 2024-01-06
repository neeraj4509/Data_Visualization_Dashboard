import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';


function login() {
  var loginEmail = document.getElementById('loginEmail').value;
  var loginPassword = document.getElementById('loginPassword').value;

  signInWithEmailAndPassword(window.firebaseAuth, loginEmail, loginPassword)
    .then((userCredential) => {
      // Login successful
      alert("Login successful.");

      // Set session storage item
      sessionStorage.setItem('userName', userCredential.user.displayName || userCredential.user.email);

      // Redirect after successful login
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        window.location.href = redirectUrl;
        sessionStorage.removeItem('redirectAfterLogin'); // Clear the stored URL
      } else {
        window.location.href = 'charts.html'; // Default redirection
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error('Error during login:', error);
      alert('Error during login. ' + error.message);
    });
}


document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('loginButton').addEventListener('click', login);
});
