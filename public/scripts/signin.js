document.addEventListener("DOMContentLoaded", function() {
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Checking if the current page is the login or signup page based on URL
    const isLoginPage = window.location.pathname.includes('login');
    const isSignupPage = window.location.pathname.includes('signup');
    
    if (isLoginPage && loginForm && signupForm) {
        signupForm.style.display = 'none'; // Hide signup form
        loginForm.style.display = 'block'; // Show login form

        // Add event listener to switch to signup form when signup tab is clicked
        signupTab.addEventListener('click', function() {
            signupForm.style.display = 'block'; // Show signup form
            loginForm.style.display = 'none';  // Hide login form
            signupTab.classList.remove('btn-outline-secondary');
            signupTab.classList.add('btn-outline-success'); // Highlight signup tab
            loginTab.classList.remove('btn-outline-success');
            loginTab.classList.add('btn-outline-secondary'); // Unhighlight login tab
        });

        // Add event listener to switch to login form when login tab is clicked
        loginTab.addEventListener('click', function() {
            signupForm.style.display = 'none'; // Hide signup form
            loginForm.style.display = 'block'; // Show login form
            signupTab.classList.remove('btn-outline-success');
            signupTab.classList.add('btn-outline-secondary'); // Unhighlight signup tab
            loginTab.classList.remove('btn-outline-secondary');
            loginTab.classList.add('btn-outline-success'); // Highlight login tab
        });

        // Handling the login form submission by POST request
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Getting email input
            const email = document.getElementById('loginEmail').value; 
            // Getting password input
            const password = document.getElementById('loginPassword').value; 

            // Sending login request to the server
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Sending email and password in request body
                body: JSON.stringify({ email, password }), 
            })
            .then(response => response.json()) 
            .then(data => {
                if (data.success) {
                    // Storing authentication token
                    localStorage.setItem('token', data.token); 
                    // Redirecting to home page 
                    window.location.href = '/home'; 
                } else {
                    console.error(data.message); 
                }
            })
            .catch(error => {
                console.error('Error:', error); 
                alert('An error occurred. Please try again.'); 
            });
        });
    }

    if (isSignupPage && loginForm && signupForm) {
        loginForm.style.display = 'none'; 
        signupForm.style.display = 'block'; 

        //Event listener added to switch to login form when login tab is clicked
        loginTab.addEventListener('click', function() {
            signupForm.style.display = 'none'; // Hide signup form
            loginForm.style.display = 'block'; // Show login form
            loginTab.classList.remove('btn-outline-secondary');
            loginTab.classList.add('btn-outline-success'); // Highlight login tab
            signupTab.classList.remove('btn-outline-success');
            signupTab.classList.add('btn-outline-secondary'); // Unhighlight signup tab
        });

        // Event listener added to switch to signup form when signup tab is clicked
        signupTab.addEventListener('click', function() {
            loginForm.style.display = 'none'; // Hide login form
            signupForm.style.display = 'block'; // Show signup form
            loginTab.classList.remove('btn-outline-success');
            loginTab.classList.add('btn-outline-secondary'); // Unhighlight login tab
            signupTab.classList.remove('btn-outline-secondary');
            signupTab.classList.add('btn-outline-success'); // Highlight signup tab
        });


        signupForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const name = document.getElementById('signupName').value; // Get name input
            const email = document.getElementById('signupEmail').value; // Get email input
            const password = document.getElementById('signupPassword').value; // Get password input

            // Send signup request to the server
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }), // Send name, email, and password in request body
            })
            .then(response => response.json()) 
            .then(data => {
                if (data.success) {
                    window.location.href = '/login'; // Redirect to login page 
                } else {
                    alert('Signup failed: ' + data.message); // Show error message if signup fails
                }
            })
            .catch(error => {
                console.error('Error:', error); // Log any error that occurs
                alert('An error occurred. Please try again.'); // Show error alert
            });
        });
    }

    // Show/Hide password functionality 
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = document.querySelector(this.getAttribute('data-target')); //Password input field
            const icon = this.querySelector('i'); //Icon 

            // Toggling between showing and hiding the password
            if (passwordField.type === 'password') {
                passwordField.type = 'text'; 
                icon.classList.remove('fa-eye'); 
                icon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password'; 
                icon.classList.remove('fa-eye-slash'); 
                icon.classList.add('fa-eye');
            }
        });
    });
});
