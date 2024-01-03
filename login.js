function login() {
  var loginEmail = document.getElementById('loginEmail').value;
  var loginPassword = document.getElementById('loginPassword').value;

  // Create an object with login data
  var loginData = {
    email: loginEmail,
    password: loginPassword
  };

  // Make a POST request to the server
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginData)
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response from the server
    if (data.error) {
      // Server responded with an error message
      alert(data.message);
    } else {
      // Login successful
      alert(data.message);
      
      sessionStorage.setItem('userName', data.userName);

       
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        window.location.href = redirectUrl;
        sessionStorage.removeItem('redirectAfterLogin'); // Clear the stored URL
      } else {
        window.location.href = 'index.html'; // Default redirection
      }

    }
  })
  .catch(error => {
    console.error('Error during login:', error);
    alert('Error during login. Please try again.');
  });
}
