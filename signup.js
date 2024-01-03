// signup.js

function signUp() {
  // Fetch values from the form
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  console.log("signUp")
  // Check if passwords match
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  // Create an object with user data
  const userData = {
    name: name,
    email: email,
    password: password
  };

  // Make a POST request to the server
  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response from the server
    alert(data.message);

    
    // Redirect to login page or perform other actions as needed
  })
  .catch(error => {
    console.error('Error during signup:', error);
    alert('Error during signup. Please try again.');
  });
}
