"use strict";

const newTaskInput = document.getElementById("taskInput");
const newTaskButton = document.getElementById("taskAddButton");
const taskList = document.getElementById("taskListContainer");
const clearCompletedButton = document.getElementById("clearCompletedTasksButton");

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
}

function showTasks() {
    const taskListContainer = document.getElementById("taskListContainer");
    taskListContainer.innerHTML = "";
    if (tasks.length === 0) {
        const taskListContainer = document.getElementById("taskListContainer");
        const taskListItem = document.createElement("h2");
        taskListItem.textContent = "You have no tasks!"
        taskListItem.setAttribute("id", "noTasksText");
        taskListContainer.appendChild(taskListItem);
    }
    tasks.forEach((task, index) => {
        const taskItem = document.createElement("label");
        taskItem.setAttribute("id", `task-${index}`);
        if (task.completed) {
            taskItem.innerHTML = `
                <input type="checkbox" class="taskCheckbox" id="checkbox-${index}" checked>
                <span class="taskText">${task.text}</span>
            `;
            taskItem.className = "taskListItem completed";
        } else {
            taskItem.innerHTML = `
                <input type="checkbox" class="taskCheckbox" id="checkbox-${index}">
                <span class="taskText">${task.text}</span>
            `;
            taskItem.className = "taskListItem";
        }
        taskListContainer.appendChild(taskItem);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function sortTasks() {
    const sortTasksDropdown = document.getElementById("sortTasksDropdown");
    sortTasksDropdown.addEventListener("click", () => {
        const selected = sortTasksDropdown.value;
        console.log(selected);
        if (selected == "alphabet") {
            sortTasksByText();
        } else if (selected == "complete") {
            sortTasksByCompletion();
        } else if (selected == "newest"){
            sortTasksByNewest();
        } else if (selected == "oldest") {
            sortTasksByOldest();
        }

        saveTasks();
        showTasks();
        updateCheckboxes();
    })
}
function sortTasksByText() {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
}

function sortTasksByCompletion() {
    tasks.sort((a, b) => a.completed - b.completed);
}

function sortTasksByOldest() {
    tasks.sort((a, b) => a.order - b.order);
}

function sortTasksByNewest() {
    tasks.sort((a, b) => b.order - a.order);
}

function addTask(ord) {
    newTaskButton.addEventListener("click", () => {
        ord = addTaskFunc(ord);
    });
}

function addTaskFunc(ord) {
    console.log(ord);
    const taskText = newTaskInput.value;
    tasks.push({
        text: taskText,
        completed: false,
        onScreen: true,
        order: ord
    });
    const taskItem = document.createElement("label");
    taskItem.className = "taskListItem";
    taskItem.setAttribute("id", `task-${tasks.length - 1}`);
    taskItem.innerHTML = `
        <input type="checkbox" class="taskCheckbox" id="checkbox-${tasks.length - 1}">
        <span class="taskText">${taskText}</span>
    `;
    taskList.appendChild(taskItem);
    saveTasks();
    showTasks();
    updateCheckboxes();
    newTaskInput.value = "";
    return ord + 1;
}

function updateCheckboxes() {
    const taskCheckboxes = document.querySelectorAll("input[class='taskCheckbox']");
    taskCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            const taskItem = checkbox.closest(".taskListItem");
            taskItem.classList.toggle("completed", checkbox.checked);
            saveTasks();
        });
    });
}

function clearCompletedTasks() {
    clearCompletedButton.addEventListener("click", () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        showTasks();
        updateCheckboxes();
    });

}

let tasks = [];
loadTasks();
let ord = tasks.length;
sortTasks();
showTasks();
updateCheckboxes();
console.log(tasks);
saveTasks();
ord = addTask(ord);

clearCompletedTasks();

