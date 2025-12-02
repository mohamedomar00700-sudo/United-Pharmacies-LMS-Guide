import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TOPICS } from '../constants';
import { ProgressMap, SearchResult, TopicId } from '../types';

interface GlobalContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  progress: ProgressMap;
  markTopicComplete: (id: TopicId) => void;
  overallProgress: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: SearchResult[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme State
  const [darkMode, setDarkMode] = useState(false);
  
  // Progress State
  const [progress, setProgress] = useState<ProgressMap>({});
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initialize Theme and Progress
  useEffect(() => {
    // Theme Logic
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Load Progress
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

  const markTopicComplete = (id: TopicId) => {
    setProgress(prev => ({ ...prev, [id]: true }));
  };

  // Calculate Overall Progress
  const completedCount = Object.values(progress).filter(Boolean).length;
  const overallProgress = Math.round((completedCount / TOPICS.length) * 100);

  // Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const q = searchQuery.toLowerCase();

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

    setSearchResults(results.slice(0, 5));
  }, [searchQuery]);

  return (
    <GlobalContext.Provider value={{
      darkMode,
      toggleDarkMode,
      progress,
      markTopicComplete,
      overallProgress,
      searchQuery,
      setSearchQuery,
      searchResults,
      isSearchOpen,
      setIsSearchOpen,
      isSidebarOpen,
      setIsSidebarOpen,
      isChatOpen,
      setIsChatOpen
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobal must be used within a GlobalProvider');
  return context;
};