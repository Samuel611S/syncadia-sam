document.addEventListener("DOMContentLoaded", function() {
    const themeSelect = document.getElementById("theme-select");
    const resultMessage = document.getElementById("resultMessage");
    
    // Handle theme selection
    themeSelect.addEventListener("change", function() {
      document.body.className = ''; // Remove existing classes
      document.body.classList.add(themeSelect.value);
    });
    
    // Show quiz modal when button is clicked
    const takeQuizBtn = document.getElementById("quizButton");
    takeQuizBtn.addEventListener("click", function() {
      $('#quizModal').modal('show'); // Use jQuery to show the modal
    });
    
    // Handle quiz form submission
    const quizForm = document.getElementById("quizForm");
    quizForm.addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent default form submission
      
      const formElements = quizForm.elements; // Get all form elements
      let score = 0;

      // Iterate over form elements
      for (let i = 0; i < formElements.length; i++) {
          const element = formElements[i];
          if (element.tagName === "SELECT") {
              const value = element.value;
              console.log("Form value:", value); // Debugging to see form values

              switch (value) {
                  case "option1":
                      score += 10;
                      break;
                  case "option2":
                      score += 5;
                      break;
                  case "option3":
                      score += 3;
                      break;
                  case "option4":
                      score += 1;
                      break;
                  default:
                      console.log("Unexpected option value:", value);
              }
          }
      }

      // Log final score for debugging
      console.log("Final Score:", score);

      let result;
      if (score > 70) {
        result = "You seem to have a highly organized productivity method! Our app is a great fit for you.";
      } else if (score > 40) {
        result = "You have a decent productivity method. Our app might help you improve your efficiency.";
      } else {
        result = "You may need to explore different productivity methods. Our app offers tools that could help.";
      }
      // Ensure the result message container exists
      if (resultMessage) {
        resultMessage.innerText = result;
      } else {
        console.error("Result message container not found!");
      }
      
      $('#quizModal').modal('hide'); // Hide the quiz modal
      $('#resultModal').modal('show'); // Show the result modal
    });
    
    // Set the initial theme based on the selected value
    document.body.classList.add(themeSelect.value);
  });