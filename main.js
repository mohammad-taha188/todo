const searchTodo = document.querySelector(".search-todo");
const addInput = document.querySelector(".add-input");
const addBtn = document.querySelector(".add-btn");
const todoBox = document.querySelector(".todo-box");

let newTitle;

function randomNumber() {
  return `${Date.now()}${String(Math.floor(Math.random() * 100000)).padStart(
    5,
    "0"
  )}`;
}

addInput.addEventListener("change", (e) => {
  newTitle = e.target.value;
});

function showTodos() {
  todoBox.innerHTML = ""; // جلوگیری از تکراری شدن آیتم‌ها

  let todos = localStorage.getItem("todos");
  todos = todos ? JSON.parse(todos) : [];

  todos.forEach((todo) => {
    const todoHTML = `
      <div class="todo ${todo.isCompleted ? "completed" : ""}" data-id="${
      todo.id
    }">
        <div class="title-box">
          <input type="checkbox" class="isComplete" ${
            todo.isCompleted ? "checked" : ""
          }/>
          <h3 class="todo-title">${todo.title}</h3>
        </div>
        <button class="btn remove-btn">remove</button>
      </div>`;

    todoBox.insertAdjacentHTML("beforeend", todoHTML);
  });

  addEventListeners(); // رویدادهای حذف و تکمیل را مجدداً اضافه کن
}

function addTodo() {
  if (!newTitle.trim()) return; // جلوگیری از مقدار خالی

  let ID = randomNumber();
  let newTodoObj = { id: ID, title: newTitle, isCompleted: false };

  let todos = localStorage.getItem("todos");
  todos = todos ? JSON.parse(todos) : [];

  todos.push(newTodoObj);
  localStorage.setItem("todos", JSON.stringify(todos));

  showTodos(); // نمایش مجدد لیست
  newTitle = "";
  addInput.value = "";
}

function addEventListeners() {
  document.querySelectorAll(".remove-btn").forEach((removeBtn) => {
    removeBtn.addEventListener("click", (e) => {
      const todoElement = e.target.closest(".todo");
      const todoId = todoElement.dataset.id;
      let todos = JSON.parse(localStorage.getItem("todos"));

      todos = todos.filter((todo) => todo.id !== todoId);
      localStorage.setItem("todos", JSON.stringify(todos));

      showTodos(); // نمایش مجدد لیست
    });
  });

  document.querySelectorAll(".isComplete").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const todoElement = e.target.closest(".todo");
      const todoId = todoElement.dataset.id;
      let todos = JSON.parse(localStorage.getItem("todos"));

      let todoToUpdate = todos.find((todo) => todo.id === todoId);
      if (todoToUpdate) {
        todoToUpdate.isCompleted = e.target.checked;
        localStorage.setItem("todos", JSON.stringify(todos));
      }

      showTodos(); // نمایش مجدد لیست
    });
  });
}

window.addEventListener("DOMContentLoaded", showTodos);
addBtn.addEventListener("click", addTodo);
addInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addTodo();
});

searchTodo.addEventListener("keyup", (e) => {
  let searchTitle = e.target.value.toLowerCase().trim();

  Array.from(todoBox.children).forEach((todo) => {
    let title = todo
      .querySelector(".todo-title")
      .innerText.toLowerCase()
      .trim();
    todo.style.display = title.includes(searchTitle) ? "flex" : "none";
  });
});
