function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }
  const input = document.getElementById('search-mosque');
  input.addEventListener('input', debounce(e => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.mosque-card').forEach(card => {
      card.style.display = card.querySelector('h3').textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  }));