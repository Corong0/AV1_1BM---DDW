// Selecionando elementos do DOM
const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const errorMessage = document.querySelector('#errorMessage');

// Array para armazenar as tarefas
let tasks = [];

// Variável para rastrear qual tarefa está sendo editada
let editingIndex = null;

// Função para validar e adicionar tarefa
function addTask(event) {
    // Prevenindo o comportamento padrão do formulário
    event.preventDefault();

    // Capturando o valor digitado
    const taskText = taskInput.value.trim();

    // Validação: verificar se a tarefa não está vazia
    if (taskText === '') {
        // Exibir mensagem de erro
        errorMessage.textContent = 'Por favor, digite uma tarefa antes de adicionar!';
        errorMessage.classList.add('show');
        return;
    }

    // Se a tarefa é válida, limpar a mensagem de erro
    errorMessage.textContent = '';
    errorMessage.classList.remove('show');

    // Adicionar tarefa ao array
    tasks.push(taskText);

    // Limpar o input
    taskInput.value = '';

    // Re-renderizar a lista
    renderTasks();

    // Focar no input para melhor UX
    taskInput.focus();
}

// Função para remover tarefa
function removeTask(index) {
    // Remover do array
    tasks.splice(index, 1);
    // Re-renderizar a lista
    renderTasks();
}

// Função para entrar em modo edição
function editTask(index) {
    editingIndex = index;
    renderTasks();
    
    // Focar no input de edição
    const editInput = document.querySelector(`#editInput-${index}`);
    if (editInput) {
        editInput.focus();
        editInput.select();
    }
}

// Função para confirmar a edição
function confirmEdit(index) {
    const editInput = document.querySelector(`#editInput-${index}`);
    
    if (editInput) {
        const newTaskText = editInput.value.trim();

        // Validar se não está vazio
        if (newTaskText === '') {
            alert('A tarefa não pode estar vazia!');
            editInput.focus();
            return;
        }

        // Atualizar no array
        tasks[index] = newTaskText;
    }

    // Sair do modo edição
    editingIndex = null;
    renderTasks();
}

// Função para cancelar a edição
function cancelEdit() {
    editingIndex = null;
    renderTasks();
}

// Função para renderizar a lista de tarefas
function renderTasks() {
    // Limpar a lista atual
    taskList.innerHTML = '';

    // Iterar sobre o array de tarefas e criar elementos <li>
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        // Criar container para os botões
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'task-buttons';

        // Se está em modo edição para esta tarefa
        if (editingIndex === index) {
            // Criar input para edição
            const editInput = document.createElement('input');
            editInput.type = 'text';
            editInput.id = `editInput-${index}`;
            editInput.className = 'edit-input';
            editInput.value = task;

            // Botão de confirmar
            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Confirmar';
            confirmBtn.className = 'confirm-btn';
            confirmBtn.addEventListener('click', () => confirmEdit(index));

            // Botão de cancelar
            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancelar';
            cancelBtn.className = 'cancel-btn';
            cancelBtn.addEventListener('click', cancelEdit);

            // Adicionar listeners de teclado
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

            // Adicionar botões e input à li
            buttonsContainer.appendChild(confirmBtn);
            buttonsContainer.appendChild(cancelBtn);
            li.appendChild(buttonsContainer);
            li.appendChild(editInput);
        } else {
            // Modo normal: exibir tarefa e botões de editar/remover
            // Botão de editar
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => editTask(index));

            // Botão de remover
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.className = 'remove-btn';
            removeBtn.addEventListener('click', () => removeTask(index));

            // Adicionar botões ao container
            buttonsContainer.appendChild(editBtn);
            buttonsContainer.appendChild(removeBtn);

            // Adicionar botões e texto à li
            li.appendChild(buttonsContainer);
            li.appendChild(document.createTextNode(task));
        }

        taskList.appendChild(li);
    });
}

// Adicionar event listener ao formulário para o evento submit
taskForm.addEventListener('submit', addTask);
