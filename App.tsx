import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopicContent from './components/TopicContent';
import GeminiAssistant from './components/GeminiAssistant';
import { TOPICS } from './constants';
import { TopicId } from './types';
import { Menu, Sparkles, Search, Moon, Sun, X } from 'lucide-react';
import { useGlobal } from './context/GlobalContext';

const Layout: React.FC = () => {
  const { 
    isSidebarOpen, setIsSidebarOpen, 
    isChatOpen, setIsChatOpen,
    darkMode, toggleDarkMode,
    searchQuery, setSearchQuery,
    searchResults,
    isSearchOpen, setIsSearchOpen
  } = useGlobal();

  const location = useLocation();
  const navigate = useNavigate();

  // Determine current topic from URL
  const currentTopicId = location.pathname.replace('/topic/', '') as TopicId;
  const currentTopic = TOPICS.find(t => t.id === currentTopicId) || TOPICS[0];

  const handleSearchResultClick = (res: any) => {
    navigate(`/topic/${res.topicId}?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden font-cairo transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar 
        currentTopic={currentTopicId} 
      />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col h-full relative">
        
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 justify-between shrink-0 z-30 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-slate-800 dark:text-white text-sm">صيدليات المتحدة</span>
          </div>

          {/* Desktop Title */}
          <div className="hidden md:block font-bold text-slate-500 dark:text-slate-400">
             {currentTopic.title}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
             {/* Search Bar */}
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
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  )}
                  {isSearchOpen && (
                    <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-1 text-slate-400 hover:text-red-500">
                      <X size={14} />
                    </button>
                  )}
                </div>
                
                {/* Results Dropdown */}
                {isSearchOpen && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
                    {searchResults.map((res, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleSearchResultClick(res)}
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

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<Navigate to={`/topic/${TOPICS[0].id}`} replace />} />
            <Route path="/topic/:topicId" element={<TopicContent />} />
          </Routes>
        </div>

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

export default Layout;