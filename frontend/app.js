const API_URL = 'http://localhost:3000/api/libros';

const form = document.getElementById('libro-form');
const tabla = document.getElementById('tabla-libros');
const formTitulo = document.getElementById('form-titulo');
const btnCancelar = document.getElementById('btn-cancelar');

const campoId = document.getElementById('libro-id');
const campoTitulo = document.getElementById('titulo');
const campoAutor = document.getElementById('autor');
const campoIsbn = document.getElementById('isbn');
const campoAnio = document.getElementById('anio');
const campoDisponible = document.getElementById('disponible');

async function cargarLibros() {
  const res = await fetch(API_URL);
  const libros = await res.json();

  tabla.innerHTML = '';
  libros.forEach((libro) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${libro.id}</td>
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>${libro.isbn || ''}</td>
      <td>${libro.anio || ''}</td>
      <td class="${libro.disponible ? 'disponible-si' : 'disponible-no'}">
        ${libro.disponible ? 'Sí' : 'No'}
      </td>
      <td class="acciones">
        <button class="btn-editar" onclick="editarLibro(${libro.id})">Editar</button>
        <button class="btn-eliminar" onclick="eliminarLibro(${libro.id})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(fila);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const libro = {
    titulo: campoTitulo.value,
    autor: campoAutor.value,
    isbn: campoIsbn.value,
    anio: campoAnio.value ? parseInt(campoAnio.value) : null,
    disponible: campoDisponible.checked
  };

  const id = campoId.value;

  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(libro)
    });
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(libro)
    });
  }

  resetearFormulario();
  cargarLibros();
});

async function editarLibro(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const libro = await res.json();

  campoId.value = libro.id;
  campoTitulo.value = libro.titulo;
  campoAutor.value = libro.autor;
  campoIsbn.value = libro.isbn || '';
  campoAnio.value = libro.anio || '';
  campoDisponible.checked = !!libro.disponible;

  formTitulo.textContent = `Editando libro #${libro.id}`;
  btnCancelar.style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function eliminarLibro(id) {
  const confirmar = confirm('¿Seguro que deseas eliminar este libro?');
  if (!confirmar) return;

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  cargarLibros();
}

btnCancelar.addEventListener('click', resetearFormulario);

function resetearFormulario() {
  form.reset();
  campoId.value = '';
  campoDisponible.checked = true;
  formTitulo.textContent = 'Agregar nuevo libro';
  btnCancelar.style.display = 'none';
}

// Inicial
cargarLibros();
