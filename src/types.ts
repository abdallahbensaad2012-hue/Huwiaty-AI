/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'ar' | 'en' | 'fr';

export interface UserProfile {
  name: string;
  age: number;
  country: string;
  education: string;
  interests: string[];
  dream: string;
  skills: string[];
  goals: string[];
  challenges: string[];
  language: Language;
}

export interface MentorChatEntry {
  sender: 'user' | 'mentor';
  text: string;
  timestamp: number;
  audioBase64?: string; // Optional TTS audio content
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
  category: 'Identity' | 'Education' | 'Leadership' | 'Entrepreneurship' | 'Creativity' | 'Confidence';
  xpReward: number;
}

export interface Roadmap {
  milestones: RoadmapMilestone[];
  currentLevel: number;
  totalXp: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: { ar: string; en: string; fr: string };
  description: { ar: string; en: string; fr: string };
  icon: string;
  unlockedAt?: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  completed: boolean;
}

export interface DailyContent {
  motivation: string;
  mission: DailyMission;
  challenge: {
    title: string;
    description: string;
    xpReward: number;
    completed: boolean;
  };
  inspiringStory: {
    title: string;
    womanName: string;
    era: string;
    content: string;
  };
  heritage: {
    title: string;
    significance: string;
    content: string;
  };
  opportunity: {
    title: string;
    description: string;
    type: string; // e.g., 'Scholarship', 'Competition', 'Workshop'
  };
  reflection: string;
  date: string;
}

export interface MentorMemory {
  id: string;
  memory_type: 'Goal' | 'Preference' | 'Skill' | 'Achievement' | 'Milestone';
  content: string;
  importance_level: 'low' | 'medium' | 'high';
  createdAt: number;
}

export interface UserState {
  profile: UserProfile | null;
  onboardingStep: 'welcome' | 'language' | 'info' | 'assessment' | 'completed';
  assessmentConversation: MentorChatEntry[];
  roadmap: Roadmap | null;
  dailyContent: DailyContent | null;
  mentorConversation: MentorChatEntry[];
  lastDailyUpdate: string | null; // Date string 'YYYY-MM-DD'
  completedActions: string[]; // List of custom keys like 'mission_2026-07-14', 'challenge_2026-07-14'
  mentorMemories?: MentorMemory[]; // Long term memory store
}
