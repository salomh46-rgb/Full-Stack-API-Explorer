const API_URL = "/api/data";

function populateHero(data) {
  const titleElement = document.getElementById("title");
  const descriptionElement = document.getElementById("description");

  if (titleElement) {
    titleElement.textContent = data.title;
  }

  if (descriptionElement) {
    descriptionElement.textContent = data.description;
  }
}

function renderProjects(projects) {
  const projectList = document.getElementById("project-list");

  if (!projectList) {
    return;
  }

  projectList.innerHTML = "";

  if (!projects.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "No projects yet. Add the first one using the form above.";
    projectList.appendChild(emptyItem);
    return;
  }

  projects.forEach((project) => {
    const item = document.createElement("li");
    item.className = "project-item";

    const heading = document.createElement("h3");
    heading.textContent = project.title;

    const paragraph = document.createElement("p");
    paragraph.textContent = project.description;

    const actions = document.createElement("div");
    actions.className = "project-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "secondary-button small-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => startEdit(project));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger-button small-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteProject(project.id));

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    item.appendChild(heading);
    item.appendChild(paragraph);
    item.appendChild(actions);
    projectList.appendChild(item);
  });
}

async function loadProjects() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    populateHero(data);
    renderProjects(data.projects ?? []);
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
}

function startEdit(project) {
  const form = document.getElementById("project-form");
  const formTitle = document.getElementById("form-title");
  const submitButton = document.getElementById("submit-button");
  const cancelButton = document.getElementById("cancel-edit");
  const formMessage = document.getElementById("form-message");

  if (!form) {
    return;
  }

  form.id.value = project.id;
  form.title.value = project.title;
  form.description.value = project.description;
  formTitle.textContent = "Edit project";
  submitButton.textContent = "Update Project";
  cancelButton.classList.remove("hidden");
  formMessage.textContent = "Editing project...";
  form.title.focus();
}

function cancelEdit() {
  const form = document.getElementById("project-form");
  const formTitle = document.getElementById("form-title");
  const submitButton = document.getElementById("submit-button");
  const cancelButton = document.getElementById("cancel-edit");
  const formMessage = document.getElementById("form-message");

  if (!form) {
    return;
  }

  form.reset();
  form.id.value = "";
  formTitle.textContent = "Add a new project";
  submitButton.textContent = "Save Project";
  cancelButton.classList.add("hidden");
  formMessage.textContent = "";
}

async function submitProject(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formMessage = document.getElementById("form-message");
  const projectId = Number(form.id.value);
  const title = form.title.value.trim();
  const description = form.description.value.trim();

  if (!title || !description) {
    formMessage.textContent = "Please complete both fields before submitting.";
    return;
  }

  try {
    const method = Number.isInteger(projectId) && projectId > 0 ? "PUT" : "POST";
    const endpoint = method === "PUT" ? `${API_URL}/${projectId}` : API_URL;

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    cancelEdit();
    formMessage.textContent = method === "POST" ? "Project saved successfully." : "Project updated successfully.";
    await loadProjects();
  } catch (error) {
    console.error("Failed to save project:", error);
    formMessage.textContent = "The project could not be saved. Please try again.";
  }
}

async function deleteProject(projectId) {
  const formMessage = document.getElementById("form-message");

  try {
    const response = await fetch(`${API_URL}/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    formMessage.textContent = "Project deleted successfully.";
    await loadProjects();
  } catch (error) {
    console.error("Failed to delete project:", error);
    formMessage.textContent = "The project could not be deleted. Please try again.";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("project-form");
  const cancelButton = document.getElementById("cancel-edit");

  if (form) {
    form.addEventListener("submit", submitProject);
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", cancelEdit);
  }

  loadProjects();
});
