// Function to check if the user is logged in and update the greeting
function updateUserGreeting(loggedInUser) {
    const userGreetingContainer = document.getElementById('userGreeting');
  
    if (loggedInUser) {
      userGreetingContainer.style.display = 'block';
      userGreetingContainer.innerHTML = `
        <p>Hello ${loggedInUser.name}!</p>
        <button onclick="logout()">Logout</button>
      `;
    }
  }
  
  // Function to handle logout
  function logout() {
    fetch('/logout', {
      method: 'POST',
    })
      .then(() => {
        // Redirect to the login page
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  }
  