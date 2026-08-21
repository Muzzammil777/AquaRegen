import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  Info,
  Droplets,
  Layers,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { ChatMessage } from '../types';
import { FormattedMessage } from '../components/common/FormattedMessage';

export const AIAssistantPage: React.FC = () => {
  const { property, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    // Initial welcome message
    const welcomeMsg: ChatMessage = {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `Hello ${user?.name || 'there'}! I'm **Aqua AI**, your climate-tech hydrology decision assistant.

I have loaded your active property parameters:
• **Catchment Area:** ${property?.roof_area_sqm || 120} m² (${property?.surface_type || 'concrete'} roof)
• **Regional Rainfall:** ${property?.annual_rainfall_mm || 850} mm/year in ${property?.location || 'Bengaluru Urban, KA'}
• **Aquifer Depth:** ${property?.groundwater_depth_m || 7.4}m (${(property?.soil_type || 'sandy loam').replace(/_/g, ' ')} soil)

How can I help you design, simulate, or optimize your rainwater harvesting and groundwater recharge systems today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'AquaRegen-Hydrology-Engine'
    };
    setMessages([welcomeMsg]);

    // Load suggested prompts
    api.getAIPrompts().then(res => {
      setSuggestedPrompts(res.prompts);
    }).catch(() => {
      setSuggestedPrompts([
        "How much water can I harvest?",
        "Should I build a recharge pit?",
        "Why is my water availability low?",
        "How can I reduce groundwater dependency?",
        "Compare my current system with a rainwater harvesting system."
      ]);
    });
  }, [property, user]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-4).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await api.chatWithAquaAI({
        message: query,
        property_context: property || undefined,
        chat_history: historyPayload,
      });

      const assistantMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextUsed: res.context_used,
        provider: res.provider,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'assistant',
        text: "I'm having trouble retrieving climate data right now. Please try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-surface-darkborder">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-aqua-600 flex items-center justify-center text-white shadow-soft">
            <Bot className="w-5 h-5 text-aqua-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-navy-900 dark:text-white tracking-tight">
                Aqua AI Assistant
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-aqua-50 text-aqua-700 dark:bg-aqua-950 dark:text-aqua-300 border border-aqua-200 dark:border-aqua-800">
                Hydrology Grounded
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Context loaded for {property?.name || 'Primary Residence'} ({property?.roof_area_sqm || 120} m²)
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-aqua-500" /> Suggested:
        </span>
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-surface-darkcard border border-slate-200/80 dark:border-surface-darkborder text-slate-700 dark:text-slate-300 hover:border-aqua-400 hover:text-aqua-600 dark:hover:text-aqua-400 shrink-0 transition-all font-medium text-xs disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-4 sm:p-6 shadow-soft overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-navy-800 text-white shadow-sm'
                  : 'bg-gradient-to-br from-aqua-500 to-forest-500 text-white shadow-soft'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[85%] sm:max-w-2xl space-y-1.5`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-navy-800 text-white rounded-tr-none'
                    : 'bg-surface-base dark:bg-surface-dark text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-surface-darkborder'
                }`}
              >
                <FormattedMessage content={msg.text} isUser={msg.sender === 'user'} />

                {/* Context badge if provided */}
                {msg.contextUsed && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-surface-darkborder flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>Roof: {msg.contextUsed.roof_area}</span>
                    <span>•</span>
                    <span>Rainfall: {msg.contextUsed.annual_rainfall}</span>
                    <span>•</span>
                    <span>Harvest Potential: {msg.contextUsed.harvest_potential}</span>
                  </div>
                )}
              </div>

              <div
                className={`flex items-center gap-2 text-[10px] text-slate-400 px-1 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.provider && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-aqua-600 dark:text-aqua-400">{msg.provider}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-aqua-500 to-forest-500 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-surface-base dark:bg-surface-dark border border-slate-200/60 dark:border-surface-darkborder flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-aqua-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-aqua-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-aqua-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 font-medium ml-2">Calculating hydrological yield...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Ask Aqua AI about harvesting sizing, recharge pits, or water sufficiency..."
          disabled={loading}
          className="flex-1 px-4 py-3.5 rounded-2xl bg-white dark:bg-surface-darkcard border border-slate-200 dark:border-surface-darkborder text-xs sm:text-sm text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 shadow-soft"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-navy-800 to-aqua-600 hover:opacity-95 text-white shadow-soft transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
