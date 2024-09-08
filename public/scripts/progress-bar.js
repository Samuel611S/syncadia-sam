document.addEventListener("DOMContentLoaded", function () {

  // Getting the progress bar element for the coin progress
  const coinProgress = document.getElementById("coin-progress");

  // Update the progress bar based on completed tasks
  function updateProgressBar() {
    // Get all task cards
    const allTasks = document.getElementsByClassName('task-card'); 
    // Get tasks in the "DONE" column
    const tasksInDoneColumn = document.querySelectorAll('#DONE-column .task-card'); 

    // Total number of tasks
    const numberOfAlltasks = allTasks.length; 
    // Number of completed tasks
    const numberOfDoneTasks = tasksInDoneColumn ? tasksInDoneColumn.length : 0; 

    // Calculation of the progress percentage for the progress bar
    const progressPercentage = (numberOfDoneTasks / numberOfAlltasks) * 100;

    // Updating the width of the progress bar
    coinProgress.style.width = `${progressPercentage}%`;

    coinProgress.setAttribute("aria-valuenow", numberOfDoneTasks % numberOfAlltasks);
  }

  // Calling the updateProgressBar function to initialize the progress bar
  updateProgressBar();

  // updateProgressBar function accessible globally
  window.updateProgressBar = updateProgressBar;

});
