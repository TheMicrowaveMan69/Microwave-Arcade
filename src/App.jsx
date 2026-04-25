import { useState, useMemo, useEffect } from 'react';
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
  Activity,
  Settings,
  CircleCheck,
  Palette,
  ShoppingCart,
  Clock,
  Coins
} from 'lucide-react';
import gamesData from './data/games.json';
import CookieClickerLegacy from './components/CookieClickerLegacy';

const CATEGORIES = ['All', 'Arcade', 'Puzzle', 'Strategy', 'Retro', 'Action'];

const ALL_THEMES = [
  { id: 'encrypted', name: 'Encrypted', color: '#00FF00', desc: 'Secure neon terminal. Standard cyber protocols.', price: 0 },
  { id: 'bloodline', name: 'Bloodline', color: '#FF1A1A', desc: 'Aggressive combat interface. High lethality profile.', price: 500 },
  { id: 'frost', name: 'Frost', color: '#00E0FF', desc: 'Arctic server cooling. Sub-zero performance.', price: 500 },
  { id: 'amber', name: 'Amber', color: '#FFB800', desc: 'Holistic industrial telemetry. CRT era aesthetics.', price: 300 },
  { id: 'amethyst', name: 'Amethyst', color: '#BC00FF', desc: 'Deep space anomaly. Surreal frequency shift.', price: 400 },
  { id: 'sakura', name: 'Sakura', color: '#FF69B4', desc: 'Zen garden interface. Peaceful serenity active.', price: 600 },
  { id: 'monochrome', name: 'Monochrome', color: '#FFFFFF', desc: 'Void architecture. Liminal structural clarity.', price: 200 },
  { id: 'brutalist', name: 'Brutalist', color: '#FFFF00', desc: 'UNFILTERED RAW POWER. NO DECORATION.', price: 450 },
  { id: 'stardust', name: 'Stardust', color: '#FFD700', desc: 'Celestial navigation. Golden nebula radiation.', price: 800 },
  { id: 'toxic', name: 'Toxic Zone', color: '#ADFF2F', desc: 'Biohazard containment. Corrosive visual feed.', price: 550 },
  { id: 'synthwave', name: 'Synthwave', color: '#FF00FF', desc: '80s digital sunset. Retrowave frequency.', price: 700 },
  { id: 'obsidian', name: 'Obsidian', color: '#444444', desc: 'Crystalline darkness. Volcanic glass structure.', price: 900 },
];

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSettings, setShowSettings] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [ownedThemes, setOwnedThemes] = useState(() => {
    const saved = localStorage.getItem('nexus-owned-themes');
    return saved ? JSON.parse(saved) : [];
  });
  const [bits, setBits] = useState(() => {
    const saved = localStorage.getItem('nexus-bits');
    return saved ? parseInt(saved) : 500; // Start with some bits to buy the first theme
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('nexus-theme') || 'none';
  });

  const [shopItems, setShopItems] = useState([]);
  const [resetTime, setResetTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  // Shop Logic: 4-hour rotation
  useEffect(() => {
    localStorage.setItem('nexus-owned-themes', JSON.stringify(ownedThemes));
  }, [ownedThemes]);

  useEffect(() => {
    localStorage.setItem('nexus-bits', bits.toString());
  }, [bits]);
  useEffect(() => {
    const ROTATION_MS = 4 * 60 * 60 * 1000;
    
    const refreshShop = () => {
      const now = Date.now();
      const lastReset = parseInt(localStorage.getItem('shop-reset-time') || '0');
      
      if (now - lastReset > ROTATION_MS || !localStorage.getItem('shop-items')) {
        // Pick 8 random themes
        const shuffled = [...ALL_THEMES].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        
        localStorage.setItem('shop-items', JSON.stringify(selected.map(s => s.id)));
        localStorage.setItem('shop-reset-time', now.toString());
        setShopItems(selected);
        const nextReset = (Math.floor(now / ROTATION_MS) + 1) * ROTATION_MS;
        setResetTime(nextReset);
      } else {
        const savedIds = JSON.parse(localStorage.getItem('shop-items'));
        setShopItems(ALL_THEMES.filter(t => savedIds.includes(t.id)));
        const nextReset = (Math.floor(lastReset / ROTATION_MS) + 1) * ROTATION_MS;
        setResetTime(nextReset);
      }
    };

    refreshShop();
    const timer = setInterval(() => {
      const remaining = resetTime - Date.now();
      if (remaining <= 0) {
        refreshShop();
      } else {
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${h}H ${m}M ${s}S`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [resetTime]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('nexus-theme', currentTheme);
  }, [currentTheme]);

  // Enhance game data with layout properties for bento effect
  const displayGames = useMemo(() => {
    if (!gamesData || !Array.isArray(gamesData)) return [];
    return gamesData.map((game, index) => ({
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
    <div className="min-h-screen bg-surface font-sans selection:bg-brand selection:text-black antialiased overflow-x-hidden text-white">
      {/* Theme Overlays */}
      <div className="noise-overlay" />
      <div className="scanlines" />

      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-0">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-brand/20 blur-lg rounded-full group-hover:bg-brand/40 transition-colors" />
              <div className="relative w-8 h-8 bg-surface-soft border border-brand/30 flex items-center justify-center rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
                <Gamepad2 className="w-5 h-5 text-brand" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight uppercase">NEXUS</h1>
              <div className="tech-label opacity-60 uppercase">{currentTheme}//LINK</div>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              type="text" 
              placeholder="QUICK_ACCESS_COMMAND..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full px-12 py-2.5 text-sm font-mono focus:outline-none focus:border-brand/40 focus:bg-white/[0.05] transition-all text-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full">
              <Coins className="w-3 h-3 text-brand" />
              <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest leading-none">{bits.toLocaleString()} Bits</span>
            </div>
            <button 
              onClick={() => setShowShop(true)}
              className="p-2.5 bg-brand/10 border border-brand/20 rounded-full hover:bg-brand/20 transition-all group relative"
            >
               <ShoppingCart className="w-4 h-4 text-brand" />
               <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-black px-1 rounded-sm">NEW</span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2.5 bg-white/[0.03] border border-white/10 rounded-full hover:bg-white/[0.08] transition-colors group"
            >
               <Settings className="w-4 h-4 text-white/60 group-hover:rotate-90 transition-transform duration-500" />
            </button>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <div className="hidden lg:block">
              <div className="text-[10px] font-mono text-white/30 text-right uppercase tracking-[0.15em] mb-0.5">AUTH_STATUS</div>
              <div className="text-xs font-mono font-bold text-brand uppercase">{currentTheme}_USER</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Featured Bento Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-16">
          <div className="lg:col-span-8 bento-card p-10 flex flex-col justify-end min-h-[400px] border-brand/20 relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-6 tech-label opacity-20 group-hover:opacity-100 transition-opacity uppercase">
                LAT: 42.091 // LNG: 12.885
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent pointer-events-none" />
             <div 
               className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center grayscale scale-110 group-hover:scale-100 transition-transform duration-1000" 
               style={{ 
                 backgroundImage: `url(${
                   currentTheme === 'encrypted' ? 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200' :
                   currentTheme === 'bloodline' ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200' :
                   currentTheme === 'frost' ? 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200' :
                   currentTheme === 'sakura' ? 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1200' :
                   currentTheme === 'monochrome' ? 'https://images.unsplash.com/photo-1449156001935-d28bc3dfae2b?w=1200' :
                   currentTheme === 'amber' ? 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200' :
                   currentTheme === 'brutalist' ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200' :
                   'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200'
                 })` 
               }}
             />
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-2 py-0.5 bg-brand text-black text-[10px] font-mono font-black uppercase tracking-widest rounded-sm">LIVE_NOW</span>
                  <span className="tech-label opacity-50 uppercase">STATION_OS_4.2.1</span>
                </div>
                <h2 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-8 uppercase">
                  THE NEXT <br />
                  <span className="text-brand italic uppercase">EVOLUTION.</span>
                </h2>
                <p className="text-white/50 text-lg max-w-xl font-medium mb-8 leading-relaxed">
                  Experience zero-lag performance with our new cloud-streamed game architecture. 
                  Access thousands of titles directly through the interface.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-3.5 bg-brand text-black font-black uppercase text-xs tracking-[0.1em] rounded-full hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-brand transition-all flex items-center gap-2">
                    INITIATE PORTAL <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="px-8 py-3.5 border border-white/20 hover:border-brand/40 text-white font-black uppercase text-xs tracking-[0.1em] rounded-full transition-all flex items-center gap-2 group">
                    VIEW_CHANGELOG <Activity className="w-4 h-4 text-brand animate-pulse" />
                  </button>
                </div>
             </div>
          </div>
          
          <div className="lg:col-span-4 grid gap-4">
            <div className="bento-card p-8 bg-brand/5 border-brand/10">
               <Cpu className="w-6 h-6 text-brand mb-6" />
               <h3 className="font-display text-2xl font-bold mb-2 uppercase tracking-tight">ENGINE_{currentTheme.toUpperCase().slice(0, 3)}</h3>
               <p className="text-sm text-white/40 font-mono italic">Optimized for low-end hardware without sacrificing visual fidelity.</p>
               <div className="mt-8 flex items-end justify-between h-12">
                  {Array.from({length: 12}).map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-brand/30 rounded-t-sm" 
                    />
                  ))}
               </div>
            </div>
            <div className="bento-card p-8 group cursor-pointer border-brand/10" onClick={() => setShowSettings(true)}>
               <div className="flex justify-between items-start mb-6">
                 <Palette className="w-6 h-6 text-white/60 group-hover:text-brand transition-colors" />
                 <span className="tech-label opacity-40 group-hover:text-brand transition-colors uppercase">CFG_PANEL</span>
               </div>
               <h3 className="font-display text-xl font-bold mb-2 uppercase tracking-tight">VISUAL_PROFILE</h3>
               <p className="text-xs text-white/40 uppercase tracking-widest font-mono">CURRENT: {currentTheme}</p>
               <div className="absolute bottom-0 right-0 p-4 opacity-5 translate-x-4 translate-y-4 group-hover:translate-x-0 transition-transform">
                  <Settings className="w-24 h-24" />
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
          
          <div className="flex items-center gap-4 tech-label uppercase">
             <div className="flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>GRID: DENSE</span>
             </div>
             <div className="w-1 h-1 bg-white/20 rounded-full" />
             <span>ITEMS: {filteredGames.length}</span>
          </div>
        </div>

        {/* Bento Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[180px]">
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
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-70 transition-all duration-700 rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
                </div>
                
                <div className="relative z-10 h-full p-5 flex flex-col justify-end">
                  <div className="mb-auto flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <div className="w-8 h-8 rounded-full bg-surface/80 border border-white/10 flex items-center justify-center backdrop-blur-md">
                       <Layers className="w-3.5 h-3.5 text-white/60" />
                    </div>
                    <div className="tech-label text-[8px] bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-sm uppercase">
                       UID_{game.id.slice(0, 4)}
                    </div>
                  </div>

                  <div>
                    <div className="tech-label text-[8px] text-brand mb-1 group-hover:translate-x-1 transition-transform uppercase">
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
                <div className="absolute inset-0 border-2 border-brand/0 group-hover:border-brand/40 transition-all pointer-events-none rounded-2xl">
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
                    <span className="font-display font-bold text-lg tracking-tight uppercase">NEXUS_{currentTheme.toUpperCase()}</span>
                  </div>
                  <p className="text-white/30 text-xs font-mono uppercase tracking-widest leading-relaxed">
                    A decentralized hub for secure interactive entertainment. <br />
                    Powered by high-frequency architecture. <br />
                    Visual identity: system_forced_{currentTheme}
                  </p>
               </div>
               {['Explore', 'Infrastructure', 'Security', 'Hardware'].map((title) => (
                 <div key={title}>
                    <h4 className="tech-label mb-6 uppercase">{title}</h4>
                    <ul className="space-y-3 text-[10px] font-mono text-white/50 uppercase tracking-widest">
                       <li><a href="#" className="hover:text-brand transition-colors uppercase">Catalog</a></li>
                       <li><a href="#" className="hover:text-brand transition-colors uppercase">Protocols</a></li>
                       <li><a href="#" className="hover:text-brand transition-colors uppercase">Nodes</a></li>
                    </ul>
                 </div>
               ))}
            </div>
            
            <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-4">
               <div className="flex items-center gap-6">
                  <div className="tech-label uppercase">CORE_VERSION: 1.0.42_STABLE</div>
                  <div className="tech-label uppercase">ENCRYPTION: AES-256-GCM</div>
               </div>
               <div className="tech-label opacity-20 uppercase">© 2026 NEXUS SYSTEMS // MADE_IN_SPACE</div>
            </div>
         </div>
      </footer>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-surface/90 backdrop-blur-3xl overflow-hidden p-6"
          >
            <div className="absolute inset-0 tech-grid-pattern opacity-5" />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-soft border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
            >
              <div className="flex h-[70vh]">
                {/* Sidebar */}
                <div className="w-1/3 border-r border-white/[0.05] p-8 hidden md:block">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-brand/10 flex items-center justify-center rounded-lg border border-brand/20">
                      <Settings className="w-4 h-4 text-brand" />
                    </div>
                    <span className="font-display font-bold uppercase tracking-tight italic">CONFIG_UI</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-brand/5 border border-brand/20 rounded-xl text-brand transition-colors">
                       <span className="tech-label text-brand block mb-1">SECTION_01</span>
                       <span className="font-display font-bold uppercase tracking-tight">VISUAL_PROFILE</span>
                    </div>
                    <div className="p-4 rounded-xl text-white/30 hover:bg-white/5 transition-all opacity-50 cursor-not-allowed">
                       <span className="tech-label block mb-1 uppercase tracking-widest">SECTION_02</span>
                       <span className="font-display font-bold uppercase tracking-tight line-through">INPUT_METRICS</span>
                    </div>
                    <div className="p-4 rounded-xl text-white/30 hover:bg-white/5 transition-all opacity-50 cursor-not-allowed">
                       <span className="tech-label block mb-1 uppercase tracking-widest">SECTION_03</span>
                       <span className="font-display font-bold uppercase tracking-tight line-through">CONNECTION_GATE</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="p-8 border-b border-white/[0.05] flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-3xl font-bold uppercase tracking-tight italic">Visual Profile</h2>
                      <p className="tech-label opacity-40 mt-1 uppercase tracking-widest">Modify system interface aesthetics</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-brand/10 border border-brand/20 rounded-full flex items-center gap-2">
                        <Coins className="w-3 h-3 text-brand" />
                        <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest leading-none">{bits.toLocaleString()} Bits</span>
                      </div>
                      <button 
                        onClick={() => setShowSettings(false)}
                        className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto p-8 no-scrollbar flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ALL_THEMES.filter(t => ownedThemes.includes(t.id)).map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setCurrentTheme(theme.id)}
                          className={`
                            group relative p-6 rounded-2xl border transition-all text-left
                            ${currentTheme === theme.id 
                              ? "bg-white/[0.05] border-brand/40 shadow-[0_0_20px_rgba(0,0,0,0.3)] shadow-brand/10" 
                              : "bg-white/[0.02] border-white/10 hover:border-white/20"
                            }
                          `}
                        >
                          <div className="flex items-center gap-4 mb-3">
                             <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: theme.color }}>
                                {currentTheme === theme.id && <CircleCheck className="w-5 h-5 text-black" />}
                             </div>
                             <div>
                                <h4 className="font-display font-bold uppercase tracking-tight">{theme.name}</h4>
                                <span className={`text-[8px] font-mono uppercase tracking-widest ${currentTheme === theme.id ? 'text-brand' : 'opacity-40'}`}>
                                   {currentTheme === theme.id ? 'PROFILE_ACTIVE' : 'READY_TO_SYNC'}
                                </span>
                             </div>
                          </div>
                          <p className="text-xs text-white/40 leading-relaxed font-medium">
                            {theme.desc}
                          </p>
                          
                          {currentTheme === theme.id && (
                            <motion.div 
                              layoutId="active-marker"
                              className="absolute top-4 right-4 w-1.5 h-1.5 bg-brand rounded-full " 
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-8 border-t border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
                    <div className="tech-label opacity-30 uppercase tracking-widest text-[8px]">STORAGE_KEY: nexus-theme-id</div>
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-brand transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Exit Config
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Shop Modal */}
      <AnimatePresence>
        {showShop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-surface/95 backdrop-blur-3xl overflow-hidden p-4 md:p-12"
          >
            <div className="absolute inset-0 tech-grid-pattern opacity-10" />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative w-full max-w-7xl h-full flex flex-col bg-surface-soft border border-white/10 rounded-[var(--theme-roundness)] overflow-hidden shadow-2xl"
            >
              {/* Shop Header */}
              <div className="p-8 border-b border-white/[0.05] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-brand/10 to-transparent">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-white">
                    <ShoppingCart className="w-6 h-6 text-brand" />
                    <h2 className="font-display text-4xl font-black uppercase tracking-tighter italic">Theme Market</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/10">
                      <Clock className="w-3 h-3 text-brand" />
                      <span className="text-[10px] font-mono font-bold text-brand uppercase tracking-widest leading-none">Resets in: {timeLeft}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-brand text-black rounded-full">
                      <Coins className="w-3 h-3" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest leading-none">Balance: {bits.toLocaleString()}_BITS</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowShop(false)}
                  className="p-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors self-end md:self-auto text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Shop Grid */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {shopItems.map((theme, i) => (
                    <motion.div
                      key={theme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group relative flex flex-col p-6 bg-white/[0.03] border border-white/10 rounded-[var(--theme-roundness)] hover:border-brand/40 transition-all cursor-pointer overflow-hidden ${ownedThemes.includes(theme.id) ? 'opacity-50 grayscale' : ''}`}
                      onClick={() => {
                        if (ownedThemes.includes(theme.id)) return;
                        if (bits >= theme.price) {
                          setBits(prev => prev - theme.price);
                          setOwnedThemes(prev => [...prev, theme.id]);
                        } else {
                          // Visual shake or notice could go here
                        }
                      }}
                    >
                       {/* Preview Circle */}
                       <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: theme.color }} />
                       
                       <div className="relative z-10 flex flex-col h-full text-white">
                          <div className="w-12 h-12 rounded-[var(--theme-roundness)] border-2 border-white/10 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: theme.color }}>
                             {ownedThemes.includes(theme.id) ? <CircleCheck className="w-6 h-6 text-black" /> : <Palette className="w-6 h-6 text-black/40" />}
                          </div>
                          
                          <h3 className="font-display text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-brand transition-colors italic leading-none">{theme.name}</h3>
                          <p className="text-xs text-white/40 leading-relaxed mb-8 flex-1">{theme.desc}</p>
                          
                          <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-brand" />
                                <span className="font-mono font-bold text-white group-hover:text-brand transition-colors leading-none">
                                  {ownedThemes.includes(theme.id) ? 'OWNED' : `${theme.price} BITS`}
                                </span>
                             </div>
                             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all leading-none ${
                               ownedThemes.includes(theme.id) 
                                 ? 'bg-white/10 text-white/40' 
                                 : (bits >= theme.price ? 'bg-white/5 border border-white/10 text-white group-hover:bg-brand group-hover:text-black' : 'bg-red-500/20 text-red-500 border border-red-500/20')
                             }`}>
                                {ownedThemes.includes(theme.id) ? 'UNLOCKED' : (bits >= theme.price ? 'PURCHASE' : 'LOCKED')}
                             </div>
                          </div>
                       </div>

                       {/* Background Tag */}
                       <div className="absolute top-4 left-4 tech-label text-[8px] opacity-20 group-hover:opacity-100 transition-opacity uppercase text-white">
                          ID:TN_{theme.id.slice(0,3)}
                       </div>
                    </motion.div>
                  ))}
                  
                  {/* Daily Free Slot */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="group relative flex flex-col p-6 bg-brand/5 border border-brand/20 rounded-[var(--theme-roundness)] hover:border-brand transition-all cursor-pointer overflow-hidden"
                    onClick={() => {
                      setCurrentTheme('encrypted');
                      setShowShop(false);
                    }}
                  >
                     <div className="absolute top-0 right-0 p-4 z-20">
                        <span className="bg-brand text-black text-[8px] font-black px-2 py-0.5 rounded-sm uppercase italic leading-none">Default_Profile</span>
                     </div>
                     <div className="w-12 h-12 rounded-[var(--theme-roundness)] bg-brand mb-6 flex items-center justify-center relative z-10">
                        <CircleCheck className="w-6 h-6 text-black" />
                     </div>
                     <div className="relative z-10 text-white">
                        <h3 className="font-display text-2xl font-black uppercase tracking-tight mb-2 italic leading-none">Encrypted</h3>
                        <p className="text-xs text-white/40 leading-relaxed mb-8 flex-1">Standard issue security protocol. Always available and updated.</p>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                           <span className="font-mono font-bold text-brand uppercase leading-none">FREE</span>
                           <div className="px-4 py-1.5 bg-brand text-black rounded-full text-[10px] font-black uppercase tracking-widest leading-none">Equipped</div>
                        </div>
                     </div>
                  </motion.div>
                </div>
              </div>
              
              <div className="p-8 border-t border-white/[0.05] flex justify-between items-center bg-black/20">
                <div className="tech-label opacity-20 text-[10px] uppercase tracking-[0.2em] text-white">Data Synchronized // Station_OS_Nexus_v2.1</div>
                <div className="flex gap-4">
                  <button className="px-8 py-3 border border-white/20 text-white font-black uppercase text-xs tracking-widest rounded-full hover:bg-white/5 transition-all leading-none">Support</button>
                  <button onClick={() => setShowShop(false)} className="px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-brand transition-all leading-none">Return to Terminal</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Interface Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-surface/95 backdrop-blur-2xl"
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
                    <h2 className="font-display text-xl font-bold uppercase tracking-tight italic">{selectedGame.title}</h2>
                    <div className="tech-label text-brand uppercase tracking-widest">ACTIVE_SESSION_01 // {currentTheme.toUpperCase()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex items-center gap-6 px-6 py-2.5 bg-white/[0.03] border border-white/10 rounded-full">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                        <span className="tech-label uppercase tracking-widest">SYS_READY</span>
                     </div>
                     <span className="w-px h-4 bg-white/10" />
                     <span className="tech-label uppercase tracking-widest">SECURE_LINK</span>
                  </div>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-3 bg-brand/10 border border-brand/20 rounded-xl hover:bg-brand/20 text-brand transition-colors group"
                  >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-black relative">
                {selectedGame.id === 'cookie-clicker' ? (
                  <CookieClickerLegacy />
                ) : (
                  <iframe 
                    src={selectedGame.url} 
                    className="w-full h-full border-none shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    title={selectedGame.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
