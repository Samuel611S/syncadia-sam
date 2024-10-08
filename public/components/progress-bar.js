// Progress bar in the task manager page
class ProgressBar extends HTMLElement {
    connectedCallback() {
        //inner HTML content
        this.innerHTML = `
            <!-- Coin Progress Bar -->
            <div id="coin-progress-bar" class="progress mb-3">
                <!-- Initially, the progress bar is empty -->
                <div id="coin-progress" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="5"></div>
                <img src="images/coin-icon.png" alt="Coin Icon" class="img-fluid" style="width: 40px; height: 40px;">
            </div>
            <p id="task-message"></p>
        `
    }
}
//Defining the progress bar element to be recognized in DOM
customElements.define('progress-bar', ProgressBar);