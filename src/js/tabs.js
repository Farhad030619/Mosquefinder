const tabs = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active-tab'));
  tab.classList.add('active-tab');
  contents.forEach(c => c.classList.add('hidden'));
  document.getElementById(tab.id.replace('-tab','-content')).classList.remove('hidden');
}));