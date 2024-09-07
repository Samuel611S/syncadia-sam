/**
 * features.js
 * 
 * This shows how to correctly structure your routes for the project
 * and the suggested pattern for retrieving data by executing queries
 *
 * NB. it's better NOT to use arrow functions for callbacks with the SQLite library
 *
 */

const express = require("express");
const router = express.Router();

router.get("/features", (req, res) => {
    res.render("features");
});

// Export the router object so index.js can access it
module.exports = router;