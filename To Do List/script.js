document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCounter = document.getElementById('taskCounter');
    const emptyState = document.getElementById('emptyState');
    const errorMsg = document.getElementById('errorMsg');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Load tasks from Local Storage if available (Optional Challenge feature implemented for robustness)
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    // Initial render
    renderTasks();

    // Event Listener for Adding Task via Button
    addTaskBtn.addEventListener('click', handleAddTask);

    // Event Listener for Adding Task via Enter key
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    });

    // Add Task Function with Validation (Task 3 & 6)
    function handleAddTask() {
        const taskText = taskInput.value.trim();

        // Validate user input: prevent empty strings or spaces only (Task 6)
        if (taskText === '') {
            showError('Task cannot be empty or contain only spaces.');
            return;
        }

        hideError();

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = '';
        saveAndRender();
    }

    // Render Tasks based on current filter state
    function renderTasks() {
        taskList.innerHTML = '';

        // Filter tasks based on selected tab (Task 7)
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true; // 'all'
        });

        // Toggle empty state message
        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `list-group-item d-flex justify-content-between align-items-center py-3 px-3 border-start-0 border-end-0 ${task.completed ? 'bg-light' : ''}`;
            
            li.innerHTML = `
                <div class="form-check d-flex align-items-center gap-2">
                    <input class="form-check-input task-checkbox mt-0" type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                    <span class="${task.completed ? 'completed-task' : ''}">${escapeHTML(task.text)}</span>
                </div>
                <button class="btn btn-outline-danger btn-sm delete-btn px-2 py-1" data-id="${task.id}">Delete</button>
            `;
            taskList.appendChild(li);
        });

        updateCounter();
    }

    // Event delegation for checkboxes (Task 4) and delete buttons (Task 5)
    taskList.addEventListener('click', (e) => {
        const id = Number(e.target.getAttribute('data-id'));

        if (e.target.classList.contains('task-checkbox')) {
            toggleTaskCompletion(id);
        }

        if (e.target.classList.contains('delete-btn')) {
            deleteTask(id);
        }
    });

    // Toggle Task Complete / Active status (Task 4)
    function toggleTaskCompletion(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveAndRender();
    }

    // Delete a single selected task (Task 5)
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveAndRender();
    }

    // Update remaining active task counter (Task 8)
    function updateCounter() {
        const activeCount = tasks.filter(task => !task.completed).length;
        taskCounter.textContent = `${activeCount} remaining`;
    }

    // Clear all completed tasks (Task 8)
    clearCompletedBtn.addEventListener('click', () => {
        tasks = tasks.filter(task => !task.completed);
        saveAndRender();
    });

    // Filter button event listeners (Task 7)
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderTasks();
        });
    });

    // Error handling message helpers
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    }

    function hideError() {
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
    }

    // Save to Local Storage and re-render
    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Utility to prevent basic HTML injection in tasks
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});