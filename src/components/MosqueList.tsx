import { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import type { Mosque } from '../types';
import { Search, MapPin, ChevronRight, Info, Plus, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MosqueList = () => {
  const [search, setSearch] = useState('');
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    namn: '',
    address: '',
    rattsskola: 'sunni' as 'sunni' | 'shia',
    beskrivning: ''
  });

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => console.error("Error getting location:", error)
      );
    }

    const fetchMosques = async () => {
      try {
        if (!db) return;
        const q = query(collection(db, 'mosques'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mosque));
        setMosques(data);
      } catch (e) {
        console.error("Error fetching mosques:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMosques();
  }, []);

  const filteredAndSortedMosques = useMemo(() => {
    return mosques
      .map(m => {
        const distance = (userLocation && m.lat && m.lng) 
          ? getDistance(userLocation.lat, userLocation.lng, m.lat, m.lng)
          : null;
        return { ...m, distance };
      })
      .filter(m => 
        m.namn.toLowerCase().includes(search.toLowerCase()) || 
        m.address.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
        if (a.distance !== null) return -1;
        if (b.distance !== null) return 1;
        return a.namn.localeCompare(b.namn);
      });
  }, [mosques, search, userLocation]);

  const openInMaps = (mosque: Mosque) => {
    const query = encodeURIComponent(`${mosque.namn} ${mosque.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!db) return;
      await addDoc(collection(db, 'suggestions'), formData);
      setSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitted(false);
        setFormData({ namn: '', address: '', rattsskola: 'sunni', beskrivning: '' });
      }, 2000);
    } catch (e) {
      console.error("Error submitting suggestion:", e);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
      <motion.div animate={{ rotate: 360, scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <MapPin size={32} className="text-brand-primary" />
      </motion.div>
      <p className="mt-4 font-black uppercase tracking-[0.3em] text-[10px]">Laddar moskéer...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-brand-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Sök moské eller stad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-14 font-black text-sm !rounded-[2rem] shadow-sm"
          />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-4.5 bg-brand-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-lg shadow-brand/20"
        >
          <Plus size={14} />
          Föreslå ny moské
        </button>
      </div>

      <div className="grid gap-4">
        {filteredAndSortedMosques.map((mosque, idx) => (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05, type: "spring", stiffness: 200, damping: 20 }}
            key={mosque.id || mosque.namn}
            onClick={() => openInMaps(mosque)}
            className="glass-card p-5 group transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-4 min-w-0 flex-1">
              <div className="mt-1 p-3 bg-brand-primary/10 rounded-2xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-black text-[var(--text-main)] leading-tight group-hover:text-brand-primary transition-colors text-sm break-words">{mosque.namn}</h3>
                <p className="text-xs font-bold text-[var(--text-muted)] mt-1 break-words">{mosque.address}</p>
                <div className="flex flex-wrap items-center mt-2.5 gap-2">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    mosque.rattsskola === 'shia' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-brand-primary/10 text-brand-primary'
                  }`}>
                    {mosque.rattsskola || 'Sunni'}
                  </span>
                  {mosque.distance !== null && (
                    <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-zinc-500/10 text-[var(--text-muted)]">
                      ~{mosque.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-zinc-500/5 group-hover:bg-brand-primary/10 p-3 rounded-2xl transition-colors shrink-0">
              <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-brand-primary transition-all group-hover:translate-x-1" />
            </div>
          </motion.div>
        ))}

        {filteredAndSortedMosques.length === 0 && !loading && (
          <div className="text-center py-20 bg-zinc-500/5 rounded-[2.5rem] border border-dashed border-[var(--card-border)]">
            <Info className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" size={48} />
            <p className="font-black uppercase tracking-widest text-[10px] text-[var(--text-muted)]">Inga moskéer hittades</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 pb-32">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-sm bg-[var(--app-bg)] border border-[var(--card-border)] rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-[var(--text-main)]">Tack!</h2>
                  <p className="text-[var(--text-muted)] font-medium">Ditt förslag har skickats och kommer granskas i Firebase.</p>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <h2 className="text-2xl font-black text-[var(--text-main)] mb-6">Föreslå moské</h2>
                  <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Namn på moskén</label>
                      <input 
                        required
                        type="text" 
                        value={formData.namn}
                        onChange={(e) => setFormData({...formData, namn: e.target.value})}
                        className="input-field" 
                        placeholder="t.ex. Stockholms Moské" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Adress</label>
                      <input 
                        required
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="input-field" 
                        placeholder="Gata, Stad" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Inriktning</label>
                      <div className="flex gap-2">
                        {['sunni', 'shia'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({...formData, rattsskola: type as 'sunni' | 'shia'})}
                            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${
                              formData.rattsskola === type 
                                ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand/30' 
                                : 'bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--card-border)] hover:border-brand-primary/30'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-[var(--text-main)] text-[var(--app-bg)] py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-brand-primary transition-all mt-4 active:scale-95"
                    >
                      Skicka förslag
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MosqueList;
