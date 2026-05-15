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
  ShoppingCart,
  CircleCheck,
  Palette,
  Zap,
  Maximize,
  MessageSquare
} from 'lucide-react';
import gamesData from './data/games.json';
import ChatInterface from './components/ChatInterface';
import ThemeEditor from './components/ThemeEditor';

const CATEGORIES = ['All', 'Arcade', 'Puzzle', 'Strategy', 'Retro', 'Action'];

const ALL_THEMES = [
  { id: 'legacy', name: 'Standard', color: '#f1f3f4', desc: 'Baseline system interface. Minimal overhead encryption.', price: 0, rarity: 'Standard' },
  { id: 'encrypted', name: 'Encrypted', color: '#00FF00', desc: 'Secure neon terminal. Standard cyber protocols.', price: 2000, rarity: 'Transcendent' },
  { id: 'amethyst', name: 'Amethyst', color: '#BC00FF', desc: 'Deep space anomaly. Surreal frequency shift.', price: 2000, rarity: 'Transcendent' },
  { id: 'bloodline', name: 'Bloodline', color: '#FF1A1A', desc: 'Aggressive combat interface. High lethality profile.', price: 1600, rarity: 'Mythic' },
  { id: 'toxic', name: 'Toxic Zone', color: '#ADFF2F', desc: 'Biohazard containment. Corrosive visual feed.', price: 1600, rarity: 'Mythic' },
  { id: 'frost', name: 'Frost', color: '#00E0FF', desc: 'Arctic server cooling. Sub-zero performance.', price: 1250, rarity: 'Legendary' },
  { id: 'synthwave', name: 'Synthwave', color: '#FF00FF', desc: '80s digital sunset. Retrowave frequency.', price: 1250, rarity: 'Legendary' },
  { id: 'obsidian', name: 'Obsidian', color: '#444444', desc: 'Crystalline darkness. Volcanic glass structure.', price: 1250, rarity: 'Legendary' },
  { id: 'sakura', name: 'Sakura', color: '#FF69B4', desc: 'Zen garden interface. Peaceful serenity active.', price: 900, rarity: 'Epic' },
  { id: 'stardust', name: 'Stardust', color: '#FFD700', desc: 'Celestial navigation. Golden nebula radiation.', price: 900, rarity: 'Epic' },
  { id: 'monochrome', name: 'Monochrome', color: '#FFFFFF', desc: 'Void architecture. Liminal structural clarity.', price: 700, rarity: 'Rare' },
  { id: 'amber', name: 'Amber', color: '#FFB800', desc: 'Holistic industrial telemetry. CRT era aesthetics.', price: 700, rarity: 'Rare' },
  { id: 'brutalist', name: 'Brutalist', color: '#FFFF00', desc: 'UNFILTERED RAW POWER. NO DECORATION.', price: 400, rarity: 'Common' },
];

const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'Transcendent': return '#06b6d4';
    case 'Mythic': return '#ef4444';
    case 'Legendary': return '#f59e0b';
    case 'Epic': return '#a855f7';
    case 'Rare': return '#3b82f6';
    case 'Common': return '#9ca3af';
    default: return '#5f6368';
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('GAMES');
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSettings, setShowSettings] = useState(false);
  const [ownedThemes, setOwnedThemes] = useState(() => {
    const saved = localStorage.getItem('microwave-owned-themes');
    const themes = saved ? JSON.parse(saved) : ['legacy'];
    if (!themes.includes('legacy')) themes.push('legacy');
    return themes;
  });
  const [customThemes, setCustomThemes] = useState(() => {
    const saved = localStorage.getItem('microwave-custom-themes');
    return saved ? JSON.parse(saved) : [];
  });
  const [playCounts, setPlayCounts] = useState(() => {
    const saved = localStorage.getItem('microwave-play-counts');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('microwave-theme') || 'legacy';
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem('microwave-owned-themes', JSON.stringify(ownedThemes));
  }, [ownedThemes]);

  useEffect(() => {
    localStorage.setItem('microwave-custom-themes', JSON.stringify(customThemes));
  }, [customThemes]);

  useEffect(() => {
    localStorage.setItem('microwave-play-counts', JSON.stringify(playCounts));
  }, [playCounts]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('microwave-theme', currentTheme);

    // Handle custom theme CSS variables
    if (currentTheme.startsWith('custom-')) {
      const theme = customThemes.find(t => t.id === currentTheme);
      if (theme) {
        document.documentElement.style.setProperty('--theme-brand', theme.color);
        document.documentElement.style.setProperty('--theme-brand-dim', `${theme.color}1a`);
        document.documentElement.style.setProperty('--theme-border', `${theme.color}33`);
      }
    } else {
      // Reset for standard themes
      document.documentElement.style.removeProperty('--theme-brand');
      document.documentElement.style.removeProperty('--theme-brand-dim');
      document.documentElement.style.removeProperty('--theme-border');
    }
  }, [currentTheme, customThemes]);

  // Enhance game data with layout properties for bento effect
  const displayGames = useMemo(() => {
    if (!gamesData || !Array.isArray(gamesData)) return [];
    return gamesData;
  }, []);

  const filteredGames = useMemo(() => {
    return displayGames.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [displayGames, searchQuery, activeCategory]);

  const topGames = useMemo(() => {
    return [...displayGames]
      .sort((a, b) => (playCounts[b.id] || 0) - (playCounts[a.id] || 0))
      .slice(0, 5);
  }, [displayGames, playCounts]);

  const handlePlayGame = (game) => {
    setPlayCounts(prev => ({
      ...prev,
      [game.id]: (prev[game.id] || 0) + 1
    }));
    setSelectedGame(game);
  };

  const toggleFullscreen = () => {
    const iframe = document.getElementById('game-iframe');
    if (!iframe) return;

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  };

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
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setActiveTab('GAMES'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-brand/20 blur-lg rounded-full group-hover:bg-brand/40 transition-colors" />
              <div className="relative w-8 h-8 bg-surface-soft border border-brand/30 flex items-center justify-center rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
                <Gamepad2 className="w-5 h-5 text-brand" />
              </div>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">Microwave Arcade v2</h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-xl">
            <button
              onClick={() => { setActiveTab('GAMES'); setActiveCategory('All'); }}
              className={`p-3 rounded-lg transition-all flex items-center justify-center ${
                activeTab === 'GAMES'
                  ? 'bg-brand text-black shadow-[0_0_15px_rgba(0,255,0,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
              title="Games"
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setActiveTab('CHAT'); setActiveCategory('All'); }}
              className={`p-3 rounded-lg transition-all flex items-center justify-center relative ${
                activeTab === 'CHAT'
                  ? 'bg-brand text-black shadow-[0_0_15px_rgba(0,255,0,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
              title="AI Chat"
            >
              <MessageSquare className="w-4 h-4" />
              <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand animate-pulse ${activeTab === 'CHAT' ? 'hidden' : 'block'}`} />
            </button>
            <button
              onClick={() => { setActiveTab('MARKET'); setActiveCategory('STORE'); }}
              className={`p-3 rounded-lg transition-all flex items-center justify-center ${
                activeTab === 'MARKET'
                  ? 'bg-brand text-black shadow-[0_0_15px_rgba(0,255,0,0.3)]'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
              title="Market"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 max-w-xl relative hidden md:block opacity-0 pointer-events-none">
            {/* Nav search hidden in favor of main games search */}
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSettings(true)}
              className="p-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all group shadow-lg active:scale-95 flex items-center justify-center"
              title="Settings"
            >
               <Settings className="w-4 h-4 text-brand group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'GAMES' ? (
            <motion.div
              key="games-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Info Modules Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-16">
                {/* Update Log Module */}
                <div className="md:col-span-4 bento-card p-6 border-brand/20 bg-white/[0.02] flex flex-col justify-between">
                   <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-2 py-0.5 bg-brand text-black text-[10px] font-mono font-bold rounded-sm">New</span>
                        <Activity className="w-3.5 h-3.5 text-white/40" />
                      </div>
                      <h2 className="font-display text-2xl font-bold tracking-tight mb-4 capitalize">
                        Latest <span className="text-brand italic">updates</span>
                      </h2>
                      <div className="space-y-3 overflow-y-auto max-h-[180px] no-scrollbar pr-2">
                        <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                          <div className="p-1.5 bg-brand/10 rounded">
                            <Zap className="w-3 h-3 text-brand" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold tracking-tight">Binary P6 Deployed</h4>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                          <div className="p-1.5 bg-brand/10 rounded">
                            <Activity className="w-3 h-3 text-brand" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold tracking-tight">Themes Updated</h4>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
                
                {/* Top Games Module */}
                <div className="md:col-span-4 bento-card p-6 bg-brand/5 border-brand/10 relative overflow-hidden flex flex-col justify-between">
                   <div>
                      <TrendingUp className="w-5 h-5 text-brand mb-4" />
                      <h3 className="font-display text-2xl font-bold mb-4 uppercase tracking-tight">TOP GAMES</h3>
                      <div className="space-y-2">
                         {topGames.map((game, i) => (
                           <div 
                             key={game.id} 
                             onClick={() => handlePlayGame(game)}
                             className="flex items-center justify-between group/line cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all"
                           >
                             <div className="flex items-center gap-3">
                               <span className="text-[10px] font-mono text-brand font-bold opacity-40 group-hover/line:opacity-100 italic transition-opacity">0{i + 1}</span>
                               <span className="text-xs font-medium text-white/80 group-hover/line:text-brand transition-colors line-clamp-1">{game.title}</span>
                             </div>
                             <div className="flex items-center gap-1.5">
                               <span className="text-[10px] font-mono text-white/20 group-hover/line:text-brand/40 transition-colors uppercase tracking-widest">{playCounts[game.id] || 0} PLAYS</span>
                               <ArrowRight className="w-3 h-3 text-brand opacity-0 group-hover/line:opacity-100 -translate-x-2 group-hover/line:translate-x-0 transition-all" />
                             </div>
                           </div>
                         ))}
                         {topGames.length === 0 && (
                           <p className="text-[10px] font-mono text-white/20 italic p-2">Wait for data feed...</p>
                         )}
                      </div>
                   </div>
                </div>

                {/* Top Players Module */}
                <div className="md:col-span-4 bento-card p-6 group cursor-pointer border-brand/10 relative overflow-hidden flex flex-col justify-between" onClick={() => setShowSettings(true)}>
                   <div>
                      <div className="flex justify-between items-start mb-4">
                        <Palette className="w-5 h-5 text-white/60 group-hover:text-brand transition-colors" />
                      </div>
                      <h3 className="font-display text-2xl font-bold mb-4 tracking-tight">Top Players</h3>
                      <div className="space-y-2 text-white">
                         {[
                           { name: 'X_PULSE_01', score: '12.5K' },
                           { name: 'VOID_WALKER', score: '10.2K' },
                           { name: 'GLITCH_KING', score: '9.8K' },
                           { name: 'NEO_CYPHER', score: '8.4K' },
                           { name: 'SPECTER_77', score: '7.1K' }
                         ].map((player, i) => (
                           <div key={i} className="flex items-center gap-3">
                             <span className="text-[10px] font-mono text-white/60 flex-1 tracking-widest">{player.name}</span>
                             <span className="text-[10px] font-mono text-brand/40">{player.score}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="absolute bottom-0 right-0 p-4 opacity-[0.02] translate-x-4 translate-y-4 group-hover:translate-x-0 transition-transform pointer-events-none">
                      <Activity className="w-24 h-24" />
                   </div>
                </div>
              </div>


              {/* Categories & Search Bar */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12 border-b border-white/[0.05] pb-8">
                <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
                  <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/10 rounded-xl overflow-x-auto no-scrollbar max-w-full">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2.5 text-xs font-mono tracking-[0.1em] rounded-lg transition-all ${
                          activeCategory === cat 
                            ? 'bg-brand text-black font-black' 
                            : 'text-white/40 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                    <input 
                      type="text" 
                      placeholder="Search arcade..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-10 py-2.5 text-xs font-mono focus:outline-none focus:border-brand/40 transition-all text-white"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-mono opacity-40">
                   <span>Games: {filteredGames.length}</span>
                </div>
              </div>

              {/* Uniform Games Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredGames.map((game, idx) => (
                    <motion.div
                      key={game.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => handlePlayGame(game)}
                      className="group cursor-pointer flex flex-col"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 mb-3 group-hover:border-brand/40 transition-all shadow-lg group-hover:shadow-brand/5">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                      </div>
                      
                      <div className="px-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-display font-medium tracking-tight text-white/80 group-hover:text-brand leading-tight text-xs sm:text-sm transition-colors line-clamp-1">
                            {game.title}
                          </h3>
                          <span className="text-[9px] font-mono text-white/20 group-hover:text-brand/40 transition-colors uppercase whitespace-nowrap">
                            {playCounts[game.id] || 0}
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-white/20 group-hover:text-brand/40 transition-colors uppercase tracking-widest leading-none">
                          {game.category}
                        </p>
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
                  <p className="font-mono text-xs tracking-[0.3em] opacity-40">No matching titles</p>
                </div>
              )}
            </motion.div>
          ) : activeTab === 'MARKET' ? (
            <motion.div
              key="market-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h2 className="font-display text-4xl font-black uppercase tracking-tighter italic">MARKET & EDITOR</h2>
                    <p className="text-xs font-mono text-white/40 uppercase tracking-widest leading-none">Accessing specialized interface styles</p>
                  </div>
                </div>
                
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {['STORE', 'EDITOR', 'COMMUNITY'].map(m => (
                    <button
                      key={m}
                      onClick={() => setActiveCategory(m)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-mono font-bold tracking-widest transition-all ${
                        (activeCategory === m || (activeCategory === 'All' && m === 'STORE')) 
                          ? 'bg-brand text-black shadow-lg shadow-brand/20' 
                          : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {activeCategory === 'EDITOR' ? (
                <ThemeEditor onPublish={(theme) => {
                  setCustomThemes(prev => [theme, ...prev]);
                  setOwnedThemes(prev => [...prev, theme.id]);
                  setActiveCategory('COMMUNITY');
                }} />
              ) : activeCategory === 'COMMUNITY' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customThemes.length === 0 ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center text-center bento-card border-dashed">
                      <Palette className="w-12 h-12 text-white/10 mb-4" />
                      <p className="text-xs font-mono text-white/20 uppercase tracking-[0.2em]">No community styles detected</p>
                      <button 
                        onClick={() => setActiveCategory('EDITOR')}
                        className="mt-6 text-brand text-[10px] font-bold uppercase tracking-widest hover:underline"
                      >
                        Launch Architect
                      </button>
                    </div>
                  ) : (
                    customThemes.map((theme, i) => (
                      <motion.div
                        key={theme.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`group relative flex flex-col p-8 bg-white/[0.03] border border-white/10 rounded-3xl hover:border-brand/40 transition-all cursor-pointer overflow-hidden ${currentTheme === theme.id ? 'border-brand/40 ring-1 ring-brand/20' : ''}`}
                        onClick={() => setCurrentTheme(theme.id)}
                      >
                         <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: theme.color }} />
                         
                          <div className="relative z-10 flex flex-col h-full text-white">
                             <div className="w-12 h-12 rounded-xl border border-white/10 mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform" style={{ backgroundColor: theme.color }}>
                                {currentTheme === theme.id ? <CircleCheck className="w-6 h-6 text-black" /> : <Palette className="w-6 h-6 text-black/40" />}
                             </div>
  
                             <div className="mb-6">
                                <h3 className="font-display font-black uppercase tracking-tight text-xl mb-2">{theme.name}</h3>
                                <p className="text-[10px] text-white/40 leading-relaxed italic line-clamp-2">{theme.desc}</p>
                             </div>
                            
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                               <span className="text-[9px] font-mono text-brand font-bold uppercase tracking-[0.2em]">STATION_LOADED</span>
                               <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all leading-none ${
                                 currentTheme === theme.id 
                                   ? 'bg-brand text-black' 
                                   : 'bg-white/5 text-white/40 group-hover:text-white'
                               }`}>
                                  {currentTheme === theme.id ? 'ACTIVE' : 'SYNC'}
                               </div>
                            </div>
                         </div>
                       </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ALL_THEMES.filter(t => ['encrypted', 'monochrome'].includes(t.id)).map((theme, i) => (
                    <motion.div
                      key={theme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`group relative flex flex-col p-8 bg-white/[0.03] border border-white/10 rounded-3xl hover:border-brand/40 transition-all cursor-pointer overflow-hidden ${ownedThemes.includes(theme.id) ? 'opacity-60' : ''}`}
                      onClick={() => {
                        if (ownedThemes.includes(theme.id)) return;
                        setOwnedThemes(prev => [...prev, theme.id]);
                      }}
                    >
                       {/* Preview Circle */}
                       <div className="absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: theme.color }} />
                       
                        <div className="relative z-10 flex flex-col h-full text-white">
                           <div className="w-16 h-16 rounded-2xl border-2 border-white/10 mb-8 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: theme.color }}>
                              {ownedThemes.includes(theme.id) ? <CircleCheck className="w-8 h-8 text-black" /> : <Palette className="w-8 h-8 text-black/40" />}
                           </div>
  
                           <div className="mb-8">
                              <h3 className="font-display font-bold uppercase tracking-tight text-2xl mb-2">{theme.name}</h3>
                              <p className="text-sm text-white/40 leading-relaxed italic">{theme.desc}</p>
                           </div>
                          
                          <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                             <span className="text-xs font-mono text-brand font-bold uppercase tracking-widest">FREE ACCESS</span>
                             <div className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all leading-none ${
                               ownedThemes.includes(theme.id) 
                                 ? 'bg-white/10 text-white/40' 
                                 : 'bg-brand text-black'
                             }`}>
                                {ownedThemes.includes(theme.id) ? 'UNLOCKED' : 'DOWNLOAD'}
                             </div>
                          </div>
                       </div>
                     </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <ChatInterface />
            </motion.div>
          )}
        </AnimatePresence>
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
                    <span className="font-display font-bold text-lg tracking-tight">Microwave Arcade</span>
                  </div>
               </div>
            </div>
            
            <div className="pt-8 border-t border-white/[0.05] flex justify-center items-center">
               <div className="text-[10px] font-mono opacity-20 uppercase tracking-widest">© 2026 MICROWAVE SYSTEMS</div>
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
                    <span className="font-display font-bold uppercase tracking-tight">SETTINGS</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-display text-3xl font-bold uppercase tracking-tight italic">Settings & Themes</h2>
                        <p className="tech-label opacity-40 mt-1 uppercase tracking-widest">Manage your interface and account</p>
                      </div>
                      <div className="flex items-center gap-4">
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
                      {[...ALL_THEMES, ...customThemes].filter(t => ownedThemes.includes(t.id)).map((theme) => (
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
                                <div className="flex items-center gap-2">
                                  <h4 className="font-display font-bold uppercase tracking-tight">{theme.name}</h4>
                                </div>
                                <span className={`text-[8px] font-mono uppercase tracking-widest ${currentTheme === theme.id ? 'text-brand' : 'opacity-40'}`}>
                                   {currentTheme === theme.id ? 'PROFILE_ACTIVE' : 'READY_TO_SYNC'}
                                </span>
                             </div>
                          </div>
                          <p className="text-xs text-white/40 leading-relaxed font-medium mb-3">
                            {theme.desc}
                          </p>
                          <div className="mt-auto flex justify-between items-center">
                            <span className="px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-widest leading-none border" style={{ color: getRarityColor(theme.rarity), borderColor: `${getRarityColor(theme.rarity)}40`, backgroundColor: `${getRarityColor(theme.rarity)}10` }}>
                              {theme.rarity}
                            </span>
                          </div>
                          
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
                  
                  <div className="p-8 border-t border-white/[0.05] flex justify-end items-center bg-white/[0.01]">
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full hover:bg-brand transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                      EXIT
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bit Games Modal Removed */}


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
              <div className="h-20 bg-neutral-900 flex items-center justify-between px-8 border-b border-white/10 shadow-2xl relative z-50">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand/20 border border-brand/40 rounded-xl hover:bg-brand/30 text-brand transition-all group font-display font-bold uppercase text-xs tracking-wider"
                    title="Leave Game"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                  <button 
                    onClick={toggleFullscreen}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand/20 border border-brand/40 rounded-xl hover:bg-brand/30 text-brand transition-all group font-display font-bold uppercase text-xs tracking-wider"
                    title="Fullscreen"
                  >
                    <Maximize className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Fullscreen</span>
                  </button>
                  <div className="flex items-center gap-4 ml-2 border-l border-white/10 pl-4">
                    {selectedGame.thumbnail && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-2xl flex-shrink-0 hidden md:block">
                        <img 
                          src={selectedGame.thumbnail} 
                          alt={selectedGame.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="font-display text-xl md:text-2xl font-black uppercase tracking-tighter italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{selectedGame.title}</h2>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors group"
                    title="Close"
                  >
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-black relative">
                <iframe 
                  id="game-iframe"
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
