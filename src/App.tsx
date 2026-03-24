import { useState, useEffect } from 'react';
import type { CalculationMethod } from './types';
import PrayerCard from './components/PrayerCard';
import MosqueList from './components/MosqueList';
import Settings from './components/Settings';
import { Home, Settings as SettingsIcon, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'mosques' | 'settings'>('home');
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<CalculationMethod>('mwl'); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-primary">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 animate-spin" />
          <span className="font-black tracking-widest uppercase text-xs">Mosquefinder</span>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'home', icon: Home, label: 'Hem' },
    { id: 'mosques', icon: MapPin, label: 'Moskéer' },
    { id: 'settings', icon: SettingsIcon, label: 'Inställningar' }
  ];

  return (
    <div className="relative min-h-screen bg-brand-bg selection:bg-brand-primary/20">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-10 pb-6 px-6 text-center"
      >
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
          Mosque<span className="text-brand-primary">finder</span>
        </h1>
        <p className="text-zinc-500 text-sm font-medium mt-1 uppercase tracking-widest">Sverige</p>
      </motion.header>

      <AnimatePresence mode="wait">
        <motion.main 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="max-w-md mx-auto p-5 pb-32"
        >
          {activeTab === 'home' && <PrayerCard method={method} />}
          {activeTab === 'mosques' && <MosqueList />}
          {activeTab === 'settings' && <Settings method={method} setMethod={setMethod} />}
        </motion.main>
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md bg-white/90 backdrop-blur-xl rounded-full shadow-2xl p-2 flex justify-around items-center z-50 border border-white/50">
        {navItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="relative flex-1 flex flex-col items-center py-3 rounded-full transition-all duration-300 group"
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="nav-bg"
                className="absolute inset-0 bg-brand-primary rounded-full shadow-brand"
              />
            )}
            <tab.icon 
              size={20} 
              className={`relative z-10 transition-colors duration-300 ${
                activeTab === tab.id ? 'text-white fill-white/10' : 'text-zinc-400 group-hover:text-zinc-600'
              }`} 
            />
            <span className={`relative z-10 text-[9px] font-black mt-1 uppercase tracking-wider transition-colors duration-300 ${
              activeTab === tab.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-600'
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
