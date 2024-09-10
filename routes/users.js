const express = require("express");
const router = express.Router();

/**
 * @desc Displays a page with a form for creating a user record
 */
router.get("/add-user", (req, res) => {
  res.render("add-user");
});

/**
 * @desc Add a new user to the database based on data from the submitted form
 */
router.post("/add-user", (req, res, next) => {

  const query =
    "INSERT INTO Users (user_name, email, password) VALUES (?, ?, ?)";
  const queryParameters = [
    req.body.user_name,
    req.body.email,
    req.body.password,
  ]; 

  global.db.run(query, queryParameters, function (err) {
    if (err) {
      next(err); 
    } else {
      res.send(`New user added with ID ${this.lastID}!`);
    }
  });
});
// Export the router object so index.js can access it
module.exports = router;
