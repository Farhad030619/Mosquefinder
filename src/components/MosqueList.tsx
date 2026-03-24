import { useState, useEffect } from 'react';
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

  // Calculate distance in km
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
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
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
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

  const filteredAndSortedMosques = mosques
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
      return a.namn.localeCompare(b.namn); // Fallback to alpha
    });

  const openInMaps = (mosque: Mosque) => {
    const query = encodeURIComponent(`${mosque.namn} ${mosque.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    // ... same as before ...
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
    <div className="flex flex-col items-center justify-center py-20 text-zinc-300">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <MapPin size={32} className="opacity-20" />
      </motion.div>
      <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Hämtar moskéer...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Sök moské eller stad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-14"
          />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-zinc-200 active:scale-95"
        >
          <Plus size={16} />
          Föreslå ny moské
        </button>
      </div>

      <div className="grid gap-4">
        {filteredAndSortedMosques.map((mosque, idx) => (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.03 }}
            key={mosque.id || mosque.namn}
            onClick={() => openInMaps(mosque)}
            className="glass-card p-5 group hover:bg-white transition-all cursor-pointer flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-start space-x-4">
              <div className="mt-1 p-3 bg-brand-primary/10 rounded-2xl text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors shrink-0">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-zinc-900 leading-tight group-hover:text-brand-primary transition-colors truncate">{mosque.namn}</h3>
                </div>
                <p className="text-sm font-medium text-zinc-500 mt-0.5 truncate">{mosque.address}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    mosque.rattsskola === 'shia' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {mosque.rattsskola || 'Sunni'}
                  </span>
                  {mosque.distance !== null && (
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                      ~{mosque.distance.toFixed(1)} km
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center bg-zinc-50 group-hover:bg-brand-primary/5 p-3 rounded-2xl transition-colors">
              <ChevronRight size={18} className="text-zinc-300 group-hover:text-brand-primary transition-all group-hover:translate-x-1" />
              <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Karta</span>
            </div>
          </motion.div>
        ))}

        {filteredAndSortedMosques.length === 0 && (
          <div className="text-center py-20">
            <Info className="mx-auto text-zinc-300 mb-4" size={40} />
            <p className="font-bold text-zinc-400">Inga moskéer hittades</p>
          </div>
        )}
      </div>

      {/* Suggestion Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 pb-24">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              {submitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900">Tack!</h2>
                  <p className="text-zinc-500 font-medium">Ditt förslag har skickats och kommer granskas i Firebase.</p>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <h2 className="text-2xl font-black text-zinc-900 mb-6">Föreslå moské</h2>
                  <form onSubmit={handleSubmitSuggestion} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Namn på moskén</label>
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Adress</label>
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Inriktning</label>
                      <div className="flex gap-2">
                        {['sunni', 'shia'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({...formData, rattsskola: type as any})}
                            className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${
                              formData.rattsskola === type 
                                ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand/30' 
                                : 'bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-zinc-800 transition-all mt-4 active:scale-95"
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
