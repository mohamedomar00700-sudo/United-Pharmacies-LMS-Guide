import { LucideIcon } from 'lucide-react';

export enum TopicId {
  UPLOAD = 'upload',
  COURSE_SETUP = 'course_setup',
  QUIZ_SETUP = 'quiz_setup',
  REPORTS = 'reports',
  USERS = 'users',
  TROUBLESHOOTING = 'troubleshooting',
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TopicData {
  id: TopicId;
  title: string;
  icon: LucideIcon;
  description: string;
  steps: string[];
  faq: FAQItem[];
  tips: string[];
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface SearchResult {
  topicId: TopicId;
  topicTitle: string;
  matchType: 'title' | 'step' | 'faq' | 'tip';
  text: string;
}

export type ProgressMap = Record<string, boolean>; // topicId -> isCompleted