"use strict";

const newTaskInput = document.getElementById("taskText");
const newTaskButton = document.getElementById("taskAddButton");
const taskList = document.getElementById("taskListContainer");
const clearCompletedButton = document.getElementById("clearCompletedTasksButton");
const newTaskDate = document.getElementById("taskDueDateInput");
const newTaskCategory = document.getElementById("taskCategoryInput");


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
        // Copilot code snippet. Got stuck on changing background color of task item
        const backColor = categories.find(category => category.id === task.category)?.color;
        taskItem.style.backgroundColor = backColor;
        // End of copilot code snippet
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
        } else if (sortingMethod == "category") {
            sortTasksByCategory();
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
            return a.text.localeCompare(b.text);
        } else if (textA) {
            return -1;
        } else{
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

function sortTasksByCategory() {
    tasks.sort((a, b) => {
        const catA = a.category ? a.category : null;
        const catB = b.category ? b.category : null;

        if (catA && catB) {
            return catA.localeCompare(catB);
        } else if (catA) {
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
    const taskCategory = newTaskCategory.value;
    tasks.push({
        text: taskText,
        completed: false,
        onScreen: true,
        order: ord,
        date: taskDate,
        category: taskCategory
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

function loadCategories() {
    categories = JSON.parse(localStorage.getItem("categories")) || [{
        id: "cat-Category",
        name: "Category",
        color: "#FFFFFF"
    }];
}

function renderCategories() {
    const categorySelect = document.getElementById("taskCategoryInput");
    categorySelect.innerHTML = "";
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        option.style.backgroundColor = category.color;
        categorySelect.appendChild(option);
    });
}

function saveCategories() {
    localStorage.setItem("categories", JSON.stringify(categories));
}

function attachAddCategoryHandler() {
    const addCategoryButton = document.getElementById("categoryAddButton");
    addCategoryButton.addEventListener("click", addCategory);
}

function addCategory() {
    const color = document.getElementById("categoryColorInput").value;
    const name = document.getElementById("categoryNameInput").value;
    if (name.length > 20) {
        alert("Category name is too long. Must be under 20 characters");
    }
    const id = `cat-${name.toLowerCase()}`;
    categories.push({
        id: id,
        name: name,
        color: color
    });
    saveCategories();
}

function attachDeleteCategoryHandler() {
    const deleteButton = document.getElementById("categoryDeleteButton");
    deleteButton.addEventListener("click", () => {
        let cat = deleteCategory();
        if (cat !== -1) {
            updateTaskCategories(cat);
        }
    });
}

function deleteCategory() {
    const deleteCatText = document.getElementById("categoryDeleteText").value.toLowerCase();
    let i = -1;
    categories.forEach(category => {
        i = categories.findIndex(category => category.id === `cat-${deleteCatText}`);
    })
    if (i === -1) {
        alert("Category not found. Please check spelling");
        return -1;
    }
    let cat = categories[i];
    categories.splice(i, 1);
    renderCategories();
    saveCategories();
    return cat;
}

function updateTaskCategories(cat) {
    tasks.forEach(task => {
        if (task.category === cat) {
            task.category = "Category"
        }
    })
}

let tasks = [];
let categories = [];
loadTasks();
loadCategories();
console.log(categories);
let nextOrder = tasks.length > 0 ? Math.max(...tasks.map(task => task.order)) + 1 : 0;
attachSortingHandler();
showTasks();
renderCategories();
attachCheckboxHandler();
saveTasks();
saveCategories();
console.log(categories);
nextOrder = addTask(nextOrder);
attachAddCategoryHandler();
attachDeleteCategoryHandler();

clearCompletedTasks();

