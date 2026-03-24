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

  useEffect(() => {
    const fetchTimes = async () => {
      setLoading(true);
      try {
        const aladhanMethod = method === 'tehran' ? 7 : 3; // 7 = Tehran, 3 = MWL
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=Stockholm&country=Sweden&method=${aladhanMethod}`
        );
        const data = await response.json();
        setTimes(data.data.timings);
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimes();
  }, [method]);

  if (loading || !times) {
    return (
      <div className="glass-card p-10 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Hämtar tider...</p>
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
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Moon size={120} />
        </div>
        <h2 className="text-zinc-400 text-xs font-black uppercase tracking-[0.2em] mb-2">Nästa bön</h2>
        <p className="text-5xl font-black text-zinc-900 mb-1">{nextPrayer?.name || '---'}</p>
        <p className="text-brand-primary font-bold text-xl">{nextPrayer?.time || '--:--'}</p>
      </motion.div>

      <div className="grid gap-3">
        {prayers.map((prayer, idx) => (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={prayer.name}
            className="glass-card px-6 py-4 flex items-center justify-between group hover:bg-white transition-all cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-brand-primary/10 rounded-2xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <prayer.icon size={20} />
              </div>
              <span className="font-bold text-zinc-700">{prayer.name}</span>
            </div>
            <span className="font-black text-zinc-900">{prayer.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PrayerCard;
