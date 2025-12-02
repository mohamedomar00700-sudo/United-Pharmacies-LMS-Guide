import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopicContent from './components/TopicContent';
import GeminiAssistant from './components/GeminiAssistant';
import { TOPICS } from './constants';
import { TopicId, SearchResult, ProgressMap } from './types';
import { Menu, Sparkles, Search, Moon, Sun, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentTopicId, setCurrentTopicId] = useState<TopicId>(TopicId.UPLOAD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Global Features State
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [progress, setProgress] = useState<ProgressMap>({});

  // Init logic (Dark mode & Progress)
  useEffect(() => {
    // Theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Progress
    const loadedProgress: ProgressMap = {};
    TOPICS.forEach(t => {
      const saved = localStorage.getItem(`progress-${t.id}`);
      if (saved) {
        const steps = JSON.parse(saved);
        if (Array.isArray(steps) && steps.length === t.steps.length && t.steps.length > 0) {
          loadedProgress[t.id] = true;
        }
      }
    });
    setProgress(loadedProgress);
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  const handleTopicComplete = (id: TopicId) => {
    setProgress(prev => ({ ...prev, [id]: true }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const q = query.toLowerCase();

    TOPICS.forEach(topic => {
      if (topic.title.toLowerCase().includes(q)) {
        results.push({ topicId: topic.id, topicTitle: topic.title, matchType: 'title', text: topic.description });
      }
      topic.steps.forEach(step => {
        if (step.toLowerCase().includes(q)) {
          results.push({ topicId: topic.id, topicTitle: topic.title, matchType: 'step', text: step });
        }
      });
      topic.faq.forEach(f => {
        if (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)) {
          results.push({ topicId: topic.id, topicTitle: topic.title, matchType: 'faq', text: f.question });
        }
      });
    });

    setSearchResults(results.slice(0, 5)); // Limit results
  };

  const currentTopic = TOPICS.find(t => t.id === currentTopicId) || TOPICS[0];

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden font-cairo transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar
        currentTopic={currentTopicId}
        onSelectTopic={setCurrentTopicId}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        progress={progress}
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col h-full relative">

        {/* Header (Desktop & Mobile combined logic) */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 justify-between shrink-0 z-30 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-slate-800 dark:text-white">LMS Guide</span>
          </div>

          {/* Desktop Spacer / Title */}
          <div className="hidden md:block font-bold text-slate-500 dark:text-slate-400">
            {currentTopic.title}
          </div>

          {/* Actions (Search + Theme) */}
          <div className="flex items-center gap-2">
            {/* Search Bar Container */}
            <div className="relative">
              <div className={`flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg transition-all duration-300 ${isSearchOpen ? 'w-48 md:w-64 px-3' : 'w-10 justify-center bg-transparent dark:bg-transparent'}`}>
                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-slate-500 dark:text-slate-400">
                  <Search size={20} />
                </button>
                {isSearchOpen && (
                  <input
                    autoFocus
                    type="text"
                    placeholder="بحث..."
                    className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                )}
                {isSearchOpen && (
                  <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-1 text-slate-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentTopicId(res.topicId);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-right p-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-50 dark:border-slate-700 last:border-0 flex flex-col"
                    >
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">{res.topicTitle}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-300 truncate w-full">{res.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-yellow-400 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <TopicContent
          topic={currentTopic}
          onComplete={handleTopicComplete}
        />

        {/* Floating AI Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-40 group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ring-2 ring-white/50 dark:ring-slate-800/50"
        >
          <Sparkles className="animate-pulse" size={20} />
          <span className="font-bold text-sm hidden sm:inline">مساعد الذكاء الاصطناعي</span>
        </button>

      </div>

      {/* Chat Modal */}
      <GeminiAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentTopic={currentTopic}
      />
    </div>
  );
};
export default App;