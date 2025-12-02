import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, Mic, BrainCircuit, MessageCircle } from 'lucide-react';
import { ChatMessage, GeneratedQuestion, TopicData } from '../types';
import { sendMessageToGemini, generateQuizQuestions } from '../services/geminiService';

interface GeminiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: TopicData;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ isOpen, onClose, currentTopic }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz'>('chat');
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'مرحباً بك! أنا مساعد صيدليات المتحدة الذكي. كيف يمكنني مساعدتك في نظام LMS اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Quiz Generator State
  const [quizInput, setQuizInput] = useState('');
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuestion[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Focus input
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, activeTab]);

  const handleSendChat = async () => {
    if (!input.trim() || isChatLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsChatLoading(true);

    // Send with context
    const responseText = await sendMessageToGemini(input, currentTopic);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsChatLoading(false);
  };

  const handleGenerateQuiz = async () => {
    if (!quizInput.trim() || isQuizLoading) return;
    setIsQuizLoading(true);
    const questions = await generateQuizQuestions(quizInput);
    setGeneratedQuiz(questions);
    setIsQuizLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendChat();
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        if (activeTab === 'chat') {
          setInput(speechResult);
        } else {
          setQuizInput(speechResult);
        }
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      alert("عذراً، المتصفح لا يدعم الكتابة بالصوت.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px] animate-fade-in-up border border-slate-200 dark:border-slate-700">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-white">
            <div className="bg-white/20 p-2 rounded-full">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold">المساعد الذكي</h3>
              <p className="text-xs text-teal-100 opacity-90">Context: {currentTopic.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            <MessageCircle size={16} /> محادثة
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'quiz' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            <BrainCircuit size={16} /> صانع الاختبارات
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 relative">

          {/* Chat Mode */}
          {activeTab === 'chat' && (
            <div className="p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                  max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user'
                        ? 'bg-teal-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                      }
                `}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-teal-600" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">جاري الكتابة...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Quiz Generator Mode */}
          {activeTab === 'quiz' && (
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">أدخل النص التعليمي:</label>
                <textarea
                  value={quizInput}
                  onChange={(e) => setQuizInput(e.target.value)}
                  placeholder="الصق هنا نصاً من منهج الصيدلة وسأقوم بتوليد أسئلة MCQ..."
                  className="w-full h-32 p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-purple-200 outline-none resize-none text-sm"
                />
                <div className="flex justify-between">
                  <button
                    onClick={startListening}
                    className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
                  >
                    <Mic size={18} />
                  </button>
                  <button
                    onClick={handleGenerateQuiz}
                    disabled={isQuizLoading || !quizInput.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-2"
                  >
                    {isQuizLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    توليد الأسئلة
                  </button>
                </div>
              </div>

              {generatedQuiz.length > 0 && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 dark:text-white">الأسئلة المقترحة:</h4>
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedQuiz, null, 2))}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      نسخ JSON
                    </button>
                  </div>
                  {generatedQuiz.map((q, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl shadow-sm">
                      <p className="font-bold text-slate-700 dark:text-slate-200 mb-2 text-sm">{idx + 1}. {q.question}</p>
                      <ul className="space-y-1">
                        {q.options.map((opt, i) => (
                          <li key={i} className={`text-xs px-2 py-1 rounded ${opt === q.correctAnswer ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {opt === q.correctAnswer && "✅ "} {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Input Area (Only for Chat) */}
        {activeTab === 'chat' && (
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shrink-0">
            <div className="flex items-center gap-2 relative">
              <button
                onClick={startListening}
                className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
              >
                <Mic size={18} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اسأل عن الكورسات..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900 outline-none transition-all bg-slate-50"
                disabled={isChatLoading}
              />
              <button
                onClick={handleSendChat}
                disabled={!input.trim() || isChatLoading}
                className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <Send size={18} className={document.dir === 'rtl' ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default GeminiAssistant;