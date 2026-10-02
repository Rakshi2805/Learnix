import { AILevel, LearningGoal, LearningPace } from './learner';

export type TopicStatus = 'Current' | 'Locked' | 'Completed';

export interface RoadmapTopic {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  difficulty: AILevel;
  estimatedTime: string;
  status: TopicStatus;
  introduction: string;
  objectives: [string, string, string];
}

export interface PersonalisedRoadmap {
  goal: LearningGoal;
  detectedLevel: AILevel;
  learningPace: LearningPace;
  score: number;
  scoreMessage: string;
  topics: RoadmapTopic[];
}