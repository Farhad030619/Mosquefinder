window.initMap = function () {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;
  const defaultCenter = { lat: 59.3293, lng: 18.0686 }; // Stockholm
  const map = new google.maps.Map(mapDiv, {
      zoom: 11,
      center: defaultCenter,
      mapTypeId: "roadmap"
  });

  fetch('/moskeer.json')
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
                  const infoWindow = new google.maps.InfoWindow({
                      content: `<b>${mosque.namn}</b><br>${mosque.entrance || ""}<br>${mosque.beskrivning || ""}`
                  });
                  marker.addListener('click', () => infoWindow.open(map, marker));
              }
          });
      })
      .catch(err => {
          console.error("Fel vid laddning av moskeer.json:", err);
      });

  // Visa användarens plats
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