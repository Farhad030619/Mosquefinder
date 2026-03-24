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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as any || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--app-bg)] text-brand-primary">
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
    <div className="relative min-h-screen bg-[var(--app-bg)] text-[var(--text-main)] selection:bg-brand-primary/20 overflow-x-hidden">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-12 pb-8 px-6 flex justify-center"
      >
        <div className="glass-card px-8 py-4 inline-flex flex-col items-center">
          <h1 className="text-2xl font-black text-[var(--text-main)] tracking-tight">
            Mosque<span className="text-brand-primary">finder</span>
          </h1>
          <p className="text-[var(--text-muted)] text-[10px] font-black mt-1 uppercase tracking-[0.3em]">Sverige</p>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        <motion.main 
          key={activeTab}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="max-w-md mx-auto p-5 pb-32"
        >
          {activeTab === 'home' && <PrayerCard method={method} />}
          {activeTab === 'mosques' && <MosqueList />}
          {activeTab === 'settings' && (
            <Settings 
              method={method} 
              setMethod={setMethod} 
              theme={theme} 
              toggleTheme={toggleTheme} 
            />
          )}
        </motion.main>
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-md bg-[var(--card-bg)] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-2.5 flex justify-around items-center z-50 border border-[var(--card-border)]">
        {navItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="relative flex-1 flex flex-col items-center py-3.5 rounded-full transition-all duration-500 group"
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="nav-pill"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className="absolute inset-0 bg-brand-primary rounded-[2rem] shadow-brand"
              />
            )}
            <tab.icon 
              size={18} 
              className={`relative z-10 transition-colors duration-500 ${
                activeTab === tab.id ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
              }`} 
            />
            <span className={`relative z-10 text-[8px] font-black mt-1.5 uppercase tracking-widest transition-colors duration-500 ${
              activeTab === tab.id ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
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
