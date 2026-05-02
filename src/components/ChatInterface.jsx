import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Trash2, Sparkles, ChevronDown, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODELS = [
  { id: 'gemini', name: 'Gemini 3 Flash', provider: 'Google', icon: Sparkles, color: 'text-blue-400' },
  { id: 'gpt4', name: 'GPT-4o', provider: 'OpenAI', icon: BrainCircuit, color: 'text-green-400' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', icon: Bot, color: 'text-orange-400' },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('microwave-chat-history');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Systems ready. I am your AI assistant for the Microwave Arcade. How can I assist with your gaming session today?' }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('microwave-chat-history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const modelIdentifier = "gemini-3-flash-preview"; 
      
      const response = await ai.models.generateContent({
        model: modelIdentifier,
        contents: newMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })),
        config: {
          systemInstruction: `You are now operating as ${selectedModel.name} (${selectedModel.provider}). 
          Your goal is to provide high-quality, professional assistance. 
          Use standard sentence case. DO NOT use all caps. 
          Adopt a personality consistent with ${selectedModel.name}.
          Do not mention arcade themes or hacker styles.`,
        }
      });

      const text = response.text;
      if (text) {
        setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please check your system configuration or try switching models.' }]);
    } finally {
      setIsLoading(false);
    }
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
          <div className="relative">
            <button 
              onClick={() => setShowModelMenu(!showModelMenu)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 group"
            >
              <selectedModel.icon className={`w-4 h-4 ${selectedModel.color}`} />
              <div className="text-left">
                <div className="text-[10px] font-mono text-white/40 leading-none mb-1 tracking-widest">{selectedModel.provider}</div>
                <div className="text-xs font-bold leading-none flex items-center gap-2">
                  {selectedModel.name}
                  <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${showModelMenu ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {showModelMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-surface-soft border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-50"
                >
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setShowModelMenu(false);
                      }}
                      className={`w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0 ${selectedModel.id === m.id ? 'bg-white/[0.03]' : ''}`}
                    >
                      <m.icon className={`w-4 h-4 ${m.color}`} />
                      <div>
                        <div className="text-[10px] font-mono text-white/40 leading-none mb-1">{m.provider}</div>
                        <div className="text-xs font-bold">{m.name}</div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-white/60 font-medium tracking-widest">Online</span>
          </div>
          <button 
            onClick={clearChat}
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
