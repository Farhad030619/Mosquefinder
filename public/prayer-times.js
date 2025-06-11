document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('prayer-cards');
    if (!container) return;

    // Hämta dagens bönetider för Al adhan API genom att ange longitude och latitude av Stockholms Moskeé
    const latitude = 59.3251172;
    const longitude = 18.0709935;
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];

    fetch(`https://api.aladhan.com/v1/timings/${dateString}?latitude=${latitude}&longitude=${longitude}&method=2`)
        .then(res => res.json())
        .then(data => {
            if (data.code !== 200) throw new Error("Kunde inte hämta bönetider.");
            const t = data.data.timings;

            // Endast dessa bönetider
            const prayers = [
                { name: "Fajr", time: t.Fajr, icon: "🌅", color: "bg-blue-100" },
                { name: "Dhuhr", time: t.Dhuhr, icon: "🌞", color: "bg-yellow-100" },
                { name: "Asr", time: t.Asr, icon: "🌤️", color: "bg-green-100" },
                { name: "Maghrib", time: t.Maghrib, icon: "🌇", color: "bg-orange-100" },
                { name: "Isha", time: t.Isha, icon: "🌙", color: "bg-indigo-100" }
            ];

            container.innerHTML = prayers.map(prayer => `
                <div class="rounded-lg shadow p-4 flex flex-col items-center ${prayer.color}">
                    <div class="text-3xl mb-2">${prayer.icon}</div>
                    <div class="text-lg font-bold">${prayer.name}</div>
                    <div class="text-xl text-blue-700 font-mono">${prayer.time}</div>
                </div>
            `).join('');
        })
        .catch(err => {
            container.innerHTML = '<div class="col-span-5 text-red-600">Kunde inte hämta bönetider.</div>';
            console.error(err);
        });
});