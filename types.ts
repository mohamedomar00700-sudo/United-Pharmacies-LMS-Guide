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
<<<<<<< HEAD
=======
  image?: string; // Base64 image string
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
<<<<<<< HEAD
=======
  explanation: string; // New field for educational reinforcement
>>>>>>> 650212b28125bfaa8c3ba1f6db45eae4d9555322
}

export interface SearchResult {
  topicId: TopicId;
  topicTitle: string;
  matchType: 'title' | 'step' | 'faq' | 'tip';
  text: string;
}

export type ProgressMap = Record<string, boolean>; // topicId -> isCompleted