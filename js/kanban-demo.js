// kanban-demo.js - lightweight Kanban demo that persists to localStorage
// This is a simplified single-file demo inspired by your Kanban project.

(function () {
  const STORAGE_KEY = 'jd_kanban_demo_v1';

  function defaultData() {
    return [
      { id: 1, title: 'Launch Epic Career 🚀', description: 'Create a killer Resume', status: 'todo' },
      { id: 2, title: 'Master JavaScript 💛', description: 'Practice closures & DOM', status: 'inprogress' },
      { id: 3, title: 'Publish Portfolio', description: 'Deploy to Netlify', status: 'done' },
    ];
  }

  function save(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultData();
    } catch (e) {
      return defaultData();
    }
  }

  function createBoard(root) {
    root.innerHTML = `
      <div class="kanban-wrap">
        <div class="kanban-col" data-status="todo"><h4>To Do</h4><div class="col-list"></div><button class="add-btn">+ Add</button></div>
        <div class="kanban-col" data-status="inprogress"><h4>In Progress</h4><div class="col-list"></div></div>
        <div class="kanban-col" data-status="done"><h4>Done</h4><div class="col-list"></div></div>
      </div>
      <style>
        .kanban-wrap{display:flex;gap:10px;margin-top:12px}
        .kanban-col{background:rgba(255,255,255,0.02);padding:8px;border-radius:8px;flex:1;min-height:120px}
        .col-list{min-height:80px;display:flex;flex-direction:column;gap:8px}
        .card{padding:8px;border-radius:8px;background:linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02));cursor:grab}
        .add-btn{margin-top:8px;padding:6px;border-radius:6px;border:none;background:linear-gradient(90deg,#5eead4,#7c3aed);color:#031019;cursor:pointer}
      </style>
    `;
  }

  // Drag & Drop minimal implementation
  function mount(rootSelector) {
    const container = (typeof rootSelector === 'string') ? document.querySelector(rootSelector) : rootSelector;
    if (!container) return;
    container.innerHTML = '<p>Loading kanban demo...</p>';
    createBoard(container);
    let tasks = load();

    function render() {
      tasks = tasks.sort((a,b)=>a.id-b.id);
      const cols = container.querySelectorAll('.kanban-col');
      cols.forEach(col => {
        const status = col.getAttribute('data-status');
        const list = col.querySelector('.col-list');
        list.innerHTML = '';
        tasks.filter(t => t.status === status).forEach(t => {
          const el = document.createElement('div');
          el.className = 'card';
          el.draggable = true;
          el.dataset.id = t.id;
          el.innerHTML = `<strong>${t.title}</strong><div style="font-size:.85rem;color:rgba(255,255,255,0.6)">${t.description}</div>`;
          el.addEventListener('dragstart', (ev) => {
            ev.dataTransfer.setData('text/plain', t.id);
          });
          list.appendChild(el);
        });
      });
      save(tasks);
    }

    // add button only on todo column to keep it tiny
    const addBtn = container.querySelector('.kanban-col[data-status="todo"] .add-btn');
    addBtn.addEventListener('click', () => {
      const title = prompt('Task title');
      if (!title) return;
      const id = Date.now();
      tasks.push({ id, title, description: 'No description', status: 'todo' });
      render();
    });

    // allow drops
    container.querySelectorAll('.kanban-col .col-list').forEach(list => {
      list.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
      list.addEventListener('drop', (e) => {
        const id = Number(e.dataTransfer.getData('text/plain'));
        const col = e.currentTarget.closest('.kanban-col');
        const newStatus = col.getAttribute('data-status');
        tasks = tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
        render();
      });
    });

    render();
  }

  // expose starter
  window.startKanbanDemo = function (selector) {
    // wait a tick for modal mount
    setTimeout(() => mount(selector), 60);
  };
})();
