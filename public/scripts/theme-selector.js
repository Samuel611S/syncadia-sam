document.addEventListener("DOMContentLoaded", function() {
    const storedTheme = localStorage.getItem('theme');
    const themeSelect = document.getElementById("theme-select");

    themeSelect.value = storedTheme ?? themeSelect[0].value;

    themeSelect.addEventListener("change", function() {
        document.body.className = ''; // Remove existing classes
        document.body.classList.add(themeSelect.value);
        localStorage.setItem('theme', themeSelect.value);
    });

    // Set the initial theme based on the selected value
    document.body.classList.add(themeSelect.value);
});
