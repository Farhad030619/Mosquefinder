document.addEventListener('DOMContentLoaded', function () {
    function renderMosques() {
        const mosqueList = document.getElementById('mosque-list');
        if (!mosqueList) {
            console.log('Hittar inte #mosque-list i DOM!');
            return;
        }

        fetch('moskeer.json')
            .then(res => {
                if (!res.ok) throw new Error("Kunde inte ladda moskeer.json! Status: " + res.status);
                return res.json();
            })
            .then(mosques => {
                console.log('Moskédata hämtad:', mosques);
                mosqueList.innerHTML = '';
                if (!Array.isArray(mosques) || mosques.length === 0) {
                    mosqueList.innerHTML = '<div class="text-red-600">Inga moskéer i JSON-filen!</div>';
                    return;
                }
                mosques.forEach(mosque => {
                    const div = document.createElement('div');
                    div.className = 'mosque-card bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 mb-4';
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
                mosqueList.innerHTML = '<div class="text-red-600">Kunde inte ladda moskéer! ' + err + '</div>';
                console.error('Fel vid fetch av moskeer.json:', err);
            });
    }

    // Rendera direkt om listan är synlig:
    if (!document.getElementById('list-content').classList.contains('hidden')) {
        renderMosques();
    }

    // Rendera när tabben klickas:
    const listTab = document.getElementById('list-tab');
    if (listTab) {
        listTab.addEventListener('click', renderMosques);
    }
});