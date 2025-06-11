document.addEventListener('DOMContentLoaded', function() {
    const mosqueList = document.getElementById('mosque-list');
    if (!mosqueList) return;
  
    fetch('moskeer.json')
      .then(res => res.json())
      .then(mosques => {
        mosqueList.innerHTML = '';
        mosques.forEach(mosque => {
          const div = document.createElement('div');
          div.className = 'mosque-card';
          div.innerHTML = `
            <h3>${mosque.namn || 'Okänd moské'}</h3>
            <div><b>Adress:</b> ${mosque.entrance || ''}</div>
            <div><b>Info:</b> ${mosque.beskrivning || ''}</div>
          `;
          mosqueList.appendChild(div);
        });
      })
      .catch(err => {
        mosqueList.innerHTML = '<div style="color:red">Kunde inte ladda moskéer!</div>';
        console.error(err);
      });
  });