class Timer extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
            <div class="timer-container">
                <button class="btn btn-primary my-2 my-sm-0" id="start-timer-btn" type="button">Start Timer</button>
                <!-- Visible Timer Display -->
                <div id="visible-timer" class="timer-box alert alert-primary mt-2" role="alert" style="display: none;">
                    <span id="time-remaining"></span>
                    <button id="timer-cancel-btn" class="btn btn-danger" type="button">
                        <!-- SVG Icon inside the button -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="red" class="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
  }
  
  customElements.define("custom-timer", Timer);