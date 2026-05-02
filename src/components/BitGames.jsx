import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Coins, 
  Dices, 
  RotateCcw, 
  ChevronLeft,
  Zap,
  Activity
} from 'lucide-react';

// --- Sub-Game: Binary Loop (Red/Black) ---
const BinaryLoop = ({ bits, setBits, onExit }) => {
  const [bet, setBet] = useState(10);
  const [lastResult, setLastResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [streak, setStreak] = useState(0);

  const play = (choice) => {
    const wager = Math.min(bits, Math.max(10, bet));
    if (bits < wager || isSpinning) return;
    
    setBits(prev => prev - wager);
    setIsSpinning(true);
    setLastResult(null);
    
    setTimeout(() => {
      // 51% house edge (0.49 probability for player)
      const result = Math.random() > 0.51 ? 'red' : 'black';
      setIsSpinning(false);
      setLastResult(result);
      
      if (result === choice) {
        setBits(prev => prev + Math.floor(wager * 1.98));
        setStreak(prev => prev + 1);
      } else {
        setStreak(0);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-[#050000] text-white p-6 md:p-10">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-10 border-b border-red-500/20 pb-6">
        <button 
          onClick={onExit} 
          className="group flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/40 hover:text-red-500 hover:border-red-500/40 transition-all"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono font-black uppercase tracking-[0.2em]">BACK</span>
        </button>
        <div className="text-center group">
          <h2 className="text-4xl font-black italic text-red-500 tracking-tighter">BINARY_P6</h2>
        </div>
        <div className="flex flex-col items-end">
           <div className="text-2xl text-brand font-mono font-black tracking-tighter">{bits.toLocaleString()} Bits</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-16 relative">
        {/* Roulette Wheel */}
        <div className="relative w-80 h-80">
           <motion.div 
             animate={isSpinning ? { rotate: 360 * 5 } : { rotate: lastResult === 'red' ? 0 : 180 }}
             transition={isSpinning ? { duration: 0.8, ease: "linear", repeat: Infinity } : { duration: 1, type: "spring" }}
             className="w-full h-full rounded-full border-[12px] border-white/[0.05] flex items-center justify-center overflow-hidden shadow-2xl"
           >
              <div className="w-1/2 h-full bg-red-600/60" />
              <div className="w-1/2 h-full bg-zinc-900" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-black border-4 border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                    <RotateCcw className={`w-10 h-10 text-brand ${isSpinning ? 'animate-spin' : ''}`} />
                 </div>
              </div>
           </motion.div>
           
           <AnimatePresence>
             {lastResult && !isSpinning && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.5, y: -20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 className={`absolute -top-16 left-1/2 -translate-x-1/2 px-8 py-3 rounded-sm font-black uppercase text-xl border ${lastResult === 'red' ? 'bg-red-500 border-red-400 text-white' : 'bg-white border-zinc-200 text-black'}`}
               >
                  {lastResult}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-10">
           <div className="flex gap-8">
              <button 
                onClick={() => play('red')}
                disabled={isSpinning}
                className="w-48 py-20 bg-red-500/10 border-2 border-red-500/20 hover:border-red-500 active:scale-95 transition-all rounded-3xl flex flex-col items-center gap-3 group relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                 <span className="text-4xl font-black italic text-red-500 group-hover:scale-110 transition-transform relative z-10">RED</span>
                 <span className="text-[11px] font-mono text-red-500/60 uppercase tracking-[0.3em] relative z-10">WIN_1.98X</span>
              </button>
              <button 
                onClick={() => play('black')}
                disabled={isSpinning}
                className="w-48 py-20 bg-white/[0.03] border-2 border-white/10 hover:border-white active:scale-95 transition-all rounded-3xl flex flex-col items-center gap-3 group relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
                 <span className="text-4xl font-black italic text-white group-hover:scale-110 transition-transform relative z-10">BLACK</span>
                 <span className="text-[11px] font-mono text-white/60 uppercase tracking-[0.3em] relative z-10">WIN_1.98X</span>
              </button>
           </div>

           <div className="flex items-center gap-10 bg-white/[0.04] p-8 rounded-[3rem] border-2 border-white/10 shadow-2xl max-w-lg w-full">
              <button 
                onClick={() => setBet(b => Math.max(10, b - 50))}
                className="w-14 h-14 flex items-center justify-center text-white/20 hover:text-red-500 border-2 border-white/10 rounded-2xl transition-all font-black text-2xl"
              > - </button>
              <div className="text-center flex-1">
                 <div className="flex items-center justify-center gap-2">
                    <span className="text-red-500 font-mono text-xl">$</span>
                    <input 
                      type="number"
                      value={bet}
                      onChange={(e) => setBet(Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-transparent text-red-500 font-black text-5xl italic text-center outline-none w-full tracking-tighter"
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Bit Lounge Container ---
export default function BitGames({ bits, setBits, onClose }) {
  const [activeGame, setActiveGame] = useState(null);

  const claimFaucet = () => {
    if (bits < 10) {
      setBits(100);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex flex-col bg-[#050505] font-sans text-white overflow-hidden">
       {/* Background Grid */}
       <div className="absolute inset-0 tech-grid-pattern opacity-10" />
       <div className="absolute top-0 left-0 w-full h-[1px] bg-brand/30" />
       
       <AnimatePresence mode="wait">
         {!activeGame ? (
           <motion.div 
             key="hub"
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, scale: 1.05 }}
             className="flex-1 flex flex-col relative z-20"
           >
              {/* Hub Header */}
              <div className="h-24 flex items-center justify-between px-12 bg-black/80 backdrop-blur-md border-b border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand/5 border border-brand/20 rounded-xl">
                       <RotateCcw className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                       <h1 className="text-2xl font-black uppercase tracking-tighter italic">LOUNGE</h1>
                    </div>
                 </div>

                 <div className="flex items-center gap-8">
                    <button 
                      onClick={() => setBits(prev => prev + 1000)}
                      className="hidden sm:block text-[9px] text-brand/40 border border-brand/20 px-4 py-1.5 rounded hover:bg-brand/10 transition-all uppercase tracking-widest"
                    >
                      +1000BITS
                    </button>
                    <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full shadow-inner">
                       <Coins className="w-4 h-4 text-brand" />
                       <span className="text-xs font-mono font-bold tracking-widest">{bits.toLocaleString()} BITS</span>
                    </div>
                    <button 
                      onClick={onClose}
                      className="group flex items-center gap-3 px-5 py-2.5 bg-brand text-black rounded-lg hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] transition-all font-black uppercase text-[10px] tracking-widest"
                    >
                      <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      QUIT
                    </button>
                 </div>
              </div>

              {/* Game Selection */}
              <div className="flex-1 max-w-4xl mx-auto w-full p-12 flex flex-col items-center justify-center gap-12">
                 <div className="text-center mb-8">
                    <h2 className="text-6xl font-black italic text-white/90 tracking-tighter mb-4">GAMES</h2>
                 </div>

                 <motion.div 
                   whileHover={{ scale: 1.05, y: -10 }}
                   onClick={() => setActiveGame('binary-loop')}
                   className="group w-full max-w-2xl bento-card p-16 bg-[#0a0a0a] border-2 border-red-500/10 hover:border-red-500/40 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
                 >
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative mb-10">
                       <RotateCcw className="w-24 h-24 text-red-500 group-hover:rotate-180 transition-transform duration-1000" />
                    </div>
                    <h3 className="text-6xl font-black italic uppercase mb-10 tracking-tighter text-white">Binary Loop</h3>
                    <div className="w-full h-[1px] bg-white/5 mb-10" />
                    <div className="flex items-center gap-12 text-center">
                        <div className="font-mono text-red-500 font-bold text-4xl tracking-tighter">1.98X</div>
                    </div>
                 </motion.div>
              </div>

              {/* Faucet Footer */}
              <div className="p-12 flex flex-col items-center gap-4">
                 <AnimatePresence>
                   {bits < 10 && (
                     <motion.button
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       onClick={claimFaucet}
                       className="flex items-center gap-3 px-10 py-4 bg-brand text-black font-black uppercase text-sm tracking-widest rounded-xl hover:shadow-[0_0_40px_rgba(0,255,0,0.5)] transition-all animate-bounce"
                     >
                       <Zap className="w-5 h-5 fill-black" />
                       GET BITS (+100)
                     </motion.button>
                   )}
                 </AnimatePresence>
                 <div className="text-[10px] font-mono text-white/10 uppercase tracking-[0.5em] mt-4 flex items-center gap-6">
                    <span>© 2026 MICROWAVE SYSTEMS</span>
                 </div>
              </div>
           </motion.div>
         ) : (
           <motion.div 
             key="game-container"
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             className="flex-1"
           >
              <BinaryLoop 
                bits={bits} 
                setBits={setBits} 
                onExit={() => setActiveGame(null)} 
              />
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
