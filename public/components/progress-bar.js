class ProgressBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <!-- Coin Progress Bar -->
            <div id="coin-progress-bar” class="progress mb-3">
                <!-- Initially, the progress bar is empty -->
                <div id="coin-progress” class="progress-bar” role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="5"></div>
                <img src="Images/CoinIcon.png" alt="Coin Icon” class="img-fluid ml-3" style="width: 40px; height: 40px;">
            </div>
            <p id="task-message”></p>
        `
    }
}

customElements.define('progress-bar', ProgressBar);