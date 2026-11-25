const STORAGE_KEY = "tareas";
let idEditando = null;

// Read all tasks from localStorage
function getTareas() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Save the full task list to localStorage
function saveTareas(tareas) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

// Create a new task and persist it
function createTarea(titulo, descripcion) {
  const tareas = getTareas();
  tareas.push({ id: Date.now(), titulo, descripcion });
  saveTareas(tareas);
}

// Update an existing task by id
function updateTarea(id, titulo, descripcion) {
  const tareas = getTareas().map((tarea) =>
    tarea.id === id ? { ...tarea, titulo, descripcion } : tarea
  );
  saveTareas(tareas);
}

// Delete a task by id and persist the new list
function deleteTarea(id) {
  const tareas = getTareas().filter((tarea) => tarea.id !== id);
  saveTareas(tareas);
}

// Load a task into the form to edit it
function editTarea(id) {
  const tarea = getTareas().find((t) => t.id === id);
  if (!tarea) return;

  idEditando = id;
  document.getElementById("txtTitulo").value = tarea.titulo;
  document.getElementById("txtDescripcion").value = tarea.descripcion;
  document.getElementById("btnGuardar").textContent = "Actualizar tarea";
  document.getElementById("txtTitulo").focus();
}

// Ask for confirmation and delete a task
function confirmDeleteTarea(id) {
  if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;

  // If the deleted task was being edited, reset the form
  if (idEditando === id) {
    idEditando = null;
    document.getElementById("frmTarea").reset();
    document.getElementById("btnGuardar").textContent = "Guardar tarea";
  }

  deleteTarea(id);
  renderTareas();
}

// Render the task list in the page
function renderTareas() {
  const lista = document.getElementById("lstTareas");
  const tareas = getTareas();
  lista.innerHTML = "";

  if (tareas.length === 0) {
    lista.innerHTML = '<li class="vacio">No hay tareas registradas.</li>';
    return;
  }

  tareas.forEach((tarea) => {
    const item = document.createElement("li");

    const titulo = document.createElement("strong");
    titulo.textContent = tarea.titulo;

    const descripcion = document.createElement("p");
    descripcion.textContent = tarea.descripcion;

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.textContent = "Editar";
    btnEditar.className = "btn-editar";
    btnEditar.addEventListener("click", () => editTarea(tarea.id));

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.className = "btn-eliminar";
    btnEliminar.addEventListener("click", () => confirmDeleteTarea(tarea.id));

    item.append(titulo, descripcion, btnEditar, btnEliminar);
    lista.appendChild(item);
  });
}

document.getElementById("frmTarea").addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("txtTitulo").value;
  const descripcion = document.getElementById("txtDescripcion").value;

  if (idEditando !== null) {
    updateTarea(idEditando, titulo, descripcion);
    idEditando = null;
    document.getElementById("btnGuardar").textContent = "Guardar tarea";
  } else {
    createTarea(titulo, descripcion);
  }

  e.target.reset();
  renderTareas();
});

// Show the saved tasks when the page loads
renderTareas();