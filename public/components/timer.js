class Timer extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
            <div class="timer-container">
                <button class="btn btn-primary my-2 my-sm-0" id="start-timer-btn" type="button">Start Timer</button>
                <!-- Visible Timer Display -->
                <div id="visible-timer" class="timer-box alert alert-primary mt-2" role="alert" style="display: none;">
                    <span id="time-remaining"></span>
                </div>
            </div>
        `;
    }
  }
  
  customElements.define("custom-timer", Timer);