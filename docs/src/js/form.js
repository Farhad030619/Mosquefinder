const form = document.getElementById('mosque-submission-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  alert('Tack för din inskickning! Vi återkommer snart.');
  form.reset();
});