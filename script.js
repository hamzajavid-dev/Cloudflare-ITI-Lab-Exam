document.addEventListener("DOMContentLoaded", () => {
  // 1. Immediately verify JavaScript execution state
  const jsBadge = document.getElementById("js-badge");
  jsBadge.textContent = "Verified";
  jsBadge.className = "badge success";

  // 2. Add Live Interactive Features (Theme Toggle)
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
  });

  // 3. Inject dynamic load metadata
  const timestampDiv = document.getElementById("timestamp");
  const now = new Date();
  timestampDiv.textContent = `Verified live at: ${now.toLocaleTimeString()}`;
});
