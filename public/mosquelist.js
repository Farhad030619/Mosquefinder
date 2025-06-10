// Hämta och rendera moskéer från moskeer.json
fetch('moskeer.json')
  .then(response => response.json())
  .then(mosques => renderMosqueCards(mosques));

function renderMosqueCards(mosques) {
  const mosqueList = document.getElementById('mosque-list');
  mosqueList.innerHTML = '';
  mosques.forEach(mosque => {
    const div = document.createElement('div');
    div.className = `mosque-card bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 mb-4`;
    div.innerHTML = `
      <h3 class="text-xl font-semibold mb-2">${mosque.namn || 'Okänd moské'}</h3>
      <div class="flex items-center text-sm text-gray-600 mb-2">
        <i class="fas fa-map-marker-alt mr-2"></i>
        <span>${mosque.avstand || ''}</span>
      </div>
      <p class="text-gray-700 text-sm mb-1">${mosque.beskrivning || ''}</p>
      <p class="text-gray-700 text-sm mb-2"><b>Ingång:</b> ${mosque.entrance || mosque.adress || ''}</p>
      <div class="flex flex-wrap gap-1 mb-3">
        <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${mosque.skola || 'Oklart'}</span>
        <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Kapacitet: ${mosque.kapacitet || '?'}</span>
      </div>
      <button class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mosque.entrance || '')}')">
        <i class="fas fa-directions mr-1"></i> Vägbeskrivning
      </button>
    `;
    mosqueList.appendChild(div);
  });
}