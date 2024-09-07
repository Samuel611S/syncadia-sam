document.addEventListener("DOMContentLoaded", function() {
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Check if the current page is the login or signup page
    const isLoginPage = window.location.pathname.includes('login');
    const isSignupPage = window.location.pathname.includes('signup');

    if (isLoginPage) {
        // Initial setup for login page
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';

        // Add event listeners for tab buttons on the login page
        signupTab.addEventListener('click', function() {
            signupForm.style.display = 'block';
            loginForm.style.display = 'none';
            signupTab.classList.remove('btn-outline-secondary');
            signupTab.classList.add('btn-outline-success');
            loginTab.classList.remove('btn-outline-success');
            loginTab.classList.add('btn-outline-secondary');
        });

        loginTab.addEventListener('click', function() {
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
            signupTab.classList.remove('btn-outline-success');
            signupTab.classList.add('btn-outline-secondary');
            loginTab.classList.remove('btn-outline-secondary');
            loginTab.classList.add('btn-outline-success');
        });

        // Handle login form submission
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
    if (data.success) {
        // Store the token in localStorage or a cookie
        localStorage.setItem('token', data.token);
        window.location.href = '/home'; // Redirect to a protected page
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

    if (isSignupPage) {
        // Initial setup for signup page
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';

        // Add event listeners for tab buttons on the signup page
        loginTab.addEventListener('click', function() {
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
            loginTab.classList.remove('btn-outline-secondary');
            loginTab.classList.add('btn-outline-success');
            signupTab.classList.remove('btn-outline-success');
            signupTab.classList.add('btn-outline-secondary');
        });

        signupTab.addEventListener('click', function() {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            loginTab.classList.remove('btn-outline-success');
            loginTab.classList.add('btn-outline-secondary');
            signupTab.classList.remove('btn-outline-secondary');
            signupTab.classList.add('btn-outline-success');
        });

        // Handle signup form submission
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/login'; // Redirect on success
        } else {
            alert('Signup failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
        });
    }
    // Show/Hide password functionality
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            // Get the target input field
            const targetInput = document.querySelector(this.dataset.target);
            
            // Toggle the password visibility
            if (targetInput.type === "password") {
                targetInput.type = "text";
                this.querySelector('i').classList.remove('fa-eye');
                this.querySelector('i').classList.add('fa-eye-slash');
            } else {
                targetInput.type = "password";
                this.querySelector('i').classList.remove('fa-eye-slash');
                this.querySelector('i').classList.add('fa-eye');
            }
        });
    });
   
});

