import { RoadmapTopic } from '../types/roadmap';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
}

const machineLearningQuiz: QuizQuestion[] = [
  {
    id: 'ml-q1',
    question: 'What is machine learning mainly used for?',
    options: [
      { id: 'a', text: 'Learning patterns from data' },
      { id: 'b', text: 'Only storing files' },
      { id: 'c', text: 'Creating web pages without code' },
      { id: 'd', text: 'Replacing computer hardware' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'ml-q2',
    question: 'Which type of learning uses labelled training data?',
    options: [
      { id: 'a', text: 'Unsupervised learning' },
      { id: 'b', text: 'Supervised learning' },
      { id: 'c', text: 'Random learning' },
      { id: 'd', text: 'Manual learning' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'ml-q3',
    question: 'What is a feature in machine learning?',
    options: [
      { id: 'a', text: 'An input variable used by a model' },
      { id: 'b', text: 'The final prediction only' },
      { id: 'c', text: 'A programming language' },
      { id: 'd', text: 'A database server' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'ml-q4',
    question: 'Why do we split data into training and testing sets?',
    options: [
      { id: 'a', text: 'To make the computer faster' },
      { id: 'b', text: 'To evaluate how well the model generalizes' },
      { id: 'c', text: 'To remove all features' },
      { id: 'd', text: 'To avoid using an algorithm' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'ml-q5',
    question: 'What does a model prediction represent?',
    options: [
      { id: 'a', text: 'The output produced by the trained model' },
      { id: 'b', text: 'The original dataset' },
      { id: 'c', text: 'The source code editor' },
      { id: 'd', text: 'The database password' },
    ],
    correctAnswer: 'a',
  },
];

const aiFundamentalsQuiz: QuizQuestion[] = [
  {
    id: 'ai-q1',
    question: 'What does AI stand for?',
    options: [
      { id: 'a', text: 'Artificial Intelligence' },
      { id: 'b', text: 'Automated Internet' },
      { id: 'c', text: 'Advanced Input' },
      { id: 'd', text: 'Artificial Internet' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'ai-q2',
    question: 'Which is an example of AI?',
    options: [
      { id: 'a', text: 'A recommendation system' },
      { id: 'b', text: 'A simple light switch' },
      { id: 'c', text: 'A USB cable' },
      { id: 'd', text: 'A keyboard key' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'ai-q3',
    question: 'Machine learning is a part of which field?',
    options: [
      { id: 'a', text: 'Artificial Intelligence' },
      { id: 'b', text: 'Networking only' },
      { id: 'c', text: 'Operating systems only' },
      { id: 'd', text: 'Computer hardware only' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'ai-q4',
    question: 'What does a dataset contain?',
    options: [
      { id: 'a', text: 'Collection of data used for analysis or learning' },
      { id: 'b', text: 'Only passwords' },
      { id: 'c', text: 'Only source code' },
      { id: 'd', text: 'Only images' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'ai-q5',
    question: 'What is the purpose of an AI model?',
    options: [
      { id: 'a', text: 'To learn patterns and produce useful outputs' },
      { id: 'b', text: 'To replace the operating system' },
      { id: 'c', text: 'To store passwords' },
      { id: 'd', text: 'To increase screen brightness' },
    ],
    correctAnswer: 'a',
  },
];

const deepLearningQuiz: QuizQuestion[] = [
  {
    id: 'dl-q1',
    question: 'What type of network is commonly used in deep learning?',
    options: [
      { id: 'a', text: 'Neural network' },
      { id: 'b', text: 'Ethernet cable' },
      { id: 'c', text: 'Database table' },
      { id: 'd', text: 'File system' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'dl-q2',
    question: 'What is a neural network inspired by?',
    options: [
      { id: 'a', text: 'The way biological neurons process information' },
      { id: 'b', text: 'A computer keyboard' },
      { id: 'c', text: 'A database schema' },
      { id: 'd', text: 'A web browser' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'dl-q3',
    question: 'What is a neural network trained to do?',
    options: [
      { id: 'a', text: 'Learn patterns from examples' },
      { id: 'b', text: 'Only store documents' },
      { id: 'c', text: 'Replace computer memory' },
      { id: 'd', text: 'Manage network cables' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'dl-q4',
    question: 'What is an epoch in neural network training?',
    options: [
      { id: 'a', text: 'One complete pass through the training data' },
      { id: 'b', text: 'A type of database' },
      { id: 'c', text: 'A programming language' },
      { id: 'd', text: 'A hardware component' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'dl-q5',
    question: 'What is the purpose of a loss function?',
    options: [
      { id: 'a', text: 'Measure how far predictions are from the target' },
      { id: 'b', text: 'Store user accounts' },
      { id: 'c', text: 'Create a web page' },
      { id: 'd', text: 'Connect to Wi-Fi' },
    ],
    correctAnswer: 'a',
  },
];

export function getQuizForTopic(topic: RoadmapTopic): QuizQuestion[] {
  const title = topic.title.toLowerCase();
  const description = topic.description.toLowerCase();

  if (
    title.includes('deep learning') ||
    title.includes('neural') ||
    description.includes('deep learning')
  ) {
    return deepLearningQuiz;
  }

  if (
    title.includes('machine learning') ||
    title.includes('supervised') ||
    title.includes('classification') ||
    title.includes('regression') ||
    title.includes('feature') ||
    title.includes('model') ||
    description.includes('machine learning')
  ) {
    return machineLearningQuiz;
  }

  return aiFundamentalsQuiz;
}