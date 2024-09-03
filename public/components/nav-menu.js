class NavMenu extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <ul class="navbar-nav mr-auto">
                <li class="nav-item"><a class="nav-link" href="/home">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="/task-manager">Task Manager</a></li>
                <li class="nav-item"><a class="nav-link" href="/quiz">Quiz</a></li>
                <li class="nav-item"><a class="nav-link" href="/features">Features</a></li>
                
            </ul>
        `
    }
}

customElements.define("nav-menu", NavMenu);