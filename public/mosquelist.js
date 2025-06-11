document.addEventListener('DOMContentLoaded', function () {
    const mosqueList = document.getElementById('mosque-list');
    if (!mosqueList) return;

    fetch('/moskeer.json')
        .then(res => res.json())
        .then(mosques => {
            mosqueList.innerHTML = '';
            mosques.forEach(mosque => {
                const div = document.createElement('div');
                div.className = `mosque-card bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 mb-4`;
                div.innerHTML = `
                    <h3 class="text-xl font-semibold mb-2">${mosque.namn || 'Okänd moské'}</h3>
                    <div class="flex items-center text-sm text-gray-600 mb-2">
                        <i class="fas fa-map-marker-alt mr-2"></i>
                        <span>${mosque.entrance || ''}</span>
                    </div>
                    <p class="text-gray-700 text-sm mb-1">${mosque.beskrivning || ''}</p>
                `;
                mosqueList.appendChild(div);
            });
        })
        .catch(err => {
            mosqueList.innerHTML = '<div class="text-red-600">Kunde inte ladda moskéer!</div>';
            console.error(err);
        });
});