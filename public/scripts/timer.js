document.addEventListener("DOMContentLoaded", function() {
    const startTimerBtn = document.getElementById("start-timer-btn");
    const timerModal = new bootstrap.Modal(document.getElementById('timerModal'), {});
    const timerInput = document.getElementById("timerInput");
    const startTimer = document.getElementById("start-timer");
    const visibleTimer = document.getElementById("visible-timer");
    const timeRemainingSpan = document.getElementById("time-remaining");
    const cancelBtn = document.getElementById('timer-cancel-btn');

    startTimerBtn.addEventListener("click", function() {
        // Show the timer modal when the "Start Timer" button is clicked
        timerModal.show();
    });

    startTimer.addEventListener("click", function() {
        const timeInMinutes = parseInt(timerInput.value);

        if (!isNaN(timeInMinutes) && timeInMinutes > 0) {
            startCountdown(timeInMinutes);
            timerModal.hide();
        } else {
            alert("Please enter a valid time in minutes.");
        }
    });

    let timerInterval;

    function startCountdown(minutes) {
        // Converting minutes to seconds
        let timeRemaining = minutes * 60; 
        visibleTimer.style.display = "inline-block"; 
        startTimerBtn.style.display = "none";

        timerInterval = setInterval(function() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timeRemainingSpan.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                alert("Time's up!");
                // Hide the timer after time is up
                visibleTimer.style.display = "none"; 
                startTimerBtn.style.display = "inline-block";
            } else {
                timeRemaining--;
            }
        }, 1000);
    }
    cancelBtn.addEventListener('click', function() {
        if (timerInterval) {
            clearInterval(timerInterval);
            visibleTimer.style.display = 'none';
            startTimerBtn.style.display = "inline-block";
        }
    });
    // Notepad Modal Logic
    const notepadModal = new bootstrap.Modal(document.getElementById('notepadModal'), {});

    document.querySelector('#open-notepad').addEventListener("click", function() {
        notepadModal.show();
    });
    // Text formatting commands
    function execCommand(command, value = null) {
        document.execCommand(command, false, value);
    }
    window.execCommand = execCommand; 
});