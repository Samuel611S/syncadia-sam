const express = require("express");
const router = express.Router();
// Route for the features page
router.get("/features", (req, res) => {
    res.render("features");
});

// Export the router object so index.js can access it
module.exports = router;