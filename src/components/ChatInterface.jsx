import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Trash2, Sparkles, ChevronDown, BrainCircuit } from 'lucide-react';

const MODELS = [
  { id: 'gemini', name: 'Gemini 3 Flash', provider: 'Google', icon: Sparkles, color: 'text-blue-400' },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Greeting. I am the Microwave AI. I am currently in maintenance mode while the Cloudflare backend is being configured. Please enjoy the games in the meantime!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const selectedModel = MODELS[0];
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulated response for now
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Backend connection pending. I am currently operating in limited offline mode. Full AI capabilities will be restored once the environment variables are deployed to Cloudflare.' 
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Conversation cleared. How can I help today?' }]);
  };

  return (
    <div className="flex flex-col h-[70vh] bento-card normal-case bg-black/60 border-white/10 overflow-hidden relative shadow-2xl">
      <div className="absolute inset-0 tech-grid-pattern opacity-5 pointer-events-none" />
      
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10 bg-white/[0.04] flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
            <selectedModel.icon className={`w-4 h-4 ${selectedModel.color}`} />
            <div className="text-left">
              <div className="text-[10px] font-mono text-white/40 leading-none mb-1 tracking-widest">{selectedModel.provider}</div>
              <div className="text-xs font-bold leading-none">{selectedModel.name}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-mono text-white/60 font-medium tracking-widest">Offline</span>
          </div>
          <button 
            onClick={() => setMessages([{ role: 'assistant', content: 'Conversation cleared.' }])}
            className="p-2 text-white/40 hover:text-red-500 transition-colors bg-white/5 rounded-lg border border-white/10"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar relative z-10"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mt-1 border ${
                  msg.role === 'user' 
                    ? 'bg-brand/20 border-brand/40 shadow-[0_0_15px_rgba(0,255,0,0.15)]' 
                    : 'bg-white/10 border-white/20'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-brand" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl text-[13px] leading-relaxed font-sans shadow-md normal-case ${
                  msg.role === 'user'
                    ? 'bg-brand text-black font-semibold rounded-tr-sm'
                    : 'bg-surface-soft border border-white/20 rounded-tl-sm backdrop-blur-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 border border-white/20 p-4 rounded-2xl rounded-tl-sm flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-brand animate-spin" />
                <span className="text-[10px] font-mono text-white/60 tracking-widest animate-pulse">Assistant is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <form 
        onSubmit={handleSubmit}
        className="p-6 border-t border-white/10 bg-black/80 backdrop-blur-xl relative z-10"
      >
        <div className="relative flex items-center gap-4">
          <div className="absolute left-4 opacity-40">
            <selectedModel.icon className={`w-4 h-4 ${selectedModel.color}`} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`How can I help you today?`}
            className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-brand/40 transition-all text-white placeholder-white/20"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-4 bg-brand text-black rounded-2xl hover:bg-brand/80 disabled:opacity-50 disabled:grayscale transition-all active:scale-95 shadow-[0_0_20px_rgba(0,255,0,0.2)]"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 opacity-20">
          <span className="text-[8px] font-mono text-white tracking-[0.4em]">Secure Connection</span>
          <div className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-[8px] font-mono text-white tracking-[0.4em]">Private Session</span>
        </div>
      </form>
    </div>
  );
}
