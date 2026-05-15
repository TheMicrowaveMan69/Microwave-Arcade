import { useState } from 'react';
import { motion } from 'motion/react';
import { Palette, Terminal, Zap, Check, Share2, Plus } from 'lucide-react';

export default function ThemeEditor({ onPublish }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#00FF00');
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePublish = () => {
    if (!name.trim()) return;

    const newTheme = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      color: color,
      desc: description.trim() || 'A user-crafted interface style.',
      rarity: 'Custom',
      isCustom: true
    };

    onPublish(newTheme);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      setDescription('');
      setColor('#00FF00');
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Editor Controls */}
        <div className="bento-card p-8 bg-white/[0.03] border-white/10 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-5 h-5 text-brand" />
            <h3 className="font-display text-xl font-bold uppercase tracking-tight">Theme Architect</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1.5">Style Designation</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CYBER_VOID"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-brand/40 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1.5">Chromatic Frequency (Hex)</label>
              <div className="flex gap-3">
                <input 
                  type="color" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 bg-transparent border-none cursor-pointer rounded overflow-hidden"
                />
                <input 
                  type="text" 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#00FF00"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-brand/40 outline-none transition-all uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-1.5">Data Summary</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the aesthetic..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-brand/40 outline-none transition-all h-24 resize-none"
              />
            </div>
          </div>

          <button 
            onClick={handlePublish}
            disabled={!name.trim() || isSuccess}
            className={`mt-4 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
              isSuccess 
                ? 'bg-green-500 text-white' 
                : 'bg-brand text-black hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed'
            }`}
          >
            {isSuccess ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isSuccess ? 'PUBLISHED TO GRID' : 'PUBLISH TO MARKET'}
          </button>
        </div>

        {/* Live Preview */}
        <div className="relative bento-card p-8 bg-surface-soft border-white/10 overflow-hidden flex flex-col justify-center items-center text-center">
          <div className="absolute inset-0 opacity-[0.03] tech-grid-pattern" />
          
          <div 
            className="w-32 h-32 rounded-3xl border-4 border-white/10 mb-8 flex items-center justify-center relative shadow-2xl group transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
          >
            <div className="absolute inset-0 blur-3xl opacity-40 rounded-full" style={{ backgroundColor: color }} />
            <Terminal className="w-12 h-12 text-black relative z-10" />
          </div>

          <div className="relative z-10">
            <h4 className="font-display text-3xl font-black uppercase tracking-tighter italic mb-2" style={{ color: color }}>
              {name || 'PREVIEW_ID'}
            </h4>
            <p className="text-xs text-white/40 font-mono tracking-widest uppercase mb-6">{description || 'Designation Pending...'}</p>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
              <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">Aesthetic_Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
