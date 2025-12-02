import React from 'react';
<<<<<<< HEAD
import { TOPICS } from '../constants';
import { TopicId, ProgressMap } from '../types';
import { ChevronLeft, GraduationCap, CheckCircle } from 'lucide-react';

interface SidebarProps {
  currentTopic: TopicId;
  onSelectTopic: (id: TopicId) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  progress: ProgressMap;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTopic, onSelectTopic, isOpen, toggleSidebar, progress }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
=======
import { NavLink } from 'react-router-dom';
import { TOPICS } from '../constants';
import { TopicId } from '../types';
import { ChevronLeft, CheckCircle, GraduationCap } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

interface SidebarProps {
  currentTopic: TopicId;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTopic }) => {
  const { isSidebarOpen, setIsSidebarOpen, progress, overallProgress } = useGlobal();

  // Circular Progress Bar Logic
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
        />
      )}

      {/* Sidebar Container */}
<<<<<<< HEAD
      <aside
=======
      <aside 
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
        className={`
          fixed top-0 right-0 h-full w-72 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-xl z-50 
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:shadow-none
<<<<<<< HEAD
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-teal-600 to-teal-800 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">صيدليات المتحدة</h1>
                <p className="text-xs text-teal-100 opacity-90">LMS Knowledge Base</p>
              </div>
            </div>
=======
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header with Overall Progress */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-teal-600 to-teal-800 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <GraduationCap size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-tight">صيدليات المتحدة</h1>
                  <p className="text-xs text-teal-100 opacity-90">LMS Knowledge Base</p>
                </div>
              </div>
            </div>
            
            {/* Overall Progress Indicator */}
            <div className="flex items-center gap-4 bg-black/10 p-3 rounded-lg backdrop-blur-sm">
               <div className="relative w-12 h-12 shrink-0">
                  <svg className="transform -rotate-90 w-12 h-12">
                    <circle
                      cx="24" cy="24" r={radius}
                      stroke="currentColor" strokeWidth="4" fill="transparent"
                      className="text-white/20"
                    />
                    <circle
                      cx="24" cy="24" r={radius}
                      stroke="currentColor" strokeWidth="4" fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="text-white transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    {overallProgress}%
                  </div>
               </div>
               <div>
                 <p className="text-sm font-bold">تقدمك العام</p>
                 <p className="text-xs text-teal-100">أكمل المسار التعليمي</p>
               </div>
            </div>
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
          </div>

          {/* Navigation List */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
<<<<<<< HEAD
              const isActive = currentTopic === topic.id;
              const isCompleted = progress[topic.id];

              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.id);
                    if (window.innerWidth < 768) toggleSidebar();
                  }}
                  className={`
                    w-full flex items-center gap-4 p-3 rounded-xl text-right transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 shadow-sm ring-1 ring-teal-200 dark:ring-teal-800'
=======
              const isCompleted = progress[topic.id];
              
              return (
                <NavLink
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  onClick={() => {
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={({ isActive }) => `
                    w-full flex items-center gap-4 p-3 rounded-xl text-right transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 shadow-sm ring-1 ring-teal-200 dark:ring-teal-800' 
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                    }
                  `}
                >
<<<<<<< HEAD
                  <div className={`
                    p-2 rounded-lg transition-colors relative
                    ${isActive
                      ? 'bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-300 group-hover:shadow-sm'}
                  `}>
                    <Icon size={20} />
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white dark:border-slate-800">
                        <CheckCircle size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <span className="font-medium flex-1 truncate">{topic.title}</span>
                  {isActive && <ChevronLeft size={16} className="text-teal-500 dark:text-teal-400" />}
                </button>
=======
                  {({ isActive }) => (
                    <>
                      <div className={`
                        p-2 rounded-lg transition-colors relative
                        ${isActive 
                          ? 'bg-teal-100 dark:bg-teal-800 text-teal-700 dark:text-teal-300' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-600 group-hover:text-teal-600 dark:group-hover:text-teal-300 group-hover:shadow-sm'}
                      `}>
                        <Icon size={20} />
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white dark:border-slate-800">
                            <CheckCircle size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium flex-1 truncate">{topic.title}</span>
                      {isActive && <ChevronLeft size={16} className="text-teal-500 dark:text-teal-400" />}
                    </>
                  )}
                </NavLink>
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} United Pharmacies
          </div>
        </div>
      </aside>
    </>
  );
};
<<<<<<< HEAD
=======

>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
export default Sidebar;