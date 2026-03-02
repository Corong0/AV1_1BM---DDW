
const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const errorMessage = document.querySelector('#errorMessage');

let tasks = [];

let editingIndex = null;

// Função para validar tarefa
function validarTarefa(texto) {
    return texto.trim() !== '';
}

// Função para adicionar tarefa
function addTask(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    // Validação com trim() - impede tarefas vazias
    if (!validarTarefa(taskText)) {
        // Feedback no DOM com textContent e classList
        errorMessage.textContent = 'Por favor, digite uma tarefa antes de adicionar!';
        errorMessage.classList.add('show');
        return;
    }

    errorMessage.textContent = '';
    errorMessage.classList.remove('show');

    // Inserir tarefa no array
    tasks.push(taskText);

    taskInput.value = '';
    renderTasks();
    taskInput.focus();
}

// Função para remover tarefa
function removeTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Função para entrar em modo edição
function editTask(index) {
    editingIndex = index;
    renderTasks();
    
    const editInput = document.querySelector(`#editInput-${index}`);
    if (editInput) {
        editInput.focus();
    }
}

// Função para confirmar a edição
function confirmEdit(index) {
    const editInput = document.querySelector(`#editInput-${index}`);
    
    if (editInput) {
        const newTaskText = editInput.value.trim();

        if (!validarTarefa(newTaskText)) {
            alert('A tarefa não pode estar vazia!');
            editInput.focus();
            return;
        }

        tasks[index] = newTaskText;
    }

    editingIndex = null;
    renderTasks();
}

// Função para cancelar a edição
function cancelEdit() {
    editingIndex = null;
    renderTasks();
}

// Função para renderizar a lista de tarefas com DOM manipulation
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'task-buttons';

        if (editingIndex === index) {
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.id = `editInput-${index}`;
            editInput.className = 'edit-input';
            editInput.value = task;

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Confirmar';
            confirmBtn.className = 'confirm-btn';
            confirmBtn.addEventListener('click', () => confirmEdit(index));

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancelar';
            cancelBtn.className = 'cancel-btn';
            cancelBtn.addEventListener('click', cancelEdit);

            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    confirmEdit(index);
                }
            });

            editInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    cancelEdit();
                }
            });

            buttonsContainer.appendChild(confirmBtn);
            buttonsContainer.appendChild(cancelBtn);
            li.appendChild(buttonsContainer);
            li.appendChild(editInput);
        } else {
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => editTask(index));

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.className = 'remove-btn';
            removeBtn.addEventListener('click', () => removeTask(index));

            buttonsContainer.appendChild(editBtn);
            buttonsContainer.appendChild(removeBtn);

            li.appendChild(buttonsContainer);
            li.appendChild(document.createTextNode(task));
        }

        taskList.appendChild(li);
    });
}

// addEventListener com evento submit do formulário
taskForm.addEventListener('submit', addTask);
