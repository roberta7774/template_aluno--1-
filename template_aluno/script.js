/*
ATIVIDADE: LISTA DE TAREFAS INTERATIVA - JAVASCRIPT

NOME DO ALUNO: Mariah Vitória e Roberta Castellan
TURMA: 3º B
DATA: 18/10/2025

INSTRUÇÕES GERAIS:
- Implemente todas as funcionalidades marcadas com TODO
- Mantenha o código organizado e comentado
- Use boas práticas de programação JavaScript
- Teste todas as funcionalidades antes de entregar
- Valide todas as entradas do usuário

FUNCIONALIDADES OBRIGATÓRIAS (40 pontos):
1. Adicionar tarefas (8 pontos)
2. Marcar como concluída/pendente (6 pontos)
3. Editar tarefas (8 pontos)
4. Excluir tarefas (6 pontos)
5. Filtrar tarefas (6 pontos)
6. Buscar tarefas (3 pontos)
7. Persistência localStorage (3 pontos)

QUALIDADE DO CÓDIGO (25 pontos):
- Organização e estrutura (10 pontos)
- Comentários e documentação (5 pontos)
- Tratamento de erros (5 pontos)
- Validações (5 pontos)

DICAS:
- Use addEventListener para eventos
- Implemente validações de entrada
- Use localStorage para persistir dados
- Mantenha funções pequenas e específicas
- Teste cada funcionalidade isoladamente
*/

// ===== VARIÁVEIS GLOBAIS =====
// TODO: Declare as variáveis globais necessárias
let tasks = []; // Array para armazenar as tarefas
let currentFilter = 'todas'; // Filtro atual
let searchTerm = ''; // Termo de busca atual
let editingTaskId = null; // ID da tarefa sendo editada

// ===== INICIALIZAÇÃO =====
// TODO: Implemente a função de inicialização
document.addEventListener('DOMContentLoaded', function() {
    // TODO: Carregue as tarefas do localStorage
    loadTasks();
    
    // TODO: Configure todos os event listeners
    setupEventListeners();
    
    // TODO: Renderize a lista inicial
    renderTasks();
    
    // TODO: Adicione tarefas de exemplo se não houver nenhuma
    if (tasks.length === 0) {
        addExampleTasks();
    }
});

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
// TODO: Implemente a função para configurar todos os event listeners
function setupEventListeners() {
    const addBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const filterSelect = document.getElementById('filterSelect');
    const searchInput = document.getElementById('searchInput');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const closeBtn = document.querySelector('.close');
    const modal = document.getElementById('editModal');
    const editTaskInput = document.getElementById('editTaskInput');

    // Adicionar tarefa (botão)
    addBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addTask();
    });

    // Adicionar tarefa com Enter no campo de texto
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });

    // Filtro de exibição
    filterSelect.addEventListener('change', function(e) {
        currentFilter = e.target.value;
        renderTasks();
    });

    // Busca por texto
    searchInput.addEventListener('input', function(e) {
        searchTerm = e.target.value.trim().toLowerCase();
        renderTasks();
    });

    // Limpar concluídas
    clearCompletedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearCompleted();
    });

    // Limpar todas
    clearAllBtn.addEventListener('click', function(e) {
        e.preventDefault();
        clearAll();
    });

    // Modal de edição
    saveEditBtn.addEventListener('click', function(e) {
        e.preventDefault();
        saveEdit();
    });

    cancelEditBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    }

    // Tecla ESC fecha modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // Enter no campo de edição
    if (editTaskInput) {
        editTaskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') saveEdit();
        });
    }
}

// ===== FUNÇÕES PRINCIPAIS =====
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const text = taskInput.value.trim();

    // Validações
    if (text === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    if (text.length > 100) {
        alert('A tarefa deve ter no máximo 100 caracteres!');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: prioritySelect.value || 'media',
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.unshift(task); // adiciona no início
    saveTasks();
    renderTasks();

    taskInput.value = '';
    prioritySelect.value = 'media';
    taskInput.focus();

    showNotification('Tarefa adicionada com sucesso!', 'success');
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
        showNotification(task.completed ? 'Tarefa concluída!' : 'Tarefa marcada como pendente!', 'info');
    }
}

function deleteTask(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        showNotification('Tarefa excluída!', 'success');
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editingTaskId = id;
        document.getElementById('editTaskInput').value = task.text;
        document.getElementById('editPrioritySelect').value = task.priority;
        document.getElementById('editModal').style.display = 'block';
    }
}

function saveEdit() {
    const newText = document.getElementById('editTaskInput').value.trim();
    const newPriority = document.getElementById('editPrioritySelect').value;

    if (newText === '') {
        alert('Digite um texto válido!');
        return;
    }

    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        task.text = newText;
        task.priority = newPriority;
        saveTasks();
        renderTasks();
        closeModal();
        showNotification('Tarefa atualizada com sucesso!', 'success');
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    editingTaskId = null;
}

function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('Não há tarefas concluídas para remover!');
        return;
    }
    if (confirm(`Deseja excluir ${completedCount} tarefa(s) concluída(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        showNotification('Tarefas concluídas removidas!', 'success');
    }
}

function clearAll() {
    if (tasks.length === 0) {
        alert('Não há tarefas para remover!');
        return;
    }
    if (confirm(`Excluir todas as ${tasks.length} tarefas?`)) {
        tasks = [];
        saveTasks();
        renderTasks();
        showNotification('Todas as tarefas foram removidas!', 'success');
    }
}

// ===== RENDERIZAÇÃO =====
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        taskList.style.display = 'block';
        filteredTasks.forEach(task => taskList.appendChild(createTaskElement(task)));
    }

    updateStats();
}

function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    const createdDate = new Date(task.createdAt).toLocaleDateString('pt-BR');
    const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString('pt-BR') : '';

    li.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <span class="task-text">${escapeHtml(task.text)}</span>
        <span class="task-priority priority-${task.priority}">${task.priority}</span>
        <span class="task-date">Criada: ${createdDate}${task.completed ? `<br>Concluída: ${completedDate}` : ''}</span>
        <div class="task-actions">
            <button onclick="editTask(${task.id})" ${task.completed ? 'disabled' : ''}><i class="fas fa-edit"></i></button>
            <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
        </div>
    `;
    return li;
}

// ===== FILTROS E BUSCA =====
function getFilteredTasks() {
    let filtered = [...tasks];
    switch (currentFilter) {
        case 'pendentes': filtered = filtered.filter(t => !t.completed); break;
        case 'concluidas': filtered = filtered.filter(t => t.completed); break;
        case 'alta':
        case 'media':
        case 'baixa': filtered = filtered.filter(t => t.priority === currentFilter); break;
    }
    if (searchTerm) filtered = filtered.filter(t => t.text.toLowerCase().includes(searchTerm));
    return filtered;
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    document.getElementById('totalTasks').textContent = `Total: ${total}`;
    document.getElementById('completedTasks').textContent = `Concluídas: ${completed}`;
    document.getElementById('pendingTasks').textContent = `Pendentes: ${pending}`;
}

// ===== LOCAL STORAGE =====
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('tasks');
    tasks = saved ? JSON.parse(saved) : [];
}

// ===== UTILITÁRIOS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    const n = document.createElement('div');
    n.className = `notification ${type}`;
    n.textContent = message;
    n.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #333; color: white;
        padding: 12px 16px; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        z-index: 1000; font-weight: 600;
    `;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

function addExampleTasks() {
    tasks = [
        { id: Date.now() - 1, text: 'Estudar JavaScript avançado', completed: false, priority: 'alta', createdAt: new Date().toISOString(), completedAt: null },
        { id: Date.now() - 2, text: 'Fazer exercícios de CSS', completed: true, priority: 'media', createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
        { id: Date.now() - 3, text: 'Revisar conceitos de HTML', completed: false, priority: 'baixa', createdAt: new Date().toISOString(), completedAt: null }
    ];
    saveTasks();
    renderTasks();
}
