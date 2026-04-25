import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Gamepad2, 
  X, 
  ArrowRight, 
  Filter, 
  TrendingUp, 
  LayoutGrid,
  ChevronLeft,
  Terminal,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import gamesData from './data/games.json';

interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnail: string;
  isFeatured?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const CATEGORIES = ['All', 'Arcade', 'Puzzle', 'Strategy', 'Retro', 'Action'];

export default function App() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Enhance game data with layout properties for bento effect
  const displayGames = useMemo(() => {
    return (gamesData as Game[]).map((game, index) => ({
      ...game,
      // Assign sizes for bento effect based on ID or index
      size: (index === 0 || index === 5) ? 'large' : (index % 3 === 1 ? 'medium' : 'small')
    }));
  }, []);

  const filteredGames = useMemo(() => {
    return displayGames.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [displayGames, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-brand selection:text-black antialiased">
      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-brand/20 blur-lg rounded-full group-hover:bg-brand/40 transition-colors" />
              <div className="relative w-8 h-8 bg-surface-soft border border-brand/30 flex items-center justify-center rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
                <Gamepad2 className="w-5 h-5 text-brand" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">NEXUS</h1>
              <div className="tech-label opacity-60">GS01//PORTAL</div>
            </div>
          </div>

          <div className="flex-1 max-w-2xl relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="QUICK_ACCESS_COMMAND..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full px-12 py-2.5 text-sm font-mono focus:outline-none focus:border-brand/40 focus:bg-white/[0.05] transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] transition-colors relative">
               <Activity className="w-4 h-4 text-white/60" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-brand rounded-full border-2 border-surface" />
            </button>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <div className="hidden lg:block">
              <div className="text-[10px] font-mono text-white/30 text-right uppercase tracking-[0.15em] mb-0.5">LATENCY</div>
              <div className="text-xs font-mono font-bold text-brand">12MS_STABLE</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Featured Bento Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16">
          <div className="lg:col-span-8 bento-card p-10 flex flex-col justify-end min-h-[400px] border-brand/20 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-6 tech-label opacity-20 group-hover:opacity-100 transition-opacity">
                X: 42.091 // Y: 12.885
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent pointer-events-none" />
             <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200')] bg-cover bg-center grayscale scale-110 group-hover:scale-100 transition-transform duration-1000" />
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-2 py-0.5 bg-brand text-black text-[10px] font-mono font-black uppercase tracking-widest rounded-sm">LIVE_NOW</span>
                  <span className="tech-label opacity-50">STATION_OS_4.2.1</span>
                </div>
                <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-8">
                  THE NEXT <br />
                  <span className="text-brand italic">EVOLUTION.</span>
                </h2>
                <p className="text-white/50 text-lg max-w-xl font-medium mb-8 leading-relaxed">
                  Experience zero-lag performance with our new cloud-streamed game architecture. 
                  Access thousands of titles directly through the interface.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-3.5 bg-brand text-black font-black uppercase text-xs tracking-[0.1em] rounded-full hover:shadow-[0_0_20px_rgba(0,255,0,0.4)] transition-all flex items-center gap-2">
                    INITIATE PORTAL <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="px-8 py-3.5 border border-white/20 hover:border-white/40 text-white font-black uppercase text-xs tracking-[0.1em] rounded-full transition-all flex items-center gap-2">
                    VIEW_CHANGELOG
                  </button>
                </div>
             </div>
          </div>
          
          <div className="lg:col-span-4 grid gap-4">
            <div className="bento-card p-8 bg-brand/5 border-brand/10">
               <Cpu className="w-6 h-6 text-brand mb-6" />
               <h3 className="font-display text-2xl font-bold mb-2 uppercase tracking-tight">ENGINE_Z</h3>
               <p className="text-sm text-white/40 font-mono">Optimized for low-end hardware without sacrificing visual fidelity.</p>
               <div className="mt-8 flex items-end justify-between">
                  {Array.from({length: 8}).map((_, i) => (
                    <div key={i} className="w-1 bg-brand/30 rounded-t-sm" style={{ height: `${Math.random() * 40 + 10}px` }} />
                  ))}
               </div>
            </div>
            <div className="bento-card p-8 group">
               <div className="flex justify-between items-start mb-6">
                 <Terminal className="w-6 h-6 text-white/60" />
                 <span className="tech-label opacity-40 group-hover:text-brand transition-colors">99.9%_UP</span>
               </div>
               <h3 className="font-display text-xl font-bold mb-2 uppercase tracking-tight">ENCRYPTED_LINK</h3>
               <p className="text-xs text-white/40 uppercase tracking-widest font-mono">SECURE TUNNEL ACTIVE</p>
               <div className="absolute bottom-0 right-0 p-4 opacity-5 translate-x-4 translate-y-4">
                  <Gamepad2 className="w-24 h-24" />
               </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-white/[0.05] pb-8">
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/10 rounded-xl overflow-x-auto no-scrollbar max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 text-xs font-mono uppercase tracking-[0.1em] rounded-lg transition-all ${
                  activeCategory === cat 
                    ? 'bg-brand text-black font-black' 
                    : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 tech-label">
             <div className="flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>GRID: DENSE</span>
             </div>
             <div className="w-1 h-1 bg-white/20 rounded-full" />
             <span>ITEMS: {filteredGames.length}</span>
          </div>
        </div>

        {/* Bento Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[160px]">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, idx) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedGame(game)}
                className={`
                  group bento-card cursor-pointer
                  ${game.size === 'large' ? 'col-span-2 row-span-2' : ''}
                  ${game.size === 'medium' ? 'col-span-2 row-span-1' : ''}
                  ${game.size === 'small' ? 'col-span-1 row-span-1' : ''}
                `}
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={game.thumbnail} 
                    alt={game.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                </div>
                
                <div className="relative z-10 h-full p-5 flex flex-col justify-end">
                  <div className="mb-auto flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-surface/80 border border-white/10 flex items-center justify-center backdrop-blur-md">
                       <Layers className="w-3.5 h-3.5 text-white/60" />
                    </div>
                    <div className="tech-label text-[8px] bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm">
                       ID_{game.id.slice(0, 4)}
                    </div>
                  </div>

                  <div>
                    <div className="tech-label text-[8px] text-brand mb-1 group-hover:translate-x-1 transition-transform">
                      {game.category}
                    </div>
                    <h3 className={`font-display font-bold uppercase tracking-tight group-hover:text-brand transition-colors leading-tight ${
                      game.size === 'large' ? 'text-2xl' : 'text-sm'
                    }`}>
                      {game.title}
                    </h3>
                  </div>
                </div>

                {/* Hover Geometric Detail */}
                <div className="absolute inset-0 border-2 border-brand/0 group-hover:border-brand/30 transition-all pointer-events-none rounded-2xl">
                   <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-brand opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 bento-card bg-transparent border-dashed">
            <div className="p-4 bg-white/5 rounded-full mb-6">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-40">Zero results in local buffer</p>
          </div>
        )}
      </main>

      {/* Footer System Info */}
      <footer className="mt-20 border-t border-white/[0.05] bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
               <div className="col-span-2">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-brand/10 border border-brand/20 flex items-center justify-center rounded-lg">
                      <Gamepad2 className="w-4 h-4 text-brand" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight">NEXUS_OS</span>
                  </div>
                  <p className="text-white/30 text-xs font-mono uppercase tracking-widest leading-relaxed">
                    A decentralized hub for secure interactive entertainment. <br />
                    Powered by high-frequency architecture.
                  </p>
               </div>
               {['Explore', 'Infrastructure', 'Security', 'Hardware'].map((title) => (
                 <div key={title}>
                    <h4 className="tech-label mb-6">{title}</h4>
                    <ul className="space-y-3 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                       <li><a href="#" className="hover:text-brand transition-colors">Catalog</a></li>
                       <li><a href="#" className="hover:text-brand transition-colors">Protocols</a></li>
                       <li><a href="#" className="hover:text-brand transition-colors">Nodes</a></li>
                    </ul>
                 </div>
               ))}
            </div>
            
            <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-6">
                  <div className="tech-label">CORE_VERSION: 1.0.42_STABLE</div>
                  <div className="tech-label">ENCRYPTION: AES-256-GCM</div>
               </div>
               <div className="tech-label opacity-20">© 2026 NEXUS SYSTEMS // MADE_IN_SPACE</div>
            </div>
         </div>
      </footer>

      {/* Game Interface Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/95 backdrop-blur-2xl"
          >
            <div className="absolute inset-0 tech-grid-pattern opacity-5" />
            
            <motion.div
              layoutId={`game-${selectedGame.id}`}
              className="relative w-full h-full flex flex-col"
            >
              <div className="h-20 glass-effect flex items-center justify-between px-8">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="font-display text-xl font-bold uppercase tracking-tight">{selectedGame.title}</h2>
                    <div className="tech-label text-brand uppercase">ACTIVE_SESSION_01</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex items-center gap-6 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-full">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                        <span className="tech-label">SYS_READY</span>
                     </div>
                     <span className="w-px h-4 bg-white/10" />
                     <span className="tech-label">SECURE_LINK</span>
                  </div>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-3 bg-brand/10 border border-brand/20 rounded-xl hover:bg-brand/20 text-brand transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-black relative">
                <iframe 
                  src={selectedGame.url} 
                  className="w-full h-full border-none shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
