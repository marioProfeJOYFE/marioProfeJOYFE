// script.js
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const linksContainer = document.getElementById('links-container');

    for (const clase in data) {
      const section = document.createElement('section');
      section.classList.add('mt-4');
      section.innerHTML = `
        <h2 class="text-2xl font-bold">${clase}</h2>
        <ul>
          ${data[clase].map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}
        </ul>
      `;
      linksContainer.appendChild(section);
    }
  });
