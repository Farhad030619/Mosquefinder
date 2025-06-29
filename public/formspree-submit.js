document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mosque-form');
    if(form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                const msgBox = document.getElementById('mosque-form-message');
                if (response.ok) {
                    form.reset();
                    msgBox.textContent = "Tack! Ditt förslag har skickats.";
                    msgBox.classList.remove('hidden','text-red-600');
                    msgBox.classList.add('text-green-600');
                } else {
                    msgBox.textContent = "Något gick fel. Försök igen!";
                    msgBox.classList.remove('hidden','text-green-600');
                    msgBox.classList.add('text-red-600');
                }
                setTimeout(() => { msgBox.classList.add('hidden'); }, 5000);
            } catch (err) {
                const msgBox = document.getElementById('mosque-form-message');
                msgBox.textContent = "Något gick fel. Försök igen!";
                msgBox.classList.remove('hidden','text-green-600');
                msgBox.classList.add('text-red-600');
                setTimeout(() => { msgBox.classList.add('hidden'); }, 5000);
            }
        });
    }
    
});