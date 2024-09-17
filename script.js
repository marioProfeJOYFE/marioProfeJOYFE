// script.js
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const linksContainer = document.getElementById('links-container');
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500']; // Puedes personalizar los colores aquí

    let colorIndex = 0;
    for (const clase in data) {
      const section = document.createElement('section');
      section.classList.add(colors[colorIndex], 'rounded-lg', 'p-4');
      colorIndex = (colorIndex + 1) % colors.length;

      section.innerHTML = `
        <h2 class="text-2xl font-bold text-white">${clase}</h2>
        <ul class="list-disc">
          ${data[clase].map(link => `<li><a href="${link}" target="_blank" class="text-white hover:underline">${link}</a></li>`).join('')}
        </ul>
      `;
      linksContainer.appendChild(section);
    }
  });
