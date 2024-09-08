const express = require("express");
const router = express.Router();
// Route to display the quiz page
router.get("/quiz", (req, res) => {
  const query = "SELECT * FROM Quizzes";
  global.db.all(query, (err, questions) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching quiz questions");
    }
    res.render("quiz", { questions });
  });
});
// Export the router object so index.js can access it
module.exports = router;