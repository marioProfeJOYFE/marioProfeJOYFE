document.addEventListener("DOMContentLoaded", function () {
    const repoList = document.getElementById('repo-list');
    const repoForm = document.getElementById('repo-form');
    const tabs = document.querySelectorAll('.tab-link');
    let activeClass = 'dam-a'; // Por defecto, comienza con la clase A
    let repoData;

    // Cargar los datos del archivo JSON
    fetch('repos.json')
        .then(response => response.json())
        .then(data => {
            repoData = data;
            const path = window.location.pathname;

            // Si estamos en la página pública, cargar los repositorios de la clase por defecto
            if (path.includes('index.html') || path === '/') {
                loadReposForClass(activeClass);
            }

            // Si estamos en la página de administración, configurar el formulario
            if (repoForm && path.includes('admin.html')) {
                setupAdminForm();
            }
        });

    // Función para cargar repositorios de una clase específica en la página pública
    function loadReposForClass(classId) {
        repoList.innerHTML = ''; // Limpiar la lista de repositorios
        if (repoData && repoData[classId]) {
            repoData[classId].forEach(repo => {
                addRepoToDOM(repo);
            });
        }
    }

    // Función para agregar un repositorio al DOM (en la página pública)
    function addRepoToDOM(repo) {
        const repoCard = document.createElement('div');
        repoCard.className = 'bg-white p-6 rounded-lg shadow-lg';
        repoCard.innerHTML = `
            <h3 class="text-xl font-bold text-gray-800">${repo.name}</h3>
            <a href="${repo.url}" target="_blank" class="text-indigo-500 hover:text-indigo-600 text-clip">${repo.url}</a>
            <p class="text-gray-500 text-sm">Añadido el: ${repo.date}</p>
        `;
        repoList.appendChild(repoCard);
    }

    // Función para configurar el formulario en la página de administración
    function setupAdminForm() {
        repoForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Obtener los valores del formulario
            const classId = document.getElementById('class').value;
            const name = document.getElementById('name').value;
            const url = document.getElementById('url').value;
            const date = new Date().toLocaleDateString();  // Fecha actual en formato legible

            // Crear el nuevo repositorio con la fecha actual
            const newRepo = { name, url, date };

            saveRepo(newRepo, classId); // Guardar el nuevo repositorio en localStorage
            alert('Repositorio agregado correctamente');

            // Limpiar el formulario
            repoForm.reset();
        });
    }

    // Guardar el nuevo repositorio en localStorage para la clase seleccionada
    function saveRepo(repo, classId) {
        let repos = JSON.parse(localStorage.getItem(classId)) || [];
        repos.push(repo);
        localStorage.setItem(classId, JSON.stringify(repos));
    }

    // Cambiar de pestaña en la página pública
    if (tabs) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function () {
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                activeClass = this.getAttribute('data-class');
                loadReposForClass(activeClass);
            });
        });
    }
});
