document.addEventListener("DOMContentLoaded", function() {
  const themeSelect = document.getElementById("theme-select");
  const resultMessage = document.getElementById("resultMessage");
  const takeQuizBtn = document.getElementById("quizButton");
  const quizForm = document.getElementById("quizForm");
  // Initialize Bootstrap modal
  const resultModal = new bootstrap.Modal(document.getElementById('resultModal')); 

  // Theme selection
  themeSelect?.addEventListener("change", function() {
      document.body.className = ''; 
      document.body.classList.add(themeSelect.value);
  });

  // Showing quiz(using JQuery) modal when button is clicked
  takeQuizBtn?.addEventListener("click", function() {
      $('#quizModal').modal('show'); 
  });

  // Handling the quiz form submission
  quizForm?.addEventListener("submit", function(event) {
      event.preventDefault(); 
      
      const formElements = quizForm.elements;
      let score = 0;

      // Iterating over form elements to calculate score of the quiz
      for (let i = 0; i < formElements.length; i++) {
          const element = formElements[i];
          if (element.tagName === "SELECT") {
              const value = element.value;
              
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
                      score += 0;
                      break;
                  default:
                      break;
              }
          }
      }

      // Determining the result based on the score
      let message;
      if (score >= 70) {
          message = "You seem to have a highly organized productivity method! Our app is a great fit for you.";
      } else if (score >= 40) {
          message = "You have a decent productivity method. Our app might help you improve your efficiency.";
      } else {
          message = "You may need to explore different productivity methods. Our app offers tools that could help.";
      }

      // Updating the result message in the result modal
      resultMessage.innerText = message;

      // Showing result modal
      $('#quizModal').modal('hide'); // Hide quiz modal
      resultModal.show(); // Show result modal
  });
});

fetch('/api/save-quiz-result', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      score: score,
      result: message,
      userId: 'currentUserId' 
  })
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  // Show result modal after submitting 
  resultModal.show(); 
})
.catch((error) => {
  console.error('Error:', error);
});
