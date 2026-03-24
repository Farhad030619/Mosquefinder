import type { CalculationMethod } from '../types';
import { Moon, Sun, ShieldCheck, CreditCard as Card } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  method: CalculationMethod;
  setMethod: (method: CalculationMethod) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Settings = ({ method, setMethod, theme, toggleTheme }: Props) => {
  return (
    <div className="space-y-8 pb-10">
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4 ml-1">Utseende</h2>
        <button
          onClick={toggleTheme}
          className="glass-card w-full p-5 flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-brand-primary text-white shadow-brand">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <div>
              <p className="font-black text-[var(--text-main)]">{theme === 'light' ? 'Ljust läge' : 'Mörkt läge'}</p>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-0.5">Växla tema</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full relative p-1 transition-colors">
             <motion.div 
              animate={{ x: theme === 'light' ? 0 : 24 }}
              className="w-4 h-4 bg-white rounded-full shadow-sm"
             />
          </div>
        </button>
      </section>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4 ml-1">Beräkningsmetod</h2>
        <div className="grid gap-3">
          {[
            { id: 'mwl', label: 'Sunni (Standard)', icon: Sun },
            { id: 'tehran', label: 'Shia (Tehran)', icon: Moon }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id as CalculationMethod)}
              className={`glass-card p-5 flex items-center justify-between transition-all ${
                method === m.id ? 'ring-2 ring-brand-primary' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${
                  method === m.id ? 'bg-brand-primary text-white shadow-brand' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                }`}>
                  <m.icon size={20} />
                </div>
                <div>
                  <p className="font-black text-[var(--text-main)]">{m.label}</p>
                </div>
              </div>
              {method === m.id && (
                <ShieldCheck className="text-brand-primary" size={20} />
              )}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4 ml-1">Om appen</h2>
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Card size={18} className="text-[var(--text-muted)]" />
              <span className="text-sm font-bold text-[var(--text-muted)]">Utvecklare</span>
            </div>
            <span className="text-xs font-black text-[var(--text-main)]">Farhad Jelve</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
