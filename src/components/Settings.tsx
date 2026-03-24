import type { CalculationMethod } from '../types';
import { Moon, Sun, ShieldCheck, Globe, CreditCard as Card } from 'lucide-react';

interface Props {
  method: CalculationMethod;
  setMethod: (method: CalculationMethod) => void;
}

const Settings = ({ method, setMethod }: Props) => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-1">Beräkningsmetod</h2>
        <div className="grid gap-3">
          {[
            { id: 'mwl', label: 'Sunni (Standard)', icon: Sun },
            { id: 'tehran', label: 'Shia (Tehran)', icon: Moon }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id as CalculationMethod)}
              className={`glass-card p-5 flex items-center justify-between transition-all ${
                method === m.id ? 'ring-2 ring-brand-primary bg-white' : 'hover:bg-white/50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${
                  method === m.id ? 'bg-brand-primary text-white' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  <m.icon size={20} />
                </div>
                <div>
                  <p className="font-black text-zinc-900">{m.label}</p>
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
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-1">Om appen</h2>
        <div className="glass-card p-6 space-y-4">
           <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe size={18} className="text-zinc-400" />
              <span className="text-sm font-bold text-zinc-600">Version</span>
            </div>
            <span className="text-xs font-black text-zinc-400">2.0.0 Bensinpris Edition</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Card size={18} className="text-zinc-400" />
            <span className="text-sm font-bold text-zinc-600">Utvecklare</span>
            </div>
            <span className="text-xs font-black text-zinc-400">Farhad Jelve</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Settings;
