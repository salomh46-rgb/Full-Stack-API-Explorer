window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/data");

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    const titleElement = document.getElementById("title");
    const descriptionElement = document.getElementById("description");

    if (titleElement) {
      titleElement.textContent = data.title;
    }

    if (descriptionElement) {
      descriptionElement.textContent = data.description;
    }
  } catch (error) {
    console.error("Failed to load API data:", error);

    const titleElement = document.getElementById("title");
    const descriptionElement = document.getElementById("description");

    if (titleElement) {
      titleElement.textContent = "Unable to load data";
    }

    if (descriptionElement) {
      descriptionElement.textContent = "The backend could not be reached.";
    }
  }
});
