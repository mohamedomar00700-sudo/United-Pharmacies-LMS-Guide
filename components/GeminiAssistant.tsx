import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Sparkles, Mic, BrainCircuit, MessageCircle, Paperclip, FileText, Trash2, Settings2, ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, GeneratedQuestion, TopicData } from '../types';
import { sendMessageToGemini, generateQuizQuestions, fileToBase64 } from '../services/geminiService';

interface GeminiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: TopicData;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ isOpen, onClose, currentTopic }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'quiz'>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'مرحباً بك! أنا مساعد صيدليات المتحدة الذكي. يمكنك سؤالي أو إرسال صورة (Screenshot) للمشكلة التي تواجهها.' }
  ]);
  const [input, setInput] = useState('');
  const [chatImage, setChatImage] = useState<File | null>(null);
  const [chatImagePreview, setChatImagePreview] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Quiz Generator State
  const [quizInput, setQuizInput] = useState('');
  const [quizFile, setQuizFile] = useState<File | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuestion[]>([]);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [revealedExplanations, setRevealedExplanations] = useState<number[]>([]);
  
  // Quiz Settings
  const [quizCount, setQuizCount] = useState(3);
  const [quizType, setQuizType] = useState<'mcq' | 'tf'>('mcq');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatImageInputRef = useRef<HTMLInputElement>(null);

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

  // --- Chat Logic ---
  const handleSendChat = async () => {
    if ((!input.trim() && !chatImage) || isChatLoading) return;

    let imageBase64: string | undefined = undefined;
    if (chatImage) {
       imageBase64 = await fileToBase64(chatImage);
    }

    const userMessage: ChatMessage = { 
      role: 'user', 
      text: input || (chatImage ? 'Sent an image' : ''), 
      image: chatImagePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setChatImage(null);
    setChatImagePreview(null);
    setIsChatLoading(true);

    // Send with context
    const responseText = await sendMessageToGemini(userMessage.text, imageBase64, currentTopic);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsChatLoading(false);
  };

  const handleChatImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setChatImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setChatImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // --- Quiz Logic ---
  const handleGenerateQuiz = async () => {
    if ((!quizInput.trim() && !quizFile) || isQuizLoading) return;
    setIsQuizLoading(true);
    setGeneratedQuiz([]); 
    setRevealedExplanations([]);
    
    const contentToProcess = quizFile ? quizFile : quizInput;
    const questions = await generateQuizQuestions(contentToProcess, quizCount, quizType);
    
    setGeneratedQuiz(questions);
    setIsQuizLoading(false);
  };

  const toggleExplanation = (idx: number) => {
     setRevealedExplanations(prev => 
       prev.includes(idx) ? prev : [...prev, idx]
     );
  };

  // --- Shared Logic ---
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setQuizFile(e.target.files[0]);
      setQuizInput(''); 
    }
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
          if (!quizFile) {
            setQuizInput(speechResult);
          }
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
                    {msg.image && (
                      <img src={msg.image} alt="User Upload" className="rounded-lg mb-2 max-h-40 object-contain bg-black/10" />
                    )}
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <ReactMarkdown 
                        className="prose prose-sm dark:prose-invert max-w-none prose-p:mb-2 last:prose-p:mb-0 prose-ul:list-disc prose-ul:mr-5 prose-ol:list-decimal prose-ol:mr-5"
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
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
                 <label className="text-sm font-bold text-slate-700 dark:text-slate-300">المحتوى المصدري:</label>
                 
                 {/* File Upload Input (Hidden) */}
                 <input 
                   type="file"
                   ref={fileInputRef}
                   onChange={handleFileChange}
                   className="hidden"
                   accept=".pdf,.txt,.md,.csv"
                 />

                 {quizFile ? (
                   <div className="w-full h-24 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-3 relative group">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <FileText className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">{quizFile.name}</p>
                            <p className="text-xs text-slate-400">{(quizFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => { setQuizFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                       className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                       title="إزالة الملف"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                 ) : (
                    <textarea 
                        value={quizInput}
                        onChange={(e) => setQuizInput(e.target.value)}
                        placeholder="الصق هنا نصاً من منهج الصيدلة (أو ارفع ملف PDF)..."
                        className="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-purple-200 outline-none resize-none text-sm transition-all"
                    />
                 )}

                 {/* Controls Row */}
                 <div className="flex gap-3 pt-2">
                    <div className="flex-1">
                        <label className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                           <Settings2 size={12} />
                           العدد
                        </label>
                        <input 
                           type="number" 
                           min="1" 
                           max="10" 
                           value={quizCount} 
                           onChange={(e) => setQuizCount(parseInt(e.target.value))}
                           className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white outline-none focus:border-purple-400"
                        />
                    </div>
                    <div className="flex-[2]">
                        <label className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                           <BrainCircuit size={12} />
                           النوع
                        </label>
                        <select 
                           value={quizType}
                           onChange={(e) => setQuizType(e.target.value as 'mcq' | 'tf')}
                           className="w-full p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg dark:bg-slate-800 dark:text-white outline-none focus:border-purple-400"
                        >
                            <option value="mcq">اختيار من متعدد (MCQ)</option>
                            <option value="tf">صح أم خطأ (True/False)</option>
                        </select>
                    </div>
                 </div>

                 <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                    <div className="flex gap-2">
                        <button 
                            onClick={startListening}
                            disabled={!!quizFile}
                            className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'} disabled:opacity-30 disabled:cursor-not-allowed`}
                            title="كتابة بالصوت"
                        >
                            <Mic size={18} />
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-2 rounded-full transition-colors ${quizFile ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
                            title="رفع ملف"
                        >
                            <Paperclip size={18} />
                        </button>
                    </div>

                    <button 
                      onClick={handleGenerateQuiz}
                      disabled={isQuizLoading || (!quizInput.trim() && !quizFile)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm shadow-purple-200 dark:shadow-none"
                    >
                      {isQuizLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      توليد الأسئلة
                    </button>
                 </div>
               </div>

               {generatedQuiz.length > 0 && (
                 <div className="space-y-4 animate-fade-in-up pb-4">
                   <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                      <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <CheckCircleIcon className="text-green-500" size={16} />
                        النتائج ({generatedQuiz.length})
                      </h4>
                      <button 
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedQuiz, null, 2))}
                        className="text-xs font-medium text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors"
                      >
                        نسخ JSON
                      </button>
                   </div>
                   {generatedQuiz.map((q, idx) => (
                     <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                       <p className="font-bold text-slate-700 dark:text-slate-200 mb-3 text-sm leading-relaxed">
                         <span className="text-purple-600 ml-1">.{(idx + 1).toLocaleString('ar-EG')}</span> 
                         {q.question}
                       </p>
                       <ul className="space-y-2 mb-3">
                         {q.options.map((opt, i) => (
                           <li 
                             key={i} 
                             onClick={() => toggleExplanation(idx)}
                             className={`
                               text-xs px-3 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer
                               ${revealedExplanations.includes(idx) 
                                 ? (opt === q.correctAnswer 
                                     ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' 
                                     : 'bg-slate-50 text-slate-400 border border-slate-100 dark:bg-slate-800/50 dark:text-slate-600 dark:border-slate-700 opacity-60'
                                   )
                                 : 'bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                               }
                             `}
                           >
                             {(revealedExplanations.includes(idx) && opt === q.correctAnswer) ? (
                               <CheckCircleIcon size={14} className="shrink-0" />
                             ) : (
                               <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-500 shrink-0" />
                             )}
                             {opt}
                           </li>
                         ))}
                       </ul>
                       {revealedExplanations.includes(idx) && (
                         <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-lg text-xs text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 animate-fade-in-up">
                           <span className="font-bold">💡 التوضيح: </span> 
                           {q.explanation}
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
               )}
            </div>
          )}

        </div>

        {/* Input Area (Only for Chat) */}
        {activeTab === 'chat' && (
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shrink-0 flex flex-col gap-2">
            
            {/* Image Preview */}
            {chatImagePreview && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg w-fit border border-slate-200 dark:border-slate-700 animate-fade-in-up">
                <img src={chatImagePreview} alt="Preview" className="w-10 h-10 rounded object-cover" />
                <span className="text-xs text-slate-500 max-w-[150px] truncate">{chatImage?.name}</span>
                <button onClick={() => { setChatImage(null); setChatImagePreview(null); }} className="p-1 text-red-500 hover:bg-red-100 rounded">
                   <X size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 relative">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={chatImageInputRef}
                onChange={handleChatImageSelect}
              />
              <button
                onClick={() => chatImageInputRef.current?.click()}
                className={`p-3 rounded-xl transition-colors ${chatImage ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
                title="إرفاق صورة"
              >
                <ImageIcon size={18} />
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
                onClick={startListening}
                className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}
              >
                 <Mic size={18} />
              </button>

              <button
                onClick={handleSendChat}
                disabled={(!input.trim() && !chatImage) || isChatLoading}
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

const CheckCircleIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default GeminiAssistant;