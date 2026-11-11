/* Task Board: deliberately small system under test, without external runtime dependencies. */
(() => {
  "use strict";

  const STORAGE_KEY = "qe-task-board-v1";
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const summary = document.getElementById("task-summary");
  const emptyState = document.getElementById("empty-state");
  const error = document.getElementById("form-error");

  let tasks = loadTasks();
  let editingId = null;

  function loadTasks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter((task) =>
        task && typeof task.id === "string" &&
        typeof task.text === "string" &&
        task.text.trim().length > 0 &&
        task.text.length <= 120 &&
        typeof task.completed === "boolean"
      ).slice(0, 500);
    } catch {
      return [];
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      showError("Your browser could not save changes locally.");
    }
  }

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
  }

  function clearError() {
    error.textContent = "";
    error.hidden = true;
  }

  function makeButton(text, label, onClick, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.setAttribute("aria-label", label);
    button.className = className || "secondary";
    button.addEventListener("click", onClick);
    return button;
  }

  function saveEdit(taskId, editInput) {
    const nextText = editInput.value.trim();
    if (!nextText) {
      showError("Task name cannot be empty.");
      editInput.focus();
      return;
    }
    tasks = tasks.map((task) => task.id === taskId ? { ...task, text: nextText } : task);
    editingId = null;
    clearError();
    persist();
    render();
  }

  function render() {
    list.replaceChildren();
    const completed = tasks.filter((task) => task.completed).length;
    summary.textContent = tasks.length + " tasks, " + completed + " completed";
    emptyState.hidden = tasks.length > 0;

    for (const task of tasks) {
      const item = document.createElement("li");
      item.dataset.taskId = task.id;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", "Mark " + task.text + " complete");
      checkbox.addEventListener("change", () => {
        tasks = tasks.map((entry) =>
          entry.id === task.id ? { ...entry, completed: checkbox.checked } : entry
        );
        persist();
        render();
      });
      item.appendChild(checkbox);

      if (editingId === task.id) {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.maxLength = 120;
        editInput.value = task.text;
        editInput.setAttribute("aria-label", "Edit task");
        item.appendChild(editInput);
        item.appendChild(makeButton("Save", "Save task", () => saveEdit(task.id, editInput), "secondary"));
        item.appendChild(makeButton("Cancel", "Cancel editing", () => {
          editingId = null;
          clearError();
          render();
        }, "secondary"));
        editInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            saveEdit(task.id, editInput);
          }
          if (event.key === "Escape") {
            editingId = null;
            clearError();
            render();
          }
        });
      } else {
        const label = document.createElement("span");
        label.className = "task-text" + (task.completed ? " completed" : "");
        label.textContent = task.text;
        item.appendChild(label);
        item.appendChild(makeButton("Edit", "Edit " + task.text, () => {
          editingId = task.id;
          clearError();
          render();
          const field = list.querySelector('input[aria-label="Edit task"]');
          if (field) field.focus();
        }, "secondary"));
        item.appendChild(makeButton("Delete", "Delete " + task.text, () => {
          tasks = tasks.filter((entry) => entry.id !== task.id);
          if (editingId === task.id) editingId = null;
          clearError();
          persist();
          render();
        }, "danger"));
      }

      list.appendChild(item);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      showError("Enter a task before adding it.");
      input.focus();
      return;
    }
    clearError();
    const id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
    tasks.push({ id, text, completed: false });
    input.value = "";
    persist();
    render();
    input.focus();
  });

  render();
})();
