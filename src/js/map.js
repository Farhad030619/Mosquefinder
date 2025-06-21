window.initMap = function () {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;
  const defaultCenter = { lat: 59.3293, lng: 18.0686 };
  const map = new google.maps.Map(mapDiv, {
    zoom: 11,
    center: defaultCenter
  });

  let allMarkers = [];

  // Hämta moskédata och skapa markörer
  fetch('moskeer.json')
    .then(res => res.json())
    .then(mosques => {
      mosques.forEach(mosque => {
        if (typeof mosque.lat === "number" && typeof mosque.lng === "number") {
          const marker = new google.maps.Marker({
            position: { lat: mosque.lat, lng: mosque.lng },
            map,
            title: mosque.namn,
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<div>
              <h3>${mosque.namn || ''}</h3>
              <div>${mosque.entrance || ''}</div>
              <div>${mosque.beskrivning || ''}</div>
              <div style="font-size:0.8em;color:#666;">
                Rättskola: ${getMosqueSchoolString(mosque)}
              </div>
            </div>`
          });

          marker.addListener('click', () => infoWindow.open(map, marker));
          marker._mosque = mosque; // Spara referens för filtrering
          allMarkers.push(marker);
        }
      });

      // Sätt igång filtrering direkt om fälten redan har värden
      filterMarkers();
    });

  // Hjälpfunktion för att extrahera rättskola från olika fältnamn
  function getMosqueSchoolString(mosque) {
    // Kolla olika möjliga fältnamn
    return (
      (mosque.rattsskola || mosque['rättskola'] || mosque.skola || mosque.school || mosque.madhab || 'Okänd')
    );
  }

  function getMosqueSchoolValue(mosque) {
    // Returnerar rättskole-värdet som små bokstäver utan mellanslag, för filtrering
    const val = getMosqueSchoolString(mosque);
    return typeof val === 'string' ? val.trim().toLowerCase() : '';
  }

  // Filterfunktion
  function filterMarkers() {
    const searchVal = (document.getElementById('map-search')?.value || '').toLowerCase();
    const schoolVal = (document.getElementById('school-filter')?.value || '').toLowerCase();

    allMarkers.forEach(marker => {
      const mosque = marker._mosque;
      const matchesSearch =
        (mosque.namn && mosque.namn.toLowerCase().includes(searchVal)) ||
        (mosque.beskrivning && mosque.beskrivning.toLowerCase().includes(searchVal));
      const mosqueSchool = getMosqueSchoolValue(mosque);

      const matchesSchool =
        !schoolVal ||
        schoolVal === "" ||
        schoolVal === "alla" ||
        mosqueSchool.includes(schoolVal);

      if (matchesSearch && matchesSchool) {
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });
  }

  // Eventlyssnare på sök och filter
  const searchInput = document.getElementById('map-search');
  if (searchInput) {
    searchInput.addEventListener('input', filterMarkers);
    // Sök direkt när man trycker Enter på tangentbordet
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        filterMarkers();
        const searchVal = searchInput.value.trim().toLowerCase();
        if (searchVal.length > 0) {
          // Hitta första matchade moské och centrera/öppna info
          const found = allMarkers.find(marker =>
            marker._mosque.namn && marker._mosque.namn.toLowerCase().includes(searchVal)
          );
          if (found) {
            map.setCenter(found.getPosition());
            map.setZoom(14); // Valfritt, zooma in lite extra
            google.maps.event.trigger(found, 'click');
          }
        }
      }
    });
  }
  document.getElementById('school-filter')?.addEventListener('change', filterMarkers);

  // Visa användarens position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const userLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      new google.maps.Marker({
        position: userLoc,
        map: map,
        title: "Du är här",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      });
      map.setCenter(userLoc);
    });
  }
};