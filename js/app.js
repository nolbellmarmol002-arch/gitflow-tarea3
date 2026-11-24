const STORAGE_KEY = "tareas";

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

document.getElementById("frmTarea").addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("txtTitulo").value;
  const descripcion = document.getElementById("txtDescripcion").value;

  createTarea(titulo, descripcion);
  e.target.reset();
  alert("Tarea guardada");
});