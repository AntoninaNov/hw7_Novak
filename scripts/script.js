// Initialize all the UI elements
const init = () => {
    addTaskRemovalListeners();
    addTaskToggleListeners();
    addTitleEditListeners();
    attachKeydownEvents();
    attachBulkActions();
};

// Attach event listeners to close buttons for task removal
const addTaskRemovalListeners = () => {
    document.querySelectorAll(".close").forEach(btn => {
        btn.addEventListener("click", function() {
            const listItem = this.closest('li'); // Get the closest li (list item) of the clicked close button
            listItem.remove(); // Remove the list item from the DOM
        });
    });
};


// Toggle 'checked' class on list items upon click
const addTaskToggleListeners = () => {
    document.querySelector('ul').addEventListener('click', ev => {
        if (ev.target.tagName === 'LI' || ev.target.classList.contains('task-title')) {
            ev.target.closest('LI').classList.toggle('checked');
        }
    });
};

// Handle task title editing upon double-click
const promptForTitleUpdate = (titleDiv, listItem) => {
    const currentTitle = titleDiv.textContent.trim();
    const newTitle = prompt("Please edit your task title:", currentTitle);
    if (newTitle !== null && newTitle.trim() !== "") {
        titleDiv.textContent = newTitle.trim();
        listItem.querySelector(".timestamp").textContent = `(Modified) ${new Date().toLocaleString()}`;
        const taskList = document.getElementById("myUL");
        taskList.prepend(listItem);
    }
};

// Attach event listeners for double-clicking to edit tasks
const addTitleEditListeners = () => {
    document.querySelectorAll(".task-title").forEach(titleDiv => {
        titleDiv.addEventListener("dblclick", function() {
            const listItem = this.closest("LI");
            promptForTitleUpdate(this, listItem);
        });
    });
};

// Create a new task and append to the list
const addNewTask = () => {
    const inputValue = document.getElementById("myInput").value.trim();
    if (inputValue === '') {
        alert("Kindly enter a task before proceeding.");
        return;
    }
    const li = generateTaskElement(inputValue);
    const taskList = document.getElementById("myUL");
    taskList.prepend(li);
    document.getElementById("myInput").value = "";
    addTaskRemovalListeners();
};

// Create a new task element
const generateTaskElement = (taskTitle) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center"; // Bootstrap classes

    const titleDiv = document.createElement("div");
    titleDiv.className = "task-title";

    const timestampDiv = document.createElement("div");
    timestampDiv.className = "timestamp"; // Bootstrap class for muted text

    const closeDiv = document.createElement("div");
    closeDiv.className = "close text-danger"; // Bootstrap class for red text
    closeDiv.style.cursor = "pointer"; // Make the close button look clickable

    titleDiv.textContent = taskTitle;
    timestampDiv.textContent = `${new Date().toLocaleString()}`;
    closeDiv.textContent = "\u00D7";

    li.append(titleDiv, timestampDiv, closeDiv);
    attachTaskEvents(li, titleDiv);
    return li;
};


// Attach events to each task for editing and closing
const attachTaskEvents = (li, titleDiv) => {
    titleDiv.addEventListener("dblclick", function() {
        promptForTitleUpdate(titleDiv, li);
    });
    li.querySelector(".close").addEventListener("click", function() {
        li.style.display = "none";
    });
};

// Set up keyboard shortcuts for task input
const attachKeydownEvents = () => {
    document.addEventListener("keydown", e => {
        if (e.key === "Enter" && e.target.id === "myInput") {
            addNewTask();
        } else if (e.key === "Escape") {
            document.getElementById("myInput").value = "";
        }
    });
};

// Attach bulk task actions for delete and remove
const attachBulkActions = () => {
    document.getElementById("rem-all").addEventListener("click", allTasksRemoval);
    document.getElementById("rem-completed").addEventListener("click", completedTasksRemoval);
};

// Delete all tasks with confirmation
const allTasksRemoval = () => {
    const taskList = document.getElementById("myUL");
    const totalTasks = taskList.querySelectorAll('li').length;
    const uncompletedTasks = taskList.querySelectorAll('li:not(.checked)').length;

    // Check if the list is empty
    if (totalTasks === 0) {
        alert("There are no tasks to delete.");
        return;
    }

    const shouldDelete = uncompletedTasks === 0 || confirm(`Are you certain? You have ${uncompletedTasks} pending tasks.`);
    if (shouldDelete) {
        taskList.textContent = '';
    }
};

// Remove completed tasks from the list
const completedTasksRemoval = () => {
    const completedTasks = document.querySelectorAll('li.checked');
    if (completedTasks.length === 0) {
        alert("There are no completed tasks to remove.");
        return;
    }

    completedTasks.forEach(item => {
        item.remove();
    });
};


// Kickstart the application
init();
