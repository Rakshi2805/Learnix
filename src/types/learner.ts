export type AILevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LearningGoal = 
  | 'AI Fundamentals' 
  | 'Machine Learning' 
  | 'Deep Learning' 
  | 'AI/ML Interviews';

export type LearningPace = 'Quick' | 'Balanced' | 'Detailed';

export interface LearnerProfile {
  name: string;
  currentLevel: AILevel | '';
  learningGoal: LearningGoal | '';
  learningPace: LearningPace | '';
}

export interface QuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface DiagnosticResult {
  learnerName: string;
  score: number;
  totalQuestions: number;
  detectedLevel: AILevel;
  profile: LearnerProfile;
  submittedAt: string;
}

export const DIAGNOSTIC_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Difference between AI and ML',
    question: 'Which of the following best describes the difference between Artificial Intelligence (AI) and Machine Learning (ML)?',
    options: [
      'AI and ML are exact synonyms and can be used interchangeably in all software engineering.',
      'AI is the broad field of building intelligent systems, while ML is a subset of AI where systems learn patterns from data.',
      'ML is the broad vision, and AI is specifically limited to convolutional neural networks.',
      'AI applies only to hardware robotics, while ML applies exclusively to web development.'
    ],
    correctAnswerIndex: 1,
    explanation: 'AI is the umbrella discipline of machines mimicking human intelligence; ML is a core method within AI that uses data to train models rather than hardcoding rules.'
  },
  {
    id: 2,
    topic: 'Supervised Learning',
    question: 'What is the defining characteristic of a Supervised Learning task?',
    options: [
      'The algorithm trains on labeled data consisting of known input-output pairs.',
      'The model discovers hidden clusters in raw data without any target labels.',
      'The agent learns optimal actions solely via trial-and-error environmental reward signals.',
      'The model requires zero data and infers logic directly from computer hardware.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Supervised learning algorithms are provided with inputs alongside the ground-truth targets/labels (e.g., predicting house prices from features).'
  },
  {
    id: 3,
    topic: 'Training Data',
    question: 'Why is a dataset split into training and testing sets before training a machine learning model?',
    options: [
      'To prevent the computer from exceeding memory limits during compilation.',
      'To evaluate how accurately the model generalizes to new, unseen real-world data.',
      'To guarantee that training loss reaches exactly zero every time.',
      'Because training data must always be in Python, while testing data must be in C++.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Holding out a test set allows us to objectively assess generalization performance and ensure the model does not merely memorize the training set.'
  },
  {
    id: 4,
    topic: 'Neural Networks',
    question: 'What is the primary purpose of an activation function (like ReLU or Sigmoid) in an artificial neural network?',
    options: [
      'To encrypt the model parameters to prevent unauthorized copying.',
      'To introduce non-linearity, allowing the network to learn complex non-linear relationships.',
      'To speed up CPU clock speed during the forward pass.',
      'To replace the need for loss calculation and backpropagation.'
    ],
    correctAnswerIndex: 1,
    explanation: 'Without non-linear activation functions, stacked neural network layers would simply collapse into a single linear regression equivalent.'
  },
  {
    id: 5,
    topic: 'Model Evaluation',
    question: 'Which observation strongly indicates that a model is suffering from "overfitting"?',
    options: [
      'The model achieves high accuracy on training data, but performs poorly on validation/test data.',
      'The model performs poorly on training data as well as testing data.',
      'The model predicts the same single class for every single input.',
      'The model finishes training in less than one second without loss reduction.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Overfitting occurs when a model memorizes noise and specific peculiarities of the training dataset, failing to generalize to new, unseen test data.'
  }
];

export const calculateDetectedLevel = (score: number): AILevel => {
  if (score <= 2) return 'Beginner';
  if (score <= 4) return 'Intermediate';
  return 'Advanced';
};
