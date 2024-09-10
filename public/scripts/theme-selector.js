document.addEventListener("DOMContentLoaded", function() {
    // Retrieve the stored theme from localStorage
    const storedTheme = localStorage.getItem('theme');
    // Theme selection dropdown 
    const themeSelect = document.getElementById("theme-select");
    themeSelect.value = storedTheme ?? themeSelect[0].value;
    // Event listener to check changes in the theme selection dropdown
    themeSelect.addEventListener("change", function() {
        document.body.className = ''; 
        document.body.classList.add(themeSelect.value); 
        localStorage.setItem('theme', themeSelect.value); 
    });
    //Initial theme 
    document.body.classList.add(themeSelect.value);
});
