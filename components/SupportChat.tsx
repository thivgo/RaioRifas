import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { generateSupportResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const SupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Olá! Eu sou o Raio ⚡. Tem dúvidas sobre como participar dos nossos sorteios ou sobre a segurança do site?',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await generateSupportResponse(userMsg.text, history);
      
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-50 flex flex-col items-end font-body transition-all duration-300">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 sm:w-96 border-4 border-raio-blue overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 transition-colors">
          {/* Header */}
          <div className="bg-raio-blue p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot size={24} />
              </div>
              <span className="font-bold font-display text-lg">Ajuda do Raio</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 flex flex-col gap-3 transition-colors">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-raio-purple text-white self-end rounded-tr-none' 
                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 self-start rounded-tl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none text-gray-500 dark:text-gray-400 text-xs italic">
                O Raio está digitando...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-raio-blue transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-raio-blue text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-raio-blue hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center gap-2 group"
        >
          <MessageCircle size={28} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">
            Ajuda
          </span>
        </button>
      )}
    </div>
  );
};

export default SupportChat;