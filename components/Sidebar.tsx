import React from 'react';
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
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-72 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-xl z-50 
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:shadow-none
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
          </div>

          {/* Navigation List */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
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
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                    }
                  `}
                >
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
export default Sidebar;