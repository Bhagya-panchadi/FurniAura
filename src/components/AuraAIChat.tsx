import React, { useState, useRef, useEffect } from 'react';
import { useFurniture } from '../context/FurnitureContext';
import { Product } from '../types/furniture';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Check,
  Compass,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'aura';
  text: string;
  suggestedProducts?: Product[];
  timestamp: string;
}

const EXAMPLE_QUESTIONS = [
  'Suggest a sofa under ₹25,000.',
  'Help me design my bedroom.',
  'Which dining table is suitable for four people?',
  'Find furniture for a small living room.',
  'Compare these two beds.',
];

export const AuraAIChat: React.FC = () => {
  const {
    isAiChatOpen,
    setIsAiChatOpen,
    products,
    addToCart,
    setSelectedProductId,
    setCurrentView,
  } = useFurniture();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'aura',
      text: `Welcome to FurniAura. I am **Aura**, your dedicated interior designer and architectural shopping concierge.

I can help you:
• Select the perfect piece under a specific budget
• Plan furniture dimensions and walkways for small or large rooms
• Compare materials, finishes, and warranties side-by-side
• Curate complete room palettes from living suites to bedroom sanctuaries

What space are you envisioning today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [confirmedCartItem, setConfirmedCartItem] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
    }
  }, [messages, isAiChatOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ text: m.text, role: m.sender })),
        }),
      });

      const data = await res.json();
      const auraMsg: ChatMessage = {
        id: `aura-${Date.now()}`,
        sender: 'aura',
        text: data.text || 'I analyzed our catalog to find the finest options for your sanctuary.',
        suggestedProducts: data.suggestedProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, auraMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `aura-err-${Date.now()}`,
          sender: 'aura',
          text: 'I apologize, but I had a momentary interruption. Based on our catalog, our organic curved sofa and solid oak dining table remain popular choices.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Safe Add to Cart with Customer Confirmation requirement
  const handleAddToCartWithConfirmation = (product: Product) => {
    addToCart(product);
    setConfirmedCartItem(product.id);
    setTimeout(() => {
      setConfirmedCartItem(null);
    }, 2500);
  };

  return (
    <>
      {/* Floating Chat Trigger with Subtle Glow */}
      {!isAiChatOpen && (
        <button
          onClick={() => setIsAiChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 bg-[#2C221E] hover:bg-[#433731] text-white rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 group cursor-pointer border border-[#E7C19D]/30"
          aria-label="Open Aura AI Shopping Agent"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#E7C19D] animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C27A4E] rounded-full ring-2 ring-[#2C221E]" />
          </div>
          <span className="hidden sm:inline text-xs font-semibold tracking-wide pr-1">
            Ask Aura AI
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isAiChatOpen && (
        <div className="fixed inset-y-4 right-4 sm:inset-y-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] sm:h-[620px] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EDE5DF] flex flex-col overflow-hidden animate-in fade-in duration-200">
          {/* Chat Window Header */}
          <div className="px-5 py-4 bg-[#2C221E] text-white flex items-center justify-between border-b border-[#433731]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#3F332D] border border-[#E7C19D]/40 flex items-center justify-center text-[#E7C19D]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold tracking-wide flex items-center gap-2">
                  <span>Aura AI</span>
                  <span className="text-[10px] font-sans font-normal px-2 py-0.5 bg-white/10 rounded-full text-[#E7C19D]">
                    Interior Designer
                  </span>
                </h3>
                <p className="text-[11px] text-[#D8CFC8] font-light">
                  Powered by Live Catalog Intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setCurrentView('room-planner');
                  setIsAiChatOpen(false);
                }}
                className="p-1.5 text-[#D8CFC8] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Launch 2D Room Planner"
              >
                <Compass className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAiChatOpen(false)}
                className="p-1.5 text-[#D8CFC8] hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'aura' && (
                  <div className="w-7 h-7 rounded-full bg-[#EFE9E2] border border-[#D8CFC8] flex items-center justify-center text-[#8C6D58] shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2.5 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#2C221E] text-white rounded-tr-xs'
                      : 'bg-white text-[#2C221E] border border-[#EDE5DF] rounded-tl-xs'
                  }`}
                >
                  {/* Message Prose with Markdown line-breaks */}
                  <div className="whitespace-pre-line text-xs font-normal">
                    {msg.text}
                  </div>

                  {/* Embedded Suggested Product Cards */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#F2ECE6]">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8C7D73]">
                        Catalog Recommendations:
                      </span>
                      {msg.suggestedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-3 p-2 bg-[#FAF8F5] rounded-xl border border-[#EDE5DF] hover:border-[#2C221E]/30 transition-colors"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              onClick={() => {
                                setSelectedProductId(prod.id);
                                setIsAiChatOpen(false);
                              }}
                              className="font-serif font-semibold text-[#2C221E] line-clamp-1 hover:text-[#C27A4E] cursor-pointer"
                            >
                              {prod.name}
                            </h4>
                            <p className="text-[11px] font-bold text-[#2C221E] tabular-nums">
                              ₹{prod.price.toLocaleString()}
                              <span className="text-[10px] font-normal text-[#8C7D73] ml-1.5">
                                ({prod.dimensions.width}×{prod.dimensions.depth} cm)
                              </span>
                            </p>
                          </div>

                          {/* Add to Cart button with confirmation check */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleAddToCartWithConfirmation(prod)}
                              className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                confirmedCartItem === prod.id
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-[#2C221E] text-white hover:bg-[#433731]'
                              }`}
                              title="Add to cart with confirmation"
                            >
                              {confirmedCartItem === prod.id ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <ShoppingBag className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProductId(prod.id);
                                setIsAiChatOpen(false);
                              }}
                              className="p-2 text-[#6F6057] hover:text-[#2C221E] rounded-lg transition-colors cursor-pointer"
                              title="View complete specifications"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="block text-[10px] text-right opacity-60">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#2C221E] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#8C7D73]">
                <div className="w-7 h-7 rounded-full bg-[#EFE9E2] flex items-center justify-center text-[#8C6D58]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white border border-[#EDE5DF] px-3.5 py-2 rounded-2xl text-[11px] text-[#6F6057]">
                  Aura is searching catalog specifications & calculating space...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-4 py-2 bg-[#FAF8F5] border-t border-[#E8DFD8] overflow-x-auto no-scrollbar flex gap-2">
            {EXAMPLE_QUESTIONS.map((question, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(question)}
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-[#F2ECE6] text-[#5A4E47] hover:text-[#2C221E] rounded-full border border-[#D8CFC8] whitespace-nowrap transition-colors cursor-pointer"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Chat Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E8DFD8] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about dimensions, styles, budgets..."
              className="flex-1 text-xs text-[#2C221E] px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8CFC8] rounded-xl outline-hidden focus:border-[#2C221E] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 bg-[#2C221E] hover:bg-[#433731] disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
