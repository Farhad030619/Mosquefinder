// Funktion för att räkna ut avstånd mellan två koordinater (Haversine-formeln)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Jordens radie i km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

let currentSearchTerm = "";

document.addEventListener('DOMContentLoaded', function () {
    let userPosition = null;
    let positionFetched = false;

    // Hämta användarens position
    function fetchUserPosition(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    userPosition = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    };
                    positionFetched = true;
                    callback();
                },
                () => {
                    userPosition = null;
                    positionFetched = true;
                    callback();
                }
            );
        } else {
            userPosition = null;
            positionFetched = true;
            callback();
        }
    }

    // Sökfält
    const searchInput = document.getElementById('mosque-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            currentSearchTerm = searchInput.value;
            renderMosques();
        });
    }

    // Sorteringsfält
    const sortInput = document.getElementById('sort-by');
    if (sortInput) {
        sortInput.addEventListener('change', function () {
            renderMosques();
        });
    }

    // Rättskole-filter
    const schoolInput = document.getElementById('filter-school');
    if (schoolInput) {
        schoolInput.addEventListener('change', function () {
            renderMosques();
        });
    }

    function sortMosques(mosques, sortBy) {
        if (!sortBy) return mosques;
        let sorted = mosques.slice();
        switch (sortBy) {
            case "name-asc":
                sorted.sort((a, b) => (a.namn || '').localeCompare(b.namn || ''));
                break;
            case "name-desc":
                sorted.sort((a, b) => (b.namn || '').localeCompare(a.namn || ''));
                break;
            case "distance-asc":
                if (!userPosition) break;
                sorted.sort((a, b) => {
                    const distA = getDistanceFromLatLonInKm(userPosition.lat, userPosition.lng, a.lat, a.lng);
                    const distB = getDistanceFromLatLonInKm(userPosition.lat, userPosition.lng, b.lat, b.lng);
                    return distA - distB;
                });
                break;
            case "distance-desc":
                if (!userPosition) break;
                sorted.sort((a, b) => {
                    const distA = getDistanceFromLatLonInKm(userPosition.lat, userPosition.lng, a.lat, a.lng);
                    const distB = getDistanceFromLatLonInKm(userPosition.lat, userPosition.lng, b.lat, b.lng);
                    return distB - distA;
                });
                break;
            default:
                break;
        }
        return sorted;
    }

    function renderMosques() {
        const mosqueList = document.getElementById('mosque-list');
        if (!mosqueList) return;
        fetch('moskeer.json')
            .then(res => {
                if (!res.ok) throw new Error("Kunde inte ladda moskeer.json! Status: " + res.status);
                return res.json();
            })
            .then(mosques => {
                mosqueList.innerHTML = '';

                // Filtrera moskéer endast på namn
                let filteredMosques = mosques;

                // Filtrera på rättskola
                const schoolInput = document.getElementById('filter-school');
                const selectedSchool = schoolInput ? schoolInput.value : "all";
                if (selectedSchool !== "all") {
                    filteredMosques = filteredMosques.filter(mosque =>
                        mosque.rattsskola && mosque.rattsskola.toLowerCase() === selectedSchool
                    );
                }

                // Sökning på namn
                if (currentSearchTerm && currentSearchTerm.trim() !== "") {
                    const term = currentSearchTerm.trim().toLowerCase();
                    filteredMosques = filteredMosques.filter(mosque =>
                        mosque.namn && mosque.namn.toLowerCase().includes(term)
                    );
                }

                // Sortera utifrån valt alternativ
                const sortBy = document.getElementById('sort-by') ? document.getElementById('sort-by').value : null;
                filteredMosques = sortMosques(filteredMosques, sortBy);

                filteredMosques.forEach(mosque => {
                    let distanceText = "";
                    if (userPosition && mosque.lat && mosque.lng) {
                        const dist = getDistanceFromLatLonInKm(
                            userPosition.lat, userPosition.lng,
                            mosque.lat, mosque.lng
                        );
                        let distDisplay = dist < 1
                            ? `${Math.round(dist * 1000)} m`
                            : `${dist.toFixed(1)} km`;
                        distanceText = `<div class="text-sm text-blue-700 mt-2"><i class="fas fa-location-arrow"></i> Ca ${distDisplay} från dig</div>`;
                    } else if (positionFetched && !userPosition) {
                        distanceText = `<div class="text-sm text-yellow-600 mt-2"><i class="fas fa-location-arrow"></i> Kan inte hämta din position</div>`;
                    }
                    const div = document.createElement('div');
                    div.className = 'mosque-card bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 mb-4';
                    div.innerHTML = `
                        <h3 class="text-xl font-semibold mb-2">${mosque.namn || 'Okänd moské'}</h3>
                        <div class="flex items-center text-sm text-gray-600 mb-2">
                            <i class="fas fa-map-marker-alt mr-2"></i>
                            <span>${mosque.entrance || ''}</span>
                        </div>
                        <p class="text-gray-700 text-sm mb-1">${mosque.beskrivning || ''}</p>
                        <div class="text-xs text-gray-500 mb-1">Rättskola: ${mosque.rattsskola || 'okänd'}</div>
                        ${distanceText}
                    `;
                    mosqueList.appendChild(div);
                });

                if (filteredMosques.length === 0) {
                    mosqueList.innerHTML = '<div class="text-red-600">Ingen moské matchar din sökning eller filter!</div>';
                }
            })
            .catch(err => {
                mosqueList.innerHTML = '<div class="text-red-600">Kunde inte ladda moskéer! ' + err + '</div>';
                console.error('Fel vid fetch av moskeer.json:', err);
            });
    }

    // Hämta och rendera när användaren klickar på list-tab
    const listTab = document.getElementById('list-tab');
    if (listTab) {
        listTab.addEventListener('click', () => {
            if (!positionFetched) {
                fetchUserPosition(renderMosques);
            } else {
                renderMosques();
            }
        });
    }

    // Om listan är synlig vid laddning, hämta plats direkt
    if (!document.getElementById('list-content').classList.contains('hidden')) {
        fetchUserPosition(renderMosques);
    }
});