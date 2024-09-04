document.addEventListener("DOMContentLoaded", function () {
  const coinProgress = document.getElementById("coin-progress");

  function updateProgressBar() {
    const allTasks = document.getElementsByClassName('task-card');
    const tasksInDoneColumn = document.querySelectorAll('#DONE-column .task-card');
    const numberOfAlltasks = allTasks.length;
    const numberOfDoneTasks = tasksInDoneColumn ? tasksInDoneColumn.length : 0;

    const progressPercentage = (numberOfDoneTasks / numberOfAlltasks) * 100;
    coinProgress.style.width = `${progressPercentage}%`;
    coinProgress.setAttribute("aria-valuenow", numberOfDoneTasks % numberOfAlltasks);
  }

  updateProgressBar();
  window.updateProgressBar = updateProgressBar;

});
