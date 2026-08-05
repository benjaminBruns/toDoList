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

function sortTasksByText() {
    if (tasks && tasks.length > 1) {
        tasks.sort((a, b) => a.text.localeCompare(b.text));
    }
    return tasks;
}

function addTask() {
    newTaskButton.addEventListener("click", addTaskFunc);
}

function addTaskFunc() {
    const taskText = newTaskInput.value;
    tasks.push({
        text: taskText,
        completed: false,
        onScreen: true
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
tasks = sortTasksByText();
showTasks();
updateCheckboxes();
console.log(tasks);
saveTasks();

addTask();

clearCompletedTasks();