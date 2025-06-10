const tabs = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t => t.classList.remove('active-tab', 'bg-blue-600', 'text-white'));
  tab.classList.add('active-tab', 'bg-blue-600', 'text-white');
  contents.forEach(c => c.classList.add('hidden'));
  document.getElementById(tab.id.replace('-tab','-content')).classList.remove('hidden');
}));