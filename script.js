// Paste your deployed Cloudflare Worker link here
const WORKER_URL = "https://workers.dev";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Instantly register dynamic elements
  const jsBadge = document.getElementById("js-badge");
  jsBadge.textContent = "Verified";
  jsBadge.className = "badge success";

  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
  });

  const timestampDiv = document.getElementById("timestamp");
  timestampDiv.textContent = `Loaded at: ${new Date().toLocaleTimeString()}`;

  // 2. Fetch remote DB elements on load
  fetchDatabaseRecords();

  // 3. Handle data form submissions
  const form = document.getElementById("db-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputElement = document.getElementById("note-input");
    const textValue = inputElement.value.trim();

    if (textValue) {
      await sendDatabaseRecord(textValue);
      inputElement.value = ""; // Clear active input
    }
  });
});

// Dynamic Query Routine (GET Request)
async function fetchDatabaseRecords() {
  const listElement = document.getElementById("db-list");
  const loadingText = document.getElementById("db-loading");
  const dbBadge = document.getElementById("db-badge");

  try {
    const res = await fetch(WORKER_URL);
    if (!res.ok) throw new Error("Worker responded with error status");
    
    const rows = await res.json();
    listElement.innerHTML = ""; 
    loadingText.style.display = "none";

    if (rows.length === 0) {
      listElement.innerHTML = "<li>No messages in database yet.</li>";
    } else {
      rows.forEach(row => {
        const li = document.createElement("li");
        // Pulls 'content' column from SQL injection layout
        li.textContent = row.content || JSON.stringify(row);
        listElement.appendChild(li);
      });
    }

    dbBadge.textContent = "Connected";
    dbBadge.className = "badge success";
  } catch (err) {
    loadingText.textContent = "Failed to synchronize remote data source.";
    dbBadge.textContent = "Error";
    dbBadge.className = "badge danger";
    console.error(err);
  }
}

// Dynamic Insertion Routine (POST Request)
async function sendDatabaseRecord(message) {
  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });

    if (res.ok) {
      // Re-fetch instantly to keep the UI perfectly synced
      await fetchDatabaseRecords();
    } else {
      alert("Submission error encountered.");
    }
  } catch (err) {
    console.error("Failed to post message entry:", err);
  }
}
