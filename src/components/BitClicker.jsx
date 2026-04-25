// Preserved version of the simplified Bit Clicker for future use
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer2, TrendingUp, Zap, Trophy, Coins } from 'lucide-react';

export default function BitClicker({ onBitGain }) {
  const [cookies, setCookies] = useState(0);
  const [cps, setCps] = useState(0);
  const [clickValue, setClickValue] = useState(1);
  const [upgrades, setUpgrades] = useState([
    { id: 'cursor', name: 'Auto-Linker', basePrice: 15, baseCps: 0.1, owned: 0 },
    { id: 'grandma', name: 'Nexus Node', basePrice: 100, baseCps: 1, owned: 0 },
    { id: 'farm', name: 'Bit Farm', basePrice: 1100, baseCps: 8, owned: 0 },
    { id: 'factory', name: 'Data Factory', basePrice: 12000, baseCps: 47, owned: 0 },
  ]);

  const [floatingTexts, setFloatingTexts] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCookies(prev => prev + cps / 10);
    }, 100);
    return () => clearInterval(timer);
  }, [cps]);

  useEffect(() => {
    if (cookies > 0 && Math.floor(cookies / 1000) > Math.floor((cookies - cps/10) / 1000)) {
      onBitGain?.(10);
    }
  }, [cookies]);

  const handleLink = (e) => {
    setCookies(prev => prev + clickValue);
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, x: e.clientX, y: e.clientY, text: `+${clickValue}` }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  };

  const buyUpgrade = (upgrade) => {
    const price = Math.floor(upgrade.basePrice * Math.pow(1.15, upgrade.owned));
    if (cookies >= price) {
      setCookies(prev => prev - price);
      setUpgrades(prev => prev.map(u => u.id === upgrade.id ? { ...u, owned: u.owned + 1 } : u));
      setCps(prev => prev + upgrade.baseCps);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6 font-mono overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center relative bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
        <div className="absolute top-8 text-center z-10">
          <div className="text-5xl font-black italic text-white">{Math.floor(cookies).toLocaleString()} DATA</div>
          <div className="text-brand text-xs mt-2 uppercase tracking-widest">{cps.toFixed(1)} Bits/S</div>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={handleLink} className="w-64 h-64 bg-surface-soft border-2 border-brand/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,255,0,0.2)]">
          <Zap className="w-24 h-24 text-brand animate-pulse" />
        </motion.button>
      </div>
    </div>
  );
}
