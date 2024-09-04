document.addEventListener("DOMContentLoaded", function () {
  const coinProgress = document.getElementById("coin-progress");
  const taskMessage = document.getElementById("task-message");

  function updateProgressBar() {
    const allTasks = document.getElementsByClassName('task-card');
    const tasksInDoneColumn = document.querySelector('#DONE-column task-card');

    const numberOfAlltasks = allTasks.length;
    const numberOfDoneTasks = tasksInDoneColumn ? tasksInDoneColumn.length : 0;

    const move = 20;

    const progressPercentage = (numberOfDoneTasks % numberOfAlltasks) * move;
    coinProgress.style.width = `${progressPercentage}%`;
    coinProgress.setAttribute("aria-valuenow", numberOfDoneTasks % numberOfAlltasks);
    if (numberOfDoneTasks % numberOfDoneTasks === 0) {
      taskMessage.textContent = `Congratulations! You’ve completed ${numberOfDoneTasks} tasks`;
      setTimeout(() => {
        taskMessage.textContent = "";
        coinProgress.style.width = "0";
      }, 3000);
    }
  }

  updateProgressBar();

  document.updateProgressBar = updateProgressBar;
});
