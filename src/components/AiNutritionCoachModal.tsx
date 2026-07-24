import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, X, MessageSquare } from 'lucide-react';
import { UserProfile } from '../types';

interface AiNutritionCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export const AiNutritionCoachModal: React.FC<AiNutritionCoachModalProps> = ({
  isOpen,
  onClose,
  userProfile,
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `أهلاً بك يا ${userProfile.name}! أنا "مستشار رشاقة الذكي". كيف يمكنني مساعدتك اليوم في خطتك التغذوية أو رحلة تنزيل الوزن؟`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    const updatedHistory = [...messages, { role: 'user' as const, content: userText }];
    setMessages(updatedHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/nutrition-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userText,
          userProfile,
          chatHistory: updatedHistory,
        })
      });

      const data = await response.json();
      const reply = data.reply || 'عذراً، لم أستطع معالجة السؤال حالياً.';
      setMessages([...updatedHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...updatedHistory, { role: 'assistant', content: 'حدث خطأ في الاتصال، يمكنك المحاولة مرة أخرى.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[600px] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-800 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">مستشار رشاقة التغذوي الذكي</h3>
              <p className="text-[11px] text-emerald-200">إجابات علمية مخصصة لأهدافك في تنزيل الوزن</p>
            </div>
          </div>

          <button onClick={onClose} className="text-white/80 hover:text-white font-bold text-lg p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 ${
                msg.role === 'user' ? 'bg-emerald-600' : 'bg-slate-900'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed font-medium ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white font-bold rounded-tl-none'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tr-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs p-2">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>جاري كتابة الإجابة التغذوية...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اسأل المستشار التغذوي (مثلاً: ما هي أفضل السناكات المسموحة في الكيتو؟)..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-emerald-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl cursor-pointer transition-all flex items-center gap-1 font-bold text-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
