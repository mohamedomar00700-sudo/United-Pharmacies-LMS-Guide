import React, { useState, useEffect } from 'react';
import { TopicData, TopicId } from '../types';
import { 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  PlayCircle, 
  FileText, 
  Presentation, 
  AlertTriangle,
  Square,
  CheckSquare,
  Image as ImageIcon,
  X,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check
} from 'lucide-react';

interface TopicContentProps {
  topic: TopicData;
  onComplete: (id: TopicId) => void;
}

const TopicContent: React.FC<TopicContentProps> = ({ topic, onComplete }) => {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [showScreenshot, setShowScreenshot] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Reset state when topic changes
  useEffect(() => {
    const savedSteps = localStorage.getItem(`progress-${topic.id}`);
    if (savedSteps) {
      setCheckedSteps(JSON.parse(savedSteps));
    } else {
      setCheckedSteps([]);
    }
    setFeedbackGiven(null);
  }, [topic.id]);

  // Update progress on step check
  useEffect(() => {
    localStorage.setItem(`progress-${topic.id}`, JSON.stringify(checkedSteps));
    if (checkedSteps.length === topic.steps.length && topic.steps.length > 0) {
      onComplete(topic.id);
    }
  }, [checkedSteps, topic.id, topic.steps.length, onComplete]);

  const toggleStep = (index: number) => {
    setCheckedSteps(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };
  
  // Helper to determine styles based on topic color
  const getColorClasses = (baseColor: string) => {
    const colors: Record<string, string> = {
      sky: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800',
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
      purple: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
      blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
      amber: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    };
    return colors[baseColor] || colors.sky;
  };

  const renderUploadIcons = () => (
    <div className="flex gap-4 mb-6 justify-center sm:justify-start">
      <div className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm w-24">
        <PlayCircle className="text-red-500" size={28} />
        <span className="text-xs font-medium dark:text-slate-300">Video</span>
      </div>
      <div className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm w-24">
        <FileText className="text-blue-500" size={28} />
        <span className="text-xs font-medium dark:text-slate-300">PDF</span>
      </div>
      <div className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm w-24">
        <Presentation className="text-orange-500" size={28} />
        <span className="text-xs font-medium dark:text-slate-300">PPT</span>
      </div>
    </div>
  );

  return (
    <main className="flex-1 h-full overflow-y-auto bg-slate-50/50 dark:bg-slate-900 p-6 md:p-12 scroll-smooth transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-10 pb-20">
        
        {/* Header Section */}
        <header className="space-y-4 fade-in-up" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl shadow-sm ${getColorClasses(topic.color)}`}>
              <topic.icon size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{topic.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-lg">{topic.description}</p>
            </div>
          </div>
          <hr className="border-slate-200 dark:border-slate-700" />
        </header>

        {/* Special Upload Icons if active */}
        {topic.id === TopicId.UPLOAD && (
           <div className="fade-in-up" style={{ animationDelay: '100ms' }}>
             {renderUploadIcons()}
           </div>
        )}

        {/* Steps Section */}
        <section className="fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
              <CheckCircle2 className="text-teal-600 dark:text-teal-400" size={24} />
              خطوات عملية (Checklist)
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {checkedSteps.length} / {topic.steps.length} مكتمل
            </span>
          </div>
          
          <div className="grid gap-4 relative">
            {/* Vertical Line for desktop */}
            <div className="absolute top-4 bottom-4 right-6 w-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

            {topic.steps.map((step, index) => {
               const isChecked = checkedSteps.includes(index);
               return (
                <div 
                  key={index} 
                  className={`relative flex flex-col md:flex-row gap-4 md:gap-8 items-start group transition-opacity ${isChecked ? 'opacity-60' : 'opacity-100'}`}
                >
                  {/* Checkbox Number Badge */}
                  <button 
                    onClick={() => toggleStep(index)}
                    className={`
                      hidden md:flex z-10 w-12 h-12 shrink-0 items-center justify-center rounded-full 
                      border-4 text-lg font-bold shadow-sm transition-all duration-300
                      hover:scale-110 cursor-pointer
                      ${isChecked 
                        ? 'bg-teal-600 border-teal-100 text-white' 
                        : 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-900 text-slate-600 dark:text-slate-300'
                      }
                    `}
                  >
                    {isChecked ? <CheckSquare size={20} /> : index + 1}
                  </button>

                  {/* Step Card */}
                  <div className="flex-1 w-full">
                    <div className={`
                        p-5 rounded-xl border shadow-sm transition-all duration-200 relative overflow-hidden
                        ${isChecked 
                          ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700' 
                          : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-teal-100 dark:hover:border-teal-800'
                        }
                      `}
                      onClick={() => window.innerWidth < 768 && toggleStep(index)}
                    >
                        {/* Mobile Number/Check */}
                        <div className={`
                          md:hidden absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-bold 
                          ${isChecked ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}
                        `}>
                          {isChecked ? <Check size={12} /> : index + 1}
                        </div>
                        
                        <div className="flex items-start justify-between gap-4">
                          {topic.id === TopicId.TROUBLESHOOTING ? (
                             <div className="flex items-start gap-3">
                                <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={20} />
                                <p className={`leading-relaxed font-medium ${isChecked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{step}</p>
                             </div>
                          ) : (
                            <p className={`leading-relaxed text-lg ${isChecked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{step}</p>
                          )}

                          {/* View Example Button */}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowScreenshot(step);
                            }}
                            className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors hidden sm:block"
                            title="عرض مثال (Screenshot)"
                          >
                            <ImageIcon size={20} />
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
               );
            })}
          </div>
        </section>

        {/* FAQ Section */}
        {topic.faq.length > 0 && (
          <section className="fade-in-up" style={{ animationDelay: '300ms' }}>
            <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              <HelpCircle className="text-blue-500" size={24} />
              الأسئلة الشائعة (FAQ)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {topic.faq.map((item, idx) => (
                <div key={idx} className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-5 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group relative">
                  <button 
                    onClick={() => handleCopy(`${item.question}\n${item.answer}`, idx)}
                    className="absolute top-3 left-3 text-blue-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedIndex === idx ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 text-sm md:text-base flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                    {item.question}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm pr-4 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tips Section */}
        <section className="fade-in-up" style={{ animationDelay: '450ms' }}>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-6 relative overflow-hidden">
            {/* Decoration Icon */}
            <Lightbulb className="absolute -left-4 -top-4 text-amber-200 dark:text-amber-800 opacity-50 rotate-12" size={100} />
            
            <div className="relative z-10">
              <h3 className="flex items-center gap-2 text-lg font-bold text-amber-800 dark:text-amber-400 mb-4">
                <Lightbulb className="text-amber-500" size={24} />
                نصائح إضافية (Tips)
              </h3>
              <ul className="space-y-3">
                {topic.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-black/20 p-3 rounded-lg border border-amber-100/50 dark:border-amber-800/30">
                    <div className="w-1.5 h-1.5 mt-2.5 rounded-full bg-amber-400 shrink-0"></div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="flex flex-col items-center justify-center pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">هل كان هذا المحتوى مفيداً؟</p>
          <div className="flex gap-4">
            <button 
              onClick={() => setFeedbackGiven('up')}
              className={`p-3 rounded-full transition-all ${feedbackGiven === 'up' ? 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
            >
              <ThumbsUp size={20} />
            </button>
            <button 
               onClick={() => setFeedbackGiven('down')}
               className={`p-3 rounded-full transition-all ${feedbackGiven === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
            >
              <ThumbsDown size={20} />
            </button>
          </div>
          {feedbackGiven && (
            <p className="text-teal-600 dark:text-teal-400 text-xs mt-3 animate-fade-in-up">شكراً لملاحظاتك! سنعمل على تحسين المحتوى.</p>
          )}
        </section>

      </div>

      {/* Screenshot Modal */}
      {showScreenshot && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in-up"
          onClick={() => setShowScreenshot(null)}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-5xl w-full overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 z-10">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2 truncate">
                <ImageIcon size={20} className="text-teal-500" />
                مثال توضيحي
              </h3>
              <button 
                onClick={() => setShowScreenshot(null)} 
                className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100 dark:bg-black/20 p-4 md:p-8 flex items-center justify-center">
              <img 
                src={`https://placehold.co/1200x700/e2e8f0/475569.png?text=LMS+System+Screenshot&font=roboto`}
                alt="LMS Screenshot"
                className="rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 max-w-full h-auto object-contain"
              />
            </div>
             <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 text-center shrink-0 text-xs text-slate-400">
              {showScreenshot}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TopicContent;