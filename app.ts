
interface Task {
    id: number;
    name: string;
    dueDate: string;
    completed: boolean;
}

const form = document.getElementById("todo-form") as HTMLFormElement;
const taskNameInput = document.getElementById("task-name") as HTMLInputElement;
const dueDateInput = document.getElementById("due-date") as HTMLInputElement;
const taskList = document.getElementById("task-list") as HTMLUListElement;

let tasks: Task[] = loadTasks();

// Load tasks from localStorage
function loadTasks(): Task[] {
    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
        try {
            const parsed: unknown = JSON.parse(storedTasks);

            if (
                Array.isArray(parsed) &&
                parsed.every(
                    (task: unknown) =>
                        typeof task === "object" &&
                        task !== null &&
                        "id" in task &&
                        typeof task.id === "number" &&
                        "name" in task &&
                        typeof task.name === "string" &&
                        "dueDate" in task &&
                        typeof task.dueDate === "string" &&
                        "completed" in task &&
                        typeof task.completed === "boolean"
                )
            ) {
                return parsed as Task[];
            }
        } catch {
            // Ignore invalid JSON and start with an empty list.
        }
    }

    return [];
}

// Save tasks to localStorage
function saveTasks(): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display all tasks
function renderTasks(): void {
    taskList.innerHTML = "";

    tasks.forEach((task: Task) => {
        const li = document.createElement("li");
        li.className = "task";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", `Complete ${task.name}`);

        const details = document.createElement("div");
        details.className = "task-details";

        const name = document.createElement("span");
        name.textContent = task.name;

        if (task.completed) {
            name.classList.add("completed");
        }

        const date = document.createElement("p");
        date.textContent = `Due date: ${task.dueDate}`;

        details.append(name, date);

        // Toggle completed/pending status
        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Delete task
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter((item: Task) => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        li.append(checkbox, details, deleteButton);
        taskList.appendChild(li);
    });
}

// Add a new task
form.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();

    const name = taskNameInput.value.trim();
    const dueDate = dueDateInput.value;

    if (!name || !dueDate) {
        return;
    }

    const newTask: Task = {
        id: Date.now(),
        name: name,
        dueDate: dueDate,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    form.reset();
});

// Display saved tasks on page load
renderTasks();
