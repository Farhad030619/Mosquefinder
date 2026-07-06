import { useState, useEffect } from 'react';
import type { PrayerTimes, CalculationMethod } from '../types';
import { Clock, Sun, Moon, Sunrise, Sunset, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  method: CalculationMethod;
}

const PrayerCard = ({ method }: Props) => {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const aladhanMethod = method === 'tehran' ? 7 : 3; // 7 = Tehran, 3 = MWL
        // Use relative path for same-origin proxy in production, and direct Aladhan API for local development
        const url = import.meta.env.DEV
          ? `https://api.aladhan.com/v1/timingsByCity?city=Stockholm&country=Sweden&method=${aladhanMethod}`
          : `/api/timings?city=Stockholm&country=Sweden&method=${aladhanMethod}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Misslyckades att hämta tider (${response.status})`);
        }
        const data = await response.json();
        if (!data || !data.data || !data.data.timings) {
          throw new Error('Ogiltigt svar från servern');
        }
        setTimes(data.data.timings);
      } catch (err: any) {
        console.error("Error fetching prayer times:", err);
        setError(err.message || 'Ett fel uppstod när bönetiderna hämtades.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, [method, retryCount]);

  if (loading) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Hämtar tider...</p>
      </div>
    );
  }

  if (error || !times) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-1">
          <Clock size={24} />
        </div>
        <h3 className="font-black text-sm text-[var(--text-main)] uppercase tracking-wider">Kunde inte hämta tider</h3>
        <p className="text-xs font-medium text-[var(--text-muted)] max-w-[260px] leading-relaxed">
          Det gick inte att ladda bönetiderna. Kontrollera din anslutning eller stäng av eventuella adblockers.
        </p>
        <button 
          onClick={() => setRetryCount(prev => prev + 1)}
          className="mt-2 px-5 py-2.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full active:scale-95 hover:bg-brand-primary/95 transition-all shadow-md shadow-brand/20"
        >
          Försök igen
        </button>
      </div>
    );
  }

  const prayers = [
    { name: 'Fajr', time: times.Fajr, icon: Sunrise },
    { name: 'Sunrise', time: times.Sunrise, icon: Sun },
    { name: 'Dhuhr', time: times.Dhuhr, icon: Clock },
    { name: 'Asr', time: times.Asr, icon: Wind },
    { name: 'Maghrib', time: times.Maghrib, icon: Sunset },
    { name: 'Isha', time: times.Isha, icon: Moon },
  ];

  const getNextPrayer = () => {
    if (!times) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayerList = [
      { name: 'Fajr', time: times.Fajr },
      { name: 'Sunrise', time: times.Sunrise },
      { name: 'Dhuhr', time: times.Dhuhr },
      { name: 'Asr', time: times.Asr },
      { name: 'Maghrib', time: times.Maghrib },
      { name: 'Isha', time: times.Isha },
    ];

    for (const prayer of prayerList) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (prayerMinutes > currentMinutes) {
        return prayer;
      }
    }

    // If all prayers today have passed, the next one is Fajr tomorrow
    return prayerList[0];
  };

  const nextPrayer = getNextPrayer();

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-8 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 text-[var(--text-main)]">
          <Moon size={120} />
        </div>
        <h2 className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Nästa bön</h2>
        <p className="text-5xl font-black text-[var(--text-main)] mb-1">{nextPrayer?.name || '---'}</p>
        <p className="text-brand-primary font-black text-xl">{nextPrayer?.time || '--:--'}</p>
      </motion.div>

      <div className="grid gap-3">
        {prayers.map((prayer, idx) => (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={prayer.name}
            className="glass-card px-6 py-5 flex items-center justify-between group transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                <prayer.icon size={18} />
              </div>
              <span className="font-bold text-[var(--text-main)] text-sm">{prayer.name}</span>
            </div>
            <span className="font-black text-[var(--text-main)] text-sm">{prayer.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PrayerCard;
