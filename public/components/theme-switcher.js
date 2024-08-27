class ThemeSwitcher extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div class="theme-switcher">  
            <label for="theme-select">Choose a Theme:</label>
            <select id="theme-select" class="form-control" style="width: 200px; display: inline-block;">
                <option value="default-theme">Default</option>
                <option value="dark-theme">Dark</option>
                <option value="pink-theme">Pink</option>
                <option value="teal-theme">Teal</option>
            </select>
        </div>
      `;
  }
}

customElements.define("theme-switcher", ThemeSwitcher);
