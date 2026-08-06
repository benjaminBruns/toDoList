"use strict";

const newTaskInput = document.getElementById("taskText");
const newTaskButton = document.getElementById("taskAddButton");
const taskList = document.getElementById("taskListContainer");
const clearCompletedButton = document.getElementById("clearCompletedTasksButton");
const newTaskDate = document.getElementById("taskDueDateInput");


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
                <span class="taskDate">${task.date}</span>
            `;
            taskItem.className = "taskListItem completed";
        } else {
            taskItem.innerHTML = `
                <input type="checkbox" class="taskCheckbox" id="checkbox-${index}">
                <span class="taskText">${task.text}</span>
                <span class="taskDate">${task.date}</span>
            `;
            taskItem.className = "taskListItem";
        }
        taskListContainer.appendChild(taskItem);
    });
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateSortingMethod() {
    const sortTasksDropdown = document.getElementById("sortTasksDropdown");
    const sortingMethod = JSON.parse(localStorage.getItem("sortingMethod")) || "alphabet";
    sortTasksDropdown.value = sortingMethod;
}

function callCorrectSortingMethod(sortingMethod) {
    if (sortingMethod == "alphabet") {
            sortTasksByText();
        } else if (sortingMethod == "complete") {
            sortTasksByCompletion();
        } else if (sortingMethod == "newest"){
            sortTasksByNewest();
        } else if (sortingMethod == "oldest") {
            sortTasksByOldest();
        } else if (sortingMethod == "dueDate") {
            sortTasksByDueDate();
        }
}

function attachSortingHandler() {
    updateSortingMethod();
    const sortTasksDropdown = document.getElementById("sortTasksDropdown");
    sortTasksDropdown.addEventListener("change", () => {
        const selected = sortTasksDropdown.value;
        console.log(selected);

        callCorrectSortingMethod(selected);
        saveTasks();
        showTasks();
        attachCheckboxHandler();

        localStorage.setItem("sortingMethod", JSON.stringify(selected));
    })
}
function sortTasksByText() {
    tasks.sort((a, b) => {
        const textA = a.text ? a.text.toLowerCase() : null;
        const textB = b.text ? b.text.toLowerCase() : null;

        if (textA && textB) {
            a.text.localeCompare(b.text);
        } else if (textA) {
            return -1;
        } else {
            return 1;
        }
    });
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

function sortTasksByDueDate() {
    tasks.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : null;
        const dateB = b.date ? new Date(b.date) : null;
        
        if (dateA && dateB) {
            return dateA - dateB;
        } else if (dateA) {
            return -1;
        } else {
            return 1;
        }

    });
}

function addTask(ord) {
    newTaskButton.addEventListener("click", () => {
        ord = addTaskFunc(ord);
    });
}

function addTaskFunc(ord) {
    const sortingMethod = JSON.parse(localStorage.getItem("sortingMethod")) || "alphabet";
    console.log(ord);
    const taskText = newTaskInput.value;
    const taskDate = newTaskDate.value;
    tasks.push({
        text: taskText,
        completed: false,
        onScreen: true,
        order: ord,
        date: taskDate
    });
    const taskItem = document.createElement("label");
    taskItem.className = "taskListItem";
    taskItem.setAttribute("id", `task-${ord}`);
    taskItem.innerHTML = `
        <input type="checkbox" class="taskCheckbox" id="checkbox-${ord}">
        <span class="taskText">${taskText}</span>
        <span class="taskDate">${taskDate}</span>
    `;
    taskList.appendChild(taskItem);
    callCorrectSortingMethod(sortingMethod);
    saveTasks();
    showTasks();
    attachCheckboxHandler();
    newTaskInput.value = "";
    return ord + 1;
}

function attachCheckboxHandler() {
    const taskCheckboxes = document.querySelectorAll("input[class='taskCheckbox']");
    const sortingMethod = JSON.parse(localStorage.getItem("sortingMethod")) || "alphabet";
    taskCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener("change", () => {
            tasks[index].completed = checkbox.checked;
            const taskItem = checkbox.closest(".taskListItem");
            taskItem.classList.toggle("completed", checkbox.checked);
            if (sortingMethod === "complete") {
                sortTasksByCompletion();
            }
            saveTasks();
            showTasks();
            attachCheckboxHandler();
        });
    });
}

function clearCompletedTasks() {
    clearCompletedButton.addEventListener("click", () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        showTasks();
        attachCheckboxHandler();
    });

}

let tasks = [];
loadTasks();
let ord = tasks.length;
attachSortingHandler();
showTasks();
attachCheckboxHandler();
console.log(tasks);
saveTasks();
ord = addTask(ord);

clearCompletedTasks();

