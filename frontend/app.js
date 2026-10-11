
const API_URL = "http://127.0.0.1:8000/api/tasks";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");

async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

async function loadTasks() {
    try {
        message.textContent = "";
        const tasks = await apiRequest(API_URL);
        list.replaceChildren();

        tasks.forEach(task => {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;

            const title = document.createElement("span");
            title.textContent = task.title;

            if (task.completed) {
                title.classList.add("completed");
            }

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Sil";

            checkbox.addEventListener("change", async () => {
                try {
                    await apiRequest(`${API_URL}/${task.id}`, {
                        method: "PATCH"
                    });
                    await loadTasks();
                } catch (error) {
                    message.textContent = error.message;
                    checkbox.checked = !checkbox.checked;
                }
            });

            deleteButton.addEventListener("click", async () => {
                try {
                    await apiRequest(`${API_URL}/${task.id}`, {
                        method: "DELETE"
                    });
                    await loadTasks();
                } catch (error) {
                    message.textContent = error.message;
                }
            });

            li.append(checkbox, title, deleteButton);
            list.appendChild(li);
        });
    } catch (error) {
        message.textContent = error.message;
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = input.value.trim();
    if (!title) return;

    try {
        await apiRequest(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        input.value = "";
        await loadTasks();
    } catch (error) {
        message.textContent = error.message;
    }
});

loadTasks();
