import { MAP_API_KEY } from '../config.js';
window.initMap = (lat = 59.3293, lng = 18.0686) => {
  const map = new google.maps.Map(document.getElementById('map'), { center: { lat, lng }, zoom: 12 });
  new google.maps.Marker({ position: { lat, lng }, map });
};
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&callback=initMap`;
script.defer = true;
document.head.appendChild(script);