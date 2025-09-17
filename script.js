document.addEventListener('DOMContentLoaded', () => {
    // Configuración del repositorio (se lee desde #repo-config en el HTML)
    const repoConfig = document.getElementById('repo-config');
    const owner = repoConfig ? repoConfig.dataset.owner : null;
    const repo = repoConfig ? repoConfig.dataset.repo : null;

    const postsContainer = document.getElementById('posts-container');
    const filterChips = document.querySelectorAll('.chip');

    // Estado local de posts (Issues)
    let posts = [];

    // Util: crear el DOM de una card a partir de un objeto post
    function createCard(post) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.category = (post.labels && post.labels[0]) ? post.labels[0].name.toLowerCase() : 'other';

        const content = document.createElement('div');
        content.className = 'card-content';

        const h2 = document.createElement('h2');
        h2.textContent = post.title;

        const p = document.createElement('p');
        // Tomamos el cuerpo (body) y recortamos si es muy largo
        const text = post.body ? post.body.replace(/\r\n|\r|\n/g, ' ') : '';
        p.textContent = text.length > 220 ? text.slice(0, 217) + '...' : text;

        const a = document.createElement('a');
        a.href = post.html_url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Ver publicación';

        content.appendChild(h2);
        content.appendChild(p);
        content.appendChild(a);
        card.appendChild(content);

        // Mantener efecto 3D / brillo tal como antes
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });

        return card;
    }

    // Renderizar la lista actual de posts aplicando filtro
    function renderPosts(filter = 'all') {
        postsContainer.innerHTML = '';
        const filtered = posts.filter(post => filter === 'all' || ((post.labels && post.labels[0]) ? post.labels[0].name.toLowerCase() === filter : filter === 'other'));
        if (filtered.length === 0) {
            const empty = document.createElement('p');
            empty.style.textAlign = 'center';
            empty.style.gridColumn = '1/-1';
            empty.textContent = 'No hay publicaciones para esta categoría.';
            postsContainer.appendChild(empty);
            return;
        }
        filtered.forEach(post => {
            const card = createCard(post);
            postsContainer.appendChild(card);
            // Entrada con animación
            card.style.display = 'block';
            setTimeout(() => card.classList.remove('hidden'), 20);
        });
    }

    // Manejo de filtros
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelector('.chip.active').classList.remove('active');
            chip.classList.add('active');
            const filter = chip.dataset.filter;
            renderPosts(filter);
        });
    });

    // Obtener Issues públicos del repositorio configurado mediante la API de GitHub
    async function fetchIssues() {
        if (!owner || !repo) {
            // Si no está configurado, dejamos una tarjeta de ejemplo
            posts = [
                { title: 'Ejemplo: configura repo', body: 'Edita el elemento #repo-config en index.html con tu usuario y repositorio para cargar publicaciones desde Issues.', html_url: '#', labels: [{ name: 'other' }] }
            ];
            renderPosts();
            return;
        }

        const endpoint = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=50`;
        try {
            const res = await fetch(endpoint, { headers: { Accept: 'application/vnd.github.v3+json' } });
            if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
            const data = await res.json();
            // Filtrar pulls (Issues devuelve PRs también). Los PRs tienen la propiedad pull_request
            posts = data.filter(i => !i.pull_request).map(i => ({ title: i.title, body: i.body, html_url: i.html_url, labels: i.labels }));
            renderPosts();
        } catch (err) {
            console.error('Error cargando Issues', err);
            posts = [ { title: 'Error cargando publicaciones', body: String(err), html_url: '#', labels: [{ name: 'other' }] } ];
            renderPosts();
        }
    }

    // Inicializar
    fetchIssues();
});