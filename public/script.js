document.addEventListener("DOMContentLoaded", function() {
    const themeSelect = document.getElementById("theme-select");
    const startTimerBtn = document.getElementById("start-timer-btn");
    const timerModal = new bootstrap.Modal(document.getElementById('timerModal'), {});
    const timerInput = document.getElementById("timerInput");
    const startTimer = document.getElementById("start-timer");
    const visibleTimer = document.getElementById("visible-timer");
    const timeRemainingSpan = document.getElementById("time-remaining");

    themeSelect.addEventListener("change", function() {
        document.body.className = ''; // Remove existing classes
        document.body.classList.add(themeSelect.value);
    });

    // Set the initial theme based on the selected value
    document.body.classList.add(themeSelect.value);

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

    function startCountdown(minutes) {
        let timeRemaining = minutes * 60; // Convert minutes to seconds
        visibleTimer.style.display = "block"; // Show the visible timer

        const timerInterval = setInterval(function() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;

            timeRemainingSpan.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                alert("Time's up!");
                visibleTimer.style.display = "none"; // Hide the timer after time is up
            } else {
                timeRemaining--;
            }
        }, 1000);
    }

    // Notepad Modal Logic
    const notepadModal = new bootstrap.Modal(document.getElementById('notepadModal'), {});

    document.querySelector('#open-notepad').addEventListener("click", function() {
        notepadModal.show();
    });

    // Function to apply text formatting commands
    function execCommand(command, value = null) {
        document.execCommand(command, false, value);
    }

    window.execCommand = execCommand; // Make execCommand globally accessible
});


document.addEventListener("DOMContentLoaded", function() {
    const themeSelect = document.getElementById("theme-select");

    themeSelect.addEventListener("change", function() {
        document.body.className = ''; // Remove existing classes
        document.body.classList.add(themeSelect.value);
    });

    // Set the initial theme based on the selected value
    document.body.classList.add(themeSelect.value);
});

