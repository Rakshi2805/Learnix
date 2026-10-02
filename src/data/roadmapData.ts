import { AILevel, LearningGoal, LearningPace } from '../types/learner';
import { RoadmapTopic, PersonalisedRoadmap } from '../types/roadmap';

interface RawTopicDefinition {
  id: string;
  title: string;
  description: string;
  introduction: string;
  objectives: [string, string, string];
}

// 12 tracks: 4 Goals x 3 Levels (5 topics each)
const ROADMAP_BLUEPRINTS: Record<LearningGoal, Record<AILevel, RawTopicDefinition[]>> = {
  'AI Fundamentals': {
    Beginner: [
      {
        id: 'ai-fundamentals-beg',
        title: 'AI Fundamentals',
        description: 'Core concepts of artificial intelligence, terminology, and modern applications.',
        introduction: 'Welcome to AI Fundamentals! In this foundational topic, you will explore what artificial intelligence is, examine its historical milestones, and learn how AI algorithms mimic human perception and decision-making.',
        objectives: [
          'Understand the core definitions and philosophical roots of artificial intelligence.',
          'Identify real-world AI applications across healthcare, search engines, and finance.',
          'Distinguish between narrow AI, general AI, and modern generative systems.'
        ]
      },
      {
        id: 'ai-vs-ml-beg',
        title: 'AI vs Machine Learning',
        description: 'Understand the key distinctions between symbolic AI and data-driven learning.',
        introduction: 'While AI and Machine Learning are often used interchangeably, machine learning is a specific subset of AI. This topic clarifies the boundaries and bridges between rules and statistical learning.',
        objectives: [
          'Differentiate between rule-based symbolic AI and statistical machine learning.',
          'Recognize scenarios where traditional software engineering is preferable over ML.',
          'Understand how learning systems adapt through experience rather than hardcoded logic.'
        ]
      },
      {
        id: 'types-of-ml-beg',
        title: 'Types of Machine Learning',
        description: 'Discover the three main paradigms: supervised, unsupervised, and reinforcement learning.',
        introduction: 'Machine learning algorithms can learn in various ways. In this topic, you will categorize models based on how they process supervision, discover patterns, and receive environmental feedback.',
        objectives: [
          'Compare and contrast Supervised, Unsupervised, and Reinforcement learning paradigms.',
          'Identify common problem types such as classification, regression, and clustering.',
          'Match real-world industry problems to the appropriate machine learning paradigm.'
        ]
      },
      {
        id: 'basic-data-concepts-beg',
        title: 'Basic Data Concepts',
        description: 'Learn data formats, features, labels, and the importance of data quality.',
        introduction: 'Data is the fundamental fuel of every machine learning model. In this topic, you will learn how raw observations are converted into structured mathematical matrices.',
        objectives: [
          'Understand the role of features (inputs) and target labels (ground truth).',
          'Learn the necessity of splitting data into independent train and test sets.',
          'Identify common data challenges including missing values, outliers, and class imbalance.'
        ]
      },
      {
        id: 'simple-ai-project-beg',
        title: 'Simple AI Project',
        description: 'Build and walk through a complete conceptual AI decision pipeline from start to finish.',
        introduction: 'Integrate your foundational understanding by walking through an end-to-end artificial intelligence workflow from problem formulation to final predictions.',
        objectives: [
          'Formulate a well-defined predictive problem statement.',
          'Trace the full lifecycle of data collection, model training, and performance evaluation.',
          'Analyze predictive outcomes and reflect on potential biases in the model.'
        ]
      }
    ],
    Intermediate: [
      {
        id: 'ml-fundamentals-review-int',
        title: 'ML Fundamentals Review',
        description: 'Consolidate fundamental machine learning concepts, loss functions, and optimization loops.',
        introduction: 'Take your foundational understanding to an operational level by reviewing the mathematics of objective functions, parameters, and iterative learning.',
        objectives: [
          'Analyze loss functions and their mathematical role in guiding parameter updates.',
          'Review gradient descent mechanics and common learning rate schedules.',
          'Understand the bias-variance tradeoff and its impact on model performance.'
        ]
      },
      {
        id: 'supervised-vs-unsupervised-int',
        title: 'Supervised vs Unsupervised Learning',
        description: 'Deep dive into algorithmic mechanisms of regression, classification, and clustering.',
        introduction: 'Examine intermediate algorithms across both supervised and unsupervised disciplines, understanding when to apply decision trees vs k-means clustering.',
        objectives: [
          'Compare linear boundaries, tree-based splits, and geometric clustering techniques.',
          'Understand unsupervised dimensionality reduction with Principal Component Analysis (PCA).',
          'Formulate validation strategies for models when ground-truth labels are absent.'
        ]
      },
      {
        id: 'feature-engineering-int',
        title: 'Feature Engineering',
        description: 'Transform raw data into high-signal representations using domain heuristics and scaling.',
        introduction: 'The quality of features often dictates the upper bound of model performance. Learn essential transformation and encoding techniques used by practitioners.',
        objectives: [
          'Apply numerical scaling techniques including normalization and standardization.',
          'Perform categorical encodings such as one-hot encoding and target encoding.',
          'Create interaction features and handle date/time features effectively.'
        ]
      },
      {
        id: 'model-evaluation-int',
        title: 'Model Evaluation',
        description: 'Master precision, recall, F1-score, ROC-AUC, and robust cross-validation.',
        introduction: 'Move beyond simple accuracy to evaluate machine learning systems rigorously across imbalanced distributions and multi-class environments.',
        objectives: [
          'Interpret confusion matrices, precision, recall, and harmonic F1-scores.',
          'Analyze ROC curves and calculate Area Under the Curve (AUC) for binary classifiers.',
          'Implement k-fold cross-validation to assess variance across data partitions.'
        ]
      },
      {
        id: 'applied-ml-project-int',
        title: 'Applied ML Project',
        description: 'Implement a structured machine learning pipeline addressing an end-to-end predictive problem.',
        introduction: 'Synthesize your intermediate knowledge by executing an applied project workflow with modular data cleaning, feature transforms, and model tuning.',
        objectives: [
          'Construct a clean scikit-learn compatible transformation pipeline.',
          'Tune model hyperparameters systematically using grid and random search.',
          'Interpret model predictions and communicate diagnostic metrics.'
        ]
      }
    ],
    Advanced: [
      {
        id: 'advanced-ml-concepts-adv',
        title: 'Advanced ML Concepts',
        description: 'Explore statistical learning theory, regularization techniques, and empirical risk minimization.',
        introduction: 'Delve into the theoretical frameworks that govern model convergence, generalization bounds, and regularized optimization in high-dimensional spaces.',
        objectives: [
          'Understand Empirical Risk Minimization (ERM) and structural risk principles.',
          'Formulate L1 (Lasso) and L2 (Ridge) regularizers from a Bayesian perspective.',
          'Analyze kernel methods and non-linear mapping in reproducing kernel Hilbert spaces.'
        ]
      },
      {
        id: 'neural-networks-adv',
        title: 'Neural Networks',
        description: 'Architect multi-layer perceptrons, backpropagation gradients, and dynamic computations.',
        introduction: 'Transition from classical statistical models to deep computational graphs, deriving gradient backpropagation and layer transformations from scratch.',
        objectives: [
          'Derive matrix calculus equations for forward and backward passes across dense layers.',
          'Investigate activation saturation, dead neurons, and modern activations (GELU, Swish).',
          'Explore weight initialization strategies including He and Xavier/Glorot techniques.'
        ]
      },
      {
        id: 'model-optimization-adv',
        title: 'Model Optimization',
        description: 'Advanced optimizers, learning rate warmup, clipping, and loss landscape navigation.',
        introduction: 'Master state-of-the-art optimization algorithms such as AdamW, RMSProp, and Lion, investigating how modern optimizers navigate non-convex loss surfaces.',
        objectives: [
          'Compare stochastic gradient descent with adaptive momentum optimizers (Adam, AdamW).',
          'Implement learning rate schedulers including cosine decay and linear warmups.',
          'Mitigate exploding and vanishing gradients using gradient clipping.'
        ]
      },
      {
        id: 'advanced-evaluation-adv',
        title: 'Advanced Evaluation',
        description: 'Evaluate models for calibration, data drift, fairness metrics, and uncertainty estimation.',
        introduction: 'Production AI requires evaluating not just correctness, but calibration, prediction uncertainty, adversarial robustness, and temporal dataset drift.',
        objectives: [
          'Calculate Brier score and expected calibration error (ECE) on predictive probabilities.',
          'Detect covariate shift and concept drift using Kolmogorov-Smirnov and PSI metrics.',
          'Assess algorithmic fairness through demographic parity and equalized odds.'
        ]
      },
      {
        id: 'capstone-ai-project-adv',
        title: 'AI Project',
        description: 'Architect a production-grade machine learning system designed for scale and maintainability.',
        introduction: 'Deploy advanced architectural principles to design, validate, and monitor an end-to-end intelligent system with production considerations.',
        objectives: [
          'Design a modular training and inference architecture with reproducible checkpoints.',
          'Formulate an automated validation suite testing edge cases and data shifts.',
          'Document system design tradeoffs between latency, throughput, and accuracy.'
        ]
      }
    ]
  },

  'Machine Learning': {
    Beginner: [
      {
        id: 'python-for-ml-beg',
        title: 'Python for Machine Learning',
        description: 'Master core scientific Python libraries: NumPy, Pandas, and Matplotlib.',
        introduction: 'Python is the lingua franca of machine learning. Learn the essential libraries used to inspect datasets, manipulate multi-dimensional arrays, and visualize distributions.',
        objectives: [
          'Perform vector and matrix operations efficiently using NumPy arrays.',
          'Load, filter, and inspect structured datasets with Pandas DataFrames.',
          'Generate distribution plots and correlation heatmaps with Matplotlib and Seaborn.'
        ]
      },
      {
        id: 'data-preparation-beg',
        title: 'Data Preparation',
        description: 'Clean data, handle null entries, and prepare clean inputs for scikit-learn.',
        introduction: 'Real-world data is inherently noisy. In this topic, you will learn pragmatic data cleaning workflows that turn raw records into clean matrices for training.',
        objectives: [
          'Identify and impute missing data using mean, median, or constant strategies.',
          'Encode categorical variables using standard scikit-learn transformers.',
          'Split datasets deterministically into training and evaluation sets.'
        ]
      },
      {
        id: 'supervised-learning-beg',
        title: 'Supervised Learning',
        description: 'Train your first linear regression and decision tree models on tabular data.',
        introduction: 'Experience the magic of model fitting by training classic supervised learning algorithms to predict continuous values and categorical outcomes.',
        objectives: [
          'Train and inspect simple and multiple Linear Regression models.',
          'Understand decision tree branching, split criteria, and leaf predictions.',
          'Make predictions on unseen samples and inspect model weights.'
        ]
      },
      {
        id: 'model-evaluation-beg',
        title: 'Model Evaluation',
        description: 'Evaluate predictions with accuracy, mean squared error, and baseline comparisons.',
        introduction: 'Discover how to measure how well your machine learning model actually performs, avoiding common evaluation pitfalls and misleading metrics.',
        objectives: [
          'Calculate Mean Absolute Error (MAE) and Mean Squared Error (MSE) for regression.',
          'Measure classification accuracy and identify why accuracy fails on imbalanced classes.',
          'Compare trained models against naive dummy baselines.'
        ]
      },
      {
        id: 'mini-ml-project-beg',
        title: 'Mini ML Project',
        description: 'Build an end-to-end machine learning model to solve a realistic prediction problem.',
        introduction: 'Put everything together: ingest a dataset, prepare features, train a baseline classifier, and evaluate its test performance.',
        objectives: [
          'Carry out an exploratory data analysis (EDA) workflow.',
          'Fit multiple scikit-learn candidate models and compare results.',
          'Export and summarize findings with clear diagnostic charts.'
        ]
      }
    ],
    Intermediate: [
      {
        id: 'feature-engineering-ml-int',
        title: 'Feature Engineering',
        description: 'Craft predictive signals through polynomial features, domain transformations, and scaling.',
        introduction: 'Master feature engineering strategies that dramatically boost tabular model scores without changing the underlying algorithm family.',
        objectives: [
          'Generate non-linear feature interactions and polynomial terms.',
          'Handle high-cardinality categorical features using target encoding.',
          'Apply robust scaling to withstand outliers in noisy features.'
        ]
      },
      {
        id: 'regression-int',
        title: 'Regression',
        description: 'Explore Ridge, Lasso, ElasticNet, and non-linear regression algorithms.',
        introduction: 'Dive deep into regularized linear models and non-linear regression curves, understanding how shrinkage penalty terms prevent overfitting.',
        objectives: [
          'Compare L1 (Lasso) feature selection properties with L2 (Ridge) shrinkage.',
          'Tune regularization strength alpha through cross-validated searches.',
          'Evaluate residual plots to detect heteroscedasticity and non-linear trends.'
        ]
      },
      {
        id: 'classification-int',
        title: 'Classification',
        description: 'Train Logistic Regression, Random Forests, and Support Vector Machines.',
        introduction: 'Master popular classification algorithms, comparing linear decision boundaries with non-linear ensemble trees and maximum-margin hyperplanes.',
        objectives: [
          'Understand probability calibration and decision thresholds in Logistic Regression.',
          'Train Random Forest ensembles with bootstrap aggregating (bagging).',
          'Explore Support Vector Classifiers and kernel projection concepts.'
        ]
      },
      {
        id: 'model-evaluation-ml-int',
        title: 'Model Evaluation',
        description: 'Master stratified cross-validation, precision-recall trade-offs, and ROC-AUC curves.',
        introduction: 'Level up your validation strategy with stratified sampling, threshold tuning, and cost-benefit trade-off curves for real-world deployments.',
        objectives: [
          'Implement Stratified K-Fold cross-validation for imbalanced classes.',
          'Analyze precision-recall curves to optimize business-specific probability thresholds.',
          'Compute log-loss and multi-class confusion matrices.'
        ]
      },
      {
        id: 'ml-project-int',
        title: 'ML Project',
        description: 'Build, tune, and validate an end-to-end predictive machine learning pipeline.',
        introduction: 'Develop a modular machine learning pipeline that encapsulates data transformers, cross-validated hyperparameter tuning, and model evaluation.',
        objectives: [
          'Encapsulate preprocessing and modeling in reusable Scikit-Learn Pipelines.',
          'Optimize model hyperparameters using RandomizedSearchCV.',
          'Document validation results and assess feature importances.'
        ]
      }
    ],
    Advanced: [
      {
        id: 'advanced-feature-engineering-adv',
        title: 'Advanced Feature Engineering',
        description: 'Automated feature synthesis, embedding representations, and out-of-fold target encoding.',
        introduction: 'Extract maximum predictive signal from complex tabular, temporal, and categorical data using advanced engineering methodologies.',
        objectives: [
          'Implement leak-free out-of-fold target encoding schemes.',
          'Extract tabular embeddings using entity embedding neural layers.',
          'Apply automated dimensionality reduction and feature selection filters.'
        ]
      },
      {
        id: 'ensemble-methods-adv',
        title: 'Ensemble Methods',
        description: 'Gradient boosted trees (XGBoost, LightGBM, CatBoost) and multi-model stacking.',
        introduction: 'Master the state-of-the-art algorithms dominating competitive machine learning: gradient boosted decision trees and multi-level model ensembles.',
        objectives: [
          'Derive the mathematical formulation of gradient tree boosting and second-order loss.',
          'Tune learning rate, tree depth, and subsampling across XGBoost and LightGBM.',
          'Construct multi-model stacking and blending architectures with meta-learners.'
        ]
      },
      {
        id: 'model-optimization-ml-adv',
        title: 'Model Optimization',
        description: 'Bayesian optimization, hyperparameter tuning with Optuna, and pruning strategies.',
        introduction: 'Move beyond brute-force grid searches by using Bayesian optimization with Gaussian Processes and Tree-structured Parzen Estimators (TPE).',
        objectives: [
          'Formulate hyperparameter tuning as a Bayesian optimization problem.',
          'Write automated Optuna search studies with early-stopping trial pruners.',
          'Balance hyperparameter exploration versus exploitation under compute constraints.'
        ]
      },
      {
        id: 'advanced-ml-evaluation-adv',
        title: 'Advanced ML Evaluation',
        description: 'SHAP values, model explainability, feature attribution, and adversarial test suites.',
        introduction: 'Demystify black-box machine learning models with cooperative game theory (Shapley values) and comprehensive model explainability techniques.',
        objectives: [
          'Compute TreeSHAP and KernelSHAP values to interpret individual predictions.',
          'Generate global feature summary plots and partial dependence plots.',
          'Evaluate model sensitivity and robustness against adversarial perturbations.'
        ]
      },
      {
        id: 'end-to-end-ml-project-adv',
        title: 'End-to-End ML Project',
        description: 'Architect a production-ready machine learning system with automated inference pipelines.',
        introduction: 'Design and implement an industry-grade machine learning system incorporating feature stores, model registry principles, and drift-resilient inference.',
        objectives: [
          'Build an end-to-end training and batch inference workflow.',
          'Implement automated sanity checks and schema validation for incoming data.',
          'Benchmark inference latency and memory footprints under production workloads.'
        ]
      }
    ]
  },

  'Deep Learning': {
    Beginner: [
      {
        id: 'neural-network-basics-beg',
        title: 'Neural Network Basics',
        description: 'Biological inspiration, artificial neurons, and forward propagation intuition.',
        introduction: 'Discover how multi-layered computational graphs inspired by human neural biology can learn hierarchical representations directly from raw inputs.',
        objectives: [
          'Understand the historical inspiration and architecture of artificial neurons.',
          'Trace a forward pass calculation with weights, inputs, and bias terms.',
          'Understand how deep architectures learn layered feature representations.'
        ]
      },
      {
        id: 'perceptron-beg',
        title: 'Perceptron',
        description: 'The fundamental building block of deep learning and linear decision boundaries.',
        introduction: 'Study the classic Frank Rosenblatt perceptron model, its learning algorithm, and its foundational role in modern deep neural networks.',
        objectives: [
          'Understand the perceptron convergence theorem and update rules.',
          'Explain why a single perceptron cannot solve the non-linear XOR problem.',
          'Connect the perceptron to modern single-layer artificial neural networks.'
        ]
      },
      {
        id: 'activation-functions-beg',
        title: 'Activation Functions',
        description: 'Understand non-linearity and compare Sigmoid, Tanh, and ReLU functions.',
        introduction: 'Learn why linear combinations alone cannot learn complex patterns, and how non-linear activation functions give neural networks their expressive power.',
        objectives: [
          'Explain why activation functions are essential for deep neural networks.',
          'Compare the mathematical properties of Sigmoid, Tanh, and ReLU.',
          'Identify the vanishing gradient problem associated with saturating activations.'
        ]
      },
      {
        id: 'training-neural-network-beg',
        title: 'Training a Neural Network',
        description: 'Understand loss functions, backpropagation intuition, and gradient descent.',
        introduction: 'Explore how a neural network iteratively corrects its weights by calculating prediction errors and propagating gradients backwards through the architecture.',
        objectives: [
          'Understand how loss functions quantify prediction error across batches.',
          'Develop intuition for backpropagation and the chain rule of calculus.',
          'Observe how gradient descent iteratively updates network weights.'
        ]
      },
      {
        id: 'simple-deep-learning-project-beg',
        title: 'Simple Deep Learning Project',
        description: 'Build and train a simple multi-layer perceptron on the MNIST digit dataset.',
        introduction: 'Experience deep learning hands-on by training a dense neural network to recognize handwritten digits with high accuracy.',
        objectives: [
          'Preprocess image arrays into normalized tensor inputs.',
          'Define and compile a simple multi-layer neural network model.',
          'Evaluate training curves and inspect test sample classifications.'
        ]
      }
    ],
    Intermediate: [
      {
        id: 'neural-networks-int',
        title: 'Neural Networks',
        description: 'Deep dive into multi-layer perceptron architectures, tensor operations, and PyTorch.',
        introduction: 'Build multi-layer neural networks programmatically using modern deep learning tensors, modular layer classes, and forward execution graphs.',
        objectives: [
          'Master tensor reshaping, broadcasting, and matrix multiplications.',
          'Construct custom neural network modules using object-oriented abstractions.',
          'Track parameter counts and computational resource requirements.'
        ]
      },
      {
        id: 'backpropagation-int',
        title: 'Backpropagation',
        description: 'Mathematical derivation of computational graphs and automatic differentiation.',
        introduction: 'Demystify the computational engine behind PyTorch and TensorFlow: reverse-mode automatic differentiation and computational graph topological sorts.',
        objectives: [
          'Trace gradient computation backwards through nodes in a computational graph.',
          'Apply the multi-variable chain rule to matrix and vector gradients.',
          'Understand how autograd engines track operations and accumulate gradients.'
        ]
      },
      {
        id: 'cnn-fundamentals-int',
        title: 'CNN Fundamentals',
        description: 'Convolutional layers, pooling filters, receptive fields, and computer vision.',
        introduction: 'Discover why standard dense layers fail on high-dimensional visual inputs and how 2D convolutions exploit spatial locality and translation invariance.',
        objectives: [
          'Understand convolution kernels, stride, padding, and receptive fields.',
          'Compare max-pooling and average-pooling for spatial downsampling.',
          'Track dimensional changes of feature maps across convolutional layers.'
        ]
      },
      {
        id: 'model-training-int',
        title: 'Model Training',
        description: 'Batch normalization, dropout regularization, Adam optimizer, and training loops.',
        introduction: 'Learn the essential regularizers and optimization techniques that prevent overfitting and stabilize deep neural network training.',
        objectives: [
          'Implement mini-batch gradient descent with momentum and Adam.',
          'Apply Dropout and Batch Normalization to prevent internal covariate shift.',
          'Write robust training, validation, and early-stopping loops.'
        ]
      },
      {
        id: 'deep-learning-project-int',
        title: 'Deep Learning Project',
        description: 'Train a convolutional neural network for image classification from scratch.',
        introduction: 'Build, train, and validate a complete convolutional image classifier, evaluating accuracy, confusion matrices, and misclassified test instances.',
        objectives: [
          'Build an image data augmentation pipeline to expand training variance.',
          'Train a CNN architecture to achieve strong classification benchmarks.',
          'Analyze model convergence using loss and validation metric plots.'
        ]
      }
    ],
    Advanced: [
      {
        id: 'advanced-neural-networks-adv',
        title: 'Advanced Neural Networks',
        description: 'Residual connections, normalization variants (LayerNorm, RMSNorm), and attention.',
        introduction: 'Study advanced architectures that enabled ultra-deep models: residual skip connections, modern normalization variants, and self-attention mechanisms.',
        objectives: [
          'Analyze ResNet skip connections and their impact on gradient flow.',
          'Compare LayerNorm, RMSNorm, and GroupNorm across vision and text models.',
          'Understand the scaled dot-product self-attention mechanism.'
        ]
      },
      {
        id: 'cnn-architectures-adv',
        title: 'CNN Architectures',
        description: 'Examine ResNet, EfficientNet, MobileNet, and modern Vision Transformers (ViT).',
        introduction: 'Survey the landmark neural vision architectures, analyzing computational efficiency tradeoffs, depthwise separable convolutions, and visual patch tokens.',
        objectives: [
          'Analyze bottle-neck residual blocks in ResNet-50 and ResNet-101.',
          'Explore compound scaling in EfficientNet and mobile parameter efficiency.',
          'Compare inductive biases of convolutional filters versus Vision Transformers.'
        ]
      },
      {
        id: 'transfer-learning-adv',
        title: 'Transfer Learning',
        description: 'Fine-tuning foundational backbones, parameter-efficient adapters, and LoRA.',
        introduction: 'Harness pre-trained representations: freeze backbone feature extractors, attach custom projection heads, and explore low-rank adaptation techniques.',
        objectives: [
          'Distinguish between feature extraction and full end-to-end fine-tuning.',
          'Apply discriminative learning rates across backbone and head layers.',
          'Understand Parameter-Efficient Fine-Tuning (PEFT) and LoRA adapters.'
        ]
      },
      {
        id: 'deep-model-optimization-adv',
        title: 'Model Optimization',
        description: 'Quantization (INT8/FP4), pruning, knowledge distillation, and mixed precision.',
        introduction: 'Optimize deep learning inference speed and memory footprint through post-training quantization, structural weight pruning, and teacher-student distillation.',
        objectives: [
          'Implement FP16 / BF16 mixed-precision training with gradient scalers.',
          'Quantize floating-point model weights to INT8 and FP4 representations.',
          'Train compressed student models using knowledge distillation loss.'
        ]
      },
      {
        id: 'advanced-deep-learning-project-adv',
        title: 'Advanced Deep Learning Project',
        description: 'Deploy a fine-tuned deep learning model with optimized inference latency.',
        introduction: 'Execute an advanced capstone deep learning project: fine-tune a pre-trained vision or multimodal backbone, optimize weights, and benchmark throughput.',
        objectives: [
          'Fine-tune a state-of-the-art pre-trained vision/multimodal backbone.',
          'Optimize model graph execution using ONNX Runtime and quantization.',
          'Benchmark latency, GPU memory allocation, and batch throughput.'
        ]
      }
    ]
  },

  'AI/ML Interviews': {
    Beginner: [
      {
        id: 'interview-ai-ml-fundamentals-beg',
        title: 'AI/ML Fundamentals',
        description: 'Master core conceptual interview questions on AI definitions and core tenets.',
        introduction: 'Prepare for entry-level technical screenings by mastering crisp, articulate verbal explanations for foundational AI terminology and paradigms.',
        objectives: [
          'Articulate the difference between AI, ML, and Deep Learning in under 60 seconds.',
          'Explain the supervised vs unsupervised distinction with concise business examples.',
          'Answer common screening questions regarding deterministic vs stochastic algorithms.'
        ]
      },
      {
        id: 'interview-ml-basics-beg',
        title: 'Machine Learning Basics',
        description: 'Common interview questions on parametric models, gradient descent, and loss.',
        introduction: 'Ace standard interview questions covering how algorithms learn: cost functions, gradient descent mechanics, and weight update intuition.',
        objectives: [
          'Explain gradient descent, learning rates, and local minima clearly on a whiteboard.',
          'Compare parametric and non-parametric algorithms with pros and cons.',
          'Explain the role of bias and variance in predicting model generalization.'
        ]
      },
      {
        id: 'interview-common-algorithms-beg',
        title: 'Common ML Algorithms',
        description: 'Whiteboard walkthroughs of Linear Regression, Logistic Regression, and Decision Trees.',
        introduction: 'Learn how to describe classic algorithms mathematically and conceptually during live interviews, answering common interviewer follow-ups.',
        objectives: [
          'Derive the Ordinary Least Squares closed-form equation and assumptions.',
          'Explain the logistic sigmoid function, odds ratio, and decision boundaries.',
          'Walk through Gini impurity and information gain calculations for decision trees.'
        ]
      },
      {
        id: 'interview-evaluation-metrics-beg',
        title: 'Evaluation Metrics',
        description: 'Explain precision, recall, specificity, and ROC curves to interviewers.',
        introduction: 'Master metric selection questions: interviewers frequently test whether you know which metric to choose under severe class imbalance.',
        objectives: [
          'Defend metric selection (Precision vs Recall vs F1) across fraud, medical, and search.',
          'Explain ROC-AUC and Precision-Recall AUC curves clearly.',
          'Identify common data leakage pitfalls in evaluation setups.'
        ]
      },
      {
        id: 'interview-basic-practice-beg',
        title: 'Basic Interview Practice',
        description: 'Simulated technical screening questions and behavioral AI project walkthroughs.',
        introduction: 'Rehearse end-to-end technical phone screens with structured STAR-method storytelling for your personal machine learning projects.',
        objectives: [
          'Structure past project walkthroughs using the Context-Action-Result format.',
          'Practice rapid whiteboard responses for 10 common entry-level ML questions.',
          'Formulate insightful questions to ask ML engineering interviewers.'
        ]
      }
    ],
    Intermediate: [
      {
        id: 'interview-ml-algorithms-int',
        title: 'ML Algorithms',
        description: 'Deep dive into SVM kernels, ensemble tree mechanics, and clustering interviews.',
        introduction: 'Prepare for mid-level ML algorithm deep dives, covering decision boundaries, Support Vector Machines, Random Forests, and AdaBoost/XGBoost.',
        objectives: [
          'Explain the kernel trick and margin maximization in Support Vector Machines.',
          'Contrast bagging (Random Forest) and boosting (Gradient Boosting) from first principles.',
          'Answer probing questions on k-means convergence, sensitivity to initialization, and k-selection.'
        ]
      },
      {
        id: 'interview-feature-engineering-int',
        title: 'Feature Engineering',
        description: 'Interview questions on data leakage, multicollinearity, and dimensionality reduction.',
        introduction: 'Master data modeling and preprocessing questions that test your real-world battle scars: high cardinality, missingness, and data leakage.',
        objectives: [
          'Diagnose and remediate multicollinearity using Variance Inflation Factors (VIF).',
          'Describe robust feature selection techniques including recursive feature elimination.',
          'Explain PCA mathematics, eigenvectors, eigenvalues, and explained variance.'
        ]
      },
      {
        id: 'interview-model-evaluation-int',
        title: 'Model Evaluation',
        description: 'Handling severe class imbalance, SMOTE, cost-sensitive learning, and calibration.',
        introduction: 'Interviewers love real-world edge cases. Learn how to address 99.9% imbalanced datasets with focal loss, threshold tuning, and re-sampling.',
        objectives: [
          'Explain SMOTE, under-sampling, and cost-sensitive loss functions.',
          'Discuss probability calibration methods including Platt scaling and isotonic regression.',
          'Explain temporal cross-validation for time-series and sequential data.'
        ]
      },
      {
        id: 'interview-ml-system-concepts-int',
        title: 'ML System Concepts',
        description: 'Foundational ML system architecture: latency, batch vs real-time, and monitoring.',
        introduction: 'Transition into modern ML systems questions: learn how to discuss batch versus streaming feature pipelines, caching, and model telemetry.',
        objectives: [
          'Contrast batch inference vs real-time low-latency request-response systems.',
          'Describe mechanisms to monitor input drift, concept drift, and performance decay.',
          'Discuss model rollback strategies and shadow deployment workflows.'
        ]
      },
      {
        id: 'interview-practice-int',
        title: 'Interview Practice',
        description: 'Comprehensive practice covering theoretical proofs, coding rounds, and trade-offs.',
        introduction: 'Synthesize your algorithmic and operational knowledge through simulated live coding sessions and architecture interview walkthroughs.',
        objectives: [
          'Implement standard algorithms (k-means, linear regression) from scratch in NumPy.',
          'Address complex system trade-offs between precision, latency, and memory.',
          'Perform mock interviews with confidence and systematic communication.'
        ]
      }
    ],
    Advanced: [
      {
        id: 'interview-advanced-ml-adv',
        title: 'Advanced ML Concepts',
        description: 'Self-attention, Transformer scaling laws, loss landscapes, and optimization theory.',
        introduction: 'Master senior-level technical interviews on modern deep architectures, attention complexity, and optimization dynamics.',
        objectives: [
          'Derive multi-head self-attention time and memory complexity O(N²d).',
          'Discuss empirical scaling laws (Chinchilla, Kaplan) for compute-optimal models.',
          'Explain optimizer dynamics (AdamW vs SGD with momentum) in non-convex settings.'
        ]
      },
      {
        id: 'interview-model-optimization-adv',
        title: 'Model Optimization',
        description: 'Quantization, FlashAttention, KV caching, model distillation, and GPU profiling.',
        introduction: 'Demonstrate deep systems expertise by answering hardware-aware ML questions on memory bandwidth bottlenecks, kernel fusion, and KV caching.',
        objectives: [
          'Explain memory-bound vs compute-bound operations and FlashAttention tiling.',
          'Derive memory footprint formulas for autoregressive Key-Value caches.',
          'Explain INT8 post-training quantization and activation outlier handling.'
        ]
      },
      {
        id: 'interview-ml-system-design-adv',
        title: 'ML System Design',
        description: 'Architecting high-scale recommendation engines, search rankers, and LLM systems.',
        introduction: 'Master the senior ML System Design round: candidate generation, two-tower vector retrieval, re-ranking stages, and feature store caching.',
        objectives: [
          'Design an end-to-end multi-stage recommendation pipeline (retrieval, filtering, ranking).',
          'Architect embedding vector indexing and Approximate Nearest Neighbor (ANN) search.',
          'Balance latency budgets, SLAs, and fallback heuristics for production queries.'
        ]
      },
      {
        id: 'interview-advanced-ai-topics-adv',
        title: 'Advanced AI Topics',
        description: 'Retrieval-Augmented Generation (RAG), RLHF, agent loops, and safety guardrails.',
        introduction: 'Discuss cutting-edge generative AI architectures, alignment methodologies, reward model optimization, and agentic workflows.',
        objectives: [
          'Explain Direct Preference Optimization (DPO) versus PPO-based RLHF.',
          'Architect advanced RAG systems with hybrid search, re-ranking, and query decomposition.',
          'Describe safety alignment, red-teaming, and output validation guardrails.'
        ]
      },
      {
        id: 'interview-mock-practice-adv',
        title: 'Mock Interview Practice',
        description: 'High-pressure senior/staff ML engineering mock interviews with rubric evaluations.',
        introduction: 'Polish your executive communication, whiteboard architectural diagramming, and leadership storytelling for senior/staff machine learning roles.',
        objectives: [
          'Drive an ambiguous system design prompt from initial requirements to complete architecture.',
          'Defend architectural choices against aggressive scalability and budget constraints.',
          'Demonstrate clear senior engineering leadership and technical vision.'
        ]
      }
    ]
  }
};

/**
 * Calculates estimated learning time per topic according to the preferred pace:
 * - Quick: 10–20 mins (15 mins)
 * - Balanced: 20–30 mins (25 mins)
 * - Detailed: 30–45 mins (40 mins)
 */
export const getEstimatedTimeForPace = (pace: LearningPace): string => {
  switch (pace) {
    case 'Quick':
      return '15 mins';
    case 'Balanced':
      return '25 mins';
    case 'Detailed':
      return '40 mins';
    default:
      return '25 mins';
  }
};

/**
 * Adaptation message based on diagnostic test score:
 * 0–2: "Your roadmap starts with foundational topics to strengthen your basics."
 * 3–4: "Your roadmap balances fundamentals with intermediate topics based on your current knowledge."
 * 5: "Your roadmap starts with more advanced topics because you demonstrated strong foundational knowledge."
 */
export const getScoreAdaptationMessage = (score: number): string => {
  if (score <= 2) {
    return 'Your roadmap starts with foundational topics to strengthen your basics.';
  }
  if (score <= 4) {
    return 'Your roadmap balances fundamentals with intermediate topics based on your current knowledge.';
  }
  return 'Your roadmap starts with more advanced topics because you demonstrated strong foundational knowledge.';
};

/**
 * Generates the personalized 5-topic roadmap based on learner profile and diagnostic evaluation.
 */
export const generatePersonalisedRoadmap = (
  goal: LearningGoal,
  detectedLevel: AILevel,
  pace: LearningPace,
  score: number
): PersonalisedRoadmap => {
  const goalTracks = ROADMAP_BLUEPRINTS[goal] || ROADMAP_BLUEPRINTS['AI Fundamentals'];
  const levelTopics = goalTracks[detectedLevel] || goalTracks['Intermediate'];

  const estimatedTime = getEstimatedTimeForPace(pace);
  const scoreMessage = getScoreAdaptationMessage(score);

  const topics: RoadmapTopic[] = levelTopics.map((item, idx) => ({
    id: item.id,
    stepNumber: idx + 1,
    title: item.title,
    description: item.description,
    difficulty: detectedLevel,
    estimatedTime: estimatedTime,
    status: idx === 0 ? 'Current' : 'Locked',
    introduction: item.introduction,
    objectives: item.objectives,
  }));

  return {
    goal,
    detectedLevel,
    learningPace: pace,
    score,
    scoreMessage,
    topics,
  };
};

/**
 * Searches across all blueprints to find a topic by its ID.
 * Ensures /learn/:topicId can load topic content reliably even on direct refresh.
 */
export const findTopicById = (
  topicId: string,
  preferredDifficulty?: AILevel,
  preferredPace?: LearningPace
): RoadmapTopic | null => {
  const difficulty = preferredDifficulty || 'Intermediate';
  const pace = preferredPace || 'Balanced';
  const estimatedTime = getEstimatedTimeForPace(pace);

  for (const goalKey of Object.keys(ROADMAP_BLUEPRINTS) as LearningGoal[]) {
    for (const levelKey of Object.keys(ROADMAP_BLUEPRINTS[goalKey]) as AILevel[]) {
      const list = ROADMAP_BLUEPRINTS[goalKey][levelKey];
      const foundIdx = list.findIndex(t => t.id === topicId);
      if (foundIdx !== -1) {
        const item = list[foundIdx];
        return {
          id: item.id,
          stepNumber: foundIdx + 1,
          title: item.title,
          description: item.description,
          difficulty: levelKey,
          estimatedTime: estimatedTime,
          status: foundIdx === 0 ? 'Current' : 'Locked',
          introduction: item.introduction,
          objectives: item.objectives,
        };
      }
    }
  }

  return null;
};
