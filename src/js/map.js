window.initMap = function () {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;
  const defaultCenter = { lat: 59.3293, lng: 18.0686 };
  const map = new google.maps.Map(mapDiv, {
    zoom: 11,
    center: defaultCenter
  });

  fetch('moskeer.json')
    .then(res => {
      if (!res.ok) throw new Error("Kunde inte ladda moskeer.json!");
      return res.json();
    })
    .then(mosques => {
      mosques.forEach(mosque => {
        if (typeof mosque.lat === "number" && typeof mosque.lng === "number") {
          const marker = new google.maps.Marker({
            position: { lat: mosque.lat, lng: mosque.lng },
            map,
            title: mosque.namn,
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          });
      
          // Skapa infofönster med moské-info
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3 style="margin:0;font-size:1.1em;">${mosque.namn || 'Okänd moské'}</h3>
                <div>${mosque.entrance || ''}</div>
                <div style="font-size:.9em;color:#444;">${mosque.beskrivning || ''}</div>
              </div>
            `
          });
      
          // Klick-händelse på markören
          marker.addListener('click', function() {
            infoWindow.open(map, marker);
          });
        }
      });
    })
    .catch(err => {
      alert("Fel vid laddning av moskeer.json!");
      console.error(err);
    });

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