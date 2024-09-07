/**
 * tasks.js
 * These are example routes for task management
 * This shows how to correctly structure your routes for the project
 * and the suggested pattern for retrieving data by executing queries
 *
 * NB. it's better NOT to use arrow functions for callbacks with the SQLite library
 *
 */

const express = require("express");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const saltRounds =10;
const router = express.Router();

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';


router.get('/Signup', (req, res) => {
    res.render('Signup',{
       message: req.query.message || '', 
      error: req.query.error || ''
    });
  });

router.get('/login', (req, res) => {
  res.render('login', { 
      message: req.query.message || '', 
      error: req.query.error || '' 
  });
});


router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
      // Ensure valid input
      if (typeof password !== 'string' || password.length === 0) {
          throw new Error('Invalid password');
      }

      // Check if the email already exists in the database
      const sqlCheck = 'SELECT * FROM users WHERE email = ?';
      global.db.get(sqlCheck, [email], async (err, user) => {
          if (err) {
              return res.status(500).json({ success: false, message: 'Database error' });
          }

          // If user exists, redirect to login page or show a message
          if (user) {
            return res.redirect('/login?message=User already exists. Please log in.');
          }

          // Hash the password if email is not found
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Prepare SQL statement to insert new user
          const sqlInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

          // Run SQL statement to insert the new user
          global.db.run(sqlInsert, [name, email, hashedPassword], function(err) {
              if (err) {
                  console.error('Database error:', err);
                  return res.status(500).json({ success: false, message: 'Database error' });
              }

              // Redirect to login page after successful registration
              res.redirect('/login');
          });
      });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Validation and Sanitization Middleware
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('login', { error: errors.array().map(err => err.msg).join('<br>') });
  }

  const { email, password } = req.body;
  
  // Sanitize inputs
  const sanitizedEmail = sanitizeHtml(email);
  const sanitizedPassword = sanitizeHtml(password);

  const sql = 'SELECT * FROM users WHERE email = ?';
  global.db.get(sql, [sanitizedEmail], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).render('login', { error: 'Database error' });
    }
    if (!user) {
      return res.redirect('/Signup?error=User not found. Please sign up here ');
    }

    bcrypt.compare(sanitizedPassword, user.password, (err, match) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.status(500).render('login', { error: 'Server error' });
      }
      if (match) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Set token in an HTTP-only cookie (for security)
        res.cookie('auth_token', token, { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'Strict', 
          maxAge: 3600000 // 1 hour expiration 
        });

        // Redirect to home page
        return res.redirect('/home');
      } else {
        // Incorrect password
        return res.status(401).render('login', { error: 'Invalid credentials' });
      }
    });
  });
});

// router.get("/home", authentication, (req, res) => {
//   const user = req.user || null; // Check if user is authenticated
//   res.render("home", { user }); // Pass user info to the view
// });

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  
  res.status(200).json({ success: true, message: 'Password reset link sent' });
});
// Export the router object so index.js can access it
module.exports = router;