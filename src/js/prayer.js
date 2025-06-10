import { PRAYER_API_URL } from '../config.js';
async function loadPrayerTimes(lat, lng) {
  const res = await fetch(`${PRAYER_API_URL}?latitude=${lat}&longitude=${lng}&method=2`);
  const data = await res.json();
  const times = data.data.timings;
  document.querySelectorAll('#prayer-times div').forEach(box => {
    const name = box.querySelector('div:first-child').textContent;
    box.querySelector('div:nth-child(2)').textContent = times[name];
  });
}
navigator.geolocation.getCurrentPosition(
  pos => loadPrayerTimes(pos.coords.latitude, pos.coords.longitude),
  () => alert('Kunde inte hämta din position. Manuell sökning krävs.')
);