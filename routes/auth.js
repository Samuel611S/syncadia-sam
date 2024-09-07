const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const saltRounds = 10;
const router = express.Router();

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Root route redirect to /home
router.get("/", (req, res) => {
  console.log("Root route accessed, redirecting to /home");
  res.redirect("/home");
});

// Signup page
router.get('/Signup', (req, res) => {
  console.log("Signup page accessed");
  res.render('Signup', {
    message: req.query.message || '', 
    error: req.query.error || ''
  });
});

// Login page
router.get('/login', (req, res) => {
  console.log("Login page accessed");
  res.render('login', { 
    message: req.query.message || '', 
    error: req.query.error || '' 
  });
});

// Signup handling
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("Signup error: Missing fields");
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    if (typeof password !== 'string' || password.length === 0) {
      throw new Error('Invalid password');
    }

    const sqlCheck = 'SELECT * FROM users WHERE email = ?';
    global.db.get(sqlCheck, [email], async (err, user) => {
      if (err) {
        console.error('Database error during signup:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (user) {
        console.log("User already exists, redirecting to login");
        return res.redirect('/login?message=User already exists. Please log in.');
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const sqlInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

      global.db.run(sqlInsert, [name, email, hashedPassword], function(err) {
        if (err) {
          console.error('Database error during user insertion:', err);
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        console.log("User registered successfully, redirecting to login");
        res.redirect('/login');
      });
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login handling
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Login validation errors:", errors.array());
    return res.status(400).render('login', { error: errors.array().map(err => err.msg).join('<br>') });
  }

  const { email, password } = req.body;
  const sanitizedEmail = sanitizeHtml(email);
  const sanitizedPassword = sanitizeHtml(password);

  const sql = 'SELECT * FROM users WHERE email = ?';
  global.db.get(sql, [sanitizedEmail], (err, user) => {
    if (err) {
      console.error('Database error during login:', err);
      return res.status(500).render('login', { error: 'Database error' });
    }
    if (!user) {
      console.log("User not found, redirecting to signup");
      return res.redirect('/Signup?error=User not found. Please sign up here');
    }

    bcrypt.compare(sanitizedPassword, user.password, (err, match) => {
      if (err) {
        console.error('Password comparison error:', err);
        return res.status(500).render('login', { error: 'Server error' });
      }
      if (match) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('auth_token', token, { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'Strict', 
          maxAge: 3600000 // 1 hour expiration 
        });

        console.log("Login successful, redirecting to /home");
        return res.redirect('/home');
      } else {
        console.log("Invalid credentials, redirecting to login");
        return res.status(401).render('login', { error: 'Invalid credentials' });
      }
    });
  });
});

// Home route
router.get("/home", (req, res) => {
  const token = req.cookies.auth_token;

  // if (!token) {
  //   console.log("No token found, redirecting to /login");
  //   return res.redirect("/login");
  // }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.redirect("/login");
    }

    const sql = 'SELECT name FROM users WHERE id = ?';
    global.db.get(sql, [user.id], (err, row) => {
      if (err) {
        console.error('Database error during home route:', err);
        return res.status(500).render('home', { userName: null, error: 'Database error' });
      }

      console.log("Home page accessed by:", row ? row.name : 'Unknown user');
      res.render('home', { userName: row ? row.name : null });
    });
  });
});

// Forgot password route
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  
  res.status(200).json({ success: true, message: 'Password reset link sent' });
});

// Sign-out route
router.get('/signout', (req, res) => {
  res.clearCookie('auth_token');
  res.redirect('/');
});

module.exports = router;
