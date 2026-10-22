export const initialCoursesData = [
  {
    id: "101",
    title: "Full Stack Web Development with React & Node.js",
    category: "Web Development",
    difficulty: "Intermediate",
    instructor: "Dr. Sarah Jenkins",
    instructorRole: "Principal Frontend Architect & Former Google Lead",
    duration: "40 hours",
    durationHours: 40,
    rating: 4.9,
    studentsCount: 14200,
    price: "$89.99",
    thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&auto=format&fit=crop&q=60",
    description: "Master modern web development from ground up. Learn React hooks, Context API, state management, RESTful APIs with Node.js & Express, and build scalable full-stack applications with production-grade architectures.",
    learningMaterials: [
      {
        id: "l1",
        title: "Introduction to React Functional Components and JSX",
        duration: "45 mins",
        type: "Video & Article",
        summary: "Understand the virtual DOM, functional component hierarchy, JSX syntax rules, and component composition patterns.",
        content: `In this module, we explore how React uses the Virtual DOM to optimize rendering performance. We transition from classical class components to modern functional components, studying JSX transformation under the hood and clean prop delegation.`,
        resources: ["React 19 Official Documentation", "JSX In-Depth Guide", "Clean Code Component Architecture"]
      },
      {
        id: "l2",
        title: "Deep Dive into React Hooks: useState, useEffect, useRef",
        duration: "60 mins",
        type: "Interactive Workshop",
        summary: "State isolation, synchronization side-effects with cleanup functions, and DOM element referencing using useRef.",
        content: `Dive into the core React hooks. Learn why state updates are asynchronous and batched, how dependency arrays govern useEffect execution, and how useRef persists mutable values across renders without triggering a re-render.`,
        resources: ["Hook Rules Reference", "DOM Manipulation via Refs", "Effect Lifecycle Cheatsheet"]
      },
      {
        id: "l3",
        title: "Performance Optimization: useMemo and useCallback",
        duration: "55 mins",
        type: "Video & Code Sandbox",
        summary: "Memoizing expensive calculations, maintaining referential equality of callbacks, and avoiding unnecessary re-renders.",
        content: `Profile React applications using DevTools. We demonstrate computationally intensive filtering and sorting, showing how useMemo caches results and useCallback prevents child component thrashing.`,
        resources: ["React DevTools Profiler Guide", "Referential Equality in JS", "Benchmark Lab Notes"]
      },
      {
        id: "l4",
        title: "Global State Management with Context API & Custom Hooks",
        duration: "75 mins",
        type: "Hands-on Project",
        summary: "Building lightweight global state stores, custom consumer hooks, and preventing Context re-render cascades.",
        content: `Eliminate prop drilling across nested layouts. We architect modular context providers, pair them with custom domain hooks like useCourses and useLearning, and synchronize state with localStorage.`,
        resources: ["Context Patterns Guide", "Custom Hook Best Practices", "Storage Persistence Sync"]
      },
      {
        id: "l5",
        title: "Routing Architecture: Dynamic & Nested Routes with React Router",
        duration: "50 mins",
        type: "Full Stack Lab",
        summary: "Declarative routing, URL parameter extraction with useParams, programmatic navigation with useNavigate, and nested layouts using Outlet.",
        content: `Learn React Router v7 conventions. We structure dynamic course routes (/course/:id), nested dashboard layouts (/learning/materials, /learning/quiz), and enforce authentication via ProtectedRoute.`,
        resources: ["React Router v7 Migration", "Nested Outlet Layouts", "Auth Guard Patterns"]
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which React hook is specifically designed to persist a mutable value without triggering re-renders?",
        options: ["useState", "useRef", "useEffect", "useMemo"],
        correctIndex: 1,
        explanation: "useRef returns a mutable ref object whose .current property is initialized to the passed argument and persists across the component lifetime without causing a re-render when changed."
      },
      {
        id: "q2",
        question: "When should you use useMemo instead of a normal variable declaration?",
        options: [
          "For any variable in a functional component",
          "When you need to perform an expensive calculation that depends on specific dependencies",
          "Only when fetching asynchronous API data",
          "When you want to reference a DOM node"
        ],
        correctIndex: 1,
        explanation: "useMemo caches the calculated result of an expensive function between renders, recalculating only when specified dependencies change."
      },
      {
        id: "q3",
        question: "What is the primary benefit of custom React hooks?",
        options: [
          "They replace JSX markup entirely",
          "They enable sharing stateful logic between components without code duplication",
          "They eliminate the need for JavaScript functions",
          "They automatically convert code into WebAssembly"
        ],
        correctIndex: 1,
        explanation: "Custom hooks allow you to extract and reuse stateful logic (such as course search or learning progress tracking) across multiple functional components."
      },
      {
        id: "q4",
        question: "In React Router, what component is used inside a parent route layout to render child route elements?",
        options: ["<ChildView />", "<Outlet />", "<RouteHolder />", "<NestedPortal />"],
        correctIndex: 1,
        explanation: "<Outlet /> is used within parent route component layouts to render their matching child route elements."
      }
    ],
    assignments: [
      {
        id: "a101",
        title: "Build a Responsive E-Learning Dashboard with Custom Hooks",
        dueDate: "October 30, 2026",
        points: 100,
        description: "Implement a fully functional course management dashboard supporting course search, category filters, progress tracking, and local storage synchronization using custom React hooks and the Context API.",
        submissionGuidelines: "Submit your GitHub repository URL and a live deployment link or architecture notes. Ensure all controlled form inputs validate user inputs prior to submission.",
        rubric: [
          "Clean component modularity and JSX separation (25 pts)",
          "Proper usage of useState, useEffect, useRef, useMemo, useCallback (25 pts)",
          "Custom hooks implementation (useCourses, useLearning) (25 pts)",
          "Protected routing, form validation, and error boundaries (25 pts)"
        ]
      }
    ]
  },
  {
    id: "102",
    title: "Python for Data Science & Machine Learning Bootcamp",
    category: "Data Science",
    difficulty: "Beginner",
    instructor: "Prof. Alan Turing",
    instructorRole: "Distinguished Fellow in AI & Quantitative Analytics",
    duration: "32 hours",
    durationHours: 32,
    rating: 4.8,
    studentsCount: 19800,
    price: "$79.99",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    description: "From Python fundamentals to predictive modeling with NumPy, Pandas, Scikit-Learn, and Matplotlib. Gain hands-on data manipulation and regression analysis skills.",
    learningMaterials: [
      {
        id: "l201",
        title: "Python Environment & Numerical Computing with NumPy",
        duration: "50 mins",
        type: "Lab Exercise",
        summary: "Arrays, vectorization, broadcasting rules, and high-performance linear algebra operations.",
        content: `Discover multi-dimensional array operations. We examine memory layouts, broadcasting rules, and benchmarks comparing native Python loops to vectorized NumPy operations.`,
        resources: ["NumPy Quickstart", "Broadcasting Visualizer"]
      },
      {
        id: "l202",
        title: "Data Wrangling & Statistical Exploration with Pandas",
        duration: "65 mins",
        type: "Interactive Notebook",
        summary: "DataFrames, handling missing values, grouped aggregations, and time series slicing.",
        content: `Master data cleansing and transformation pipelines. We clean real-world e-commerce datasets, handle missing values, and perform group-by aggregations.`,
        resources: ["Pandas Cookbook", "Missing Data Strategies"]
      },
      {
        id: "l203",
        title: "Supervised Learning: Regression and Classification Models",
        duration: "70 mins",
        type: "Project Lab",
        summary: "Model training, cross-validation, confusion matrices, and hyperparameter tuning.",
        content: `Train predictive models with Scikit-Learn. We evaluate model performance using precision, recall, ROC-AUC curves, and perform k-fold cross validation.`,
        resources: ["Scikit-Learn Model Selection", "ROC-AUC Visualizer"]
      }
    ],
    quiz: [
      {
        id: "q201",
        question: "Which Python data structure is fundamental for fast matrix operations in NumPy?",
        options: ["Linked List", "ndarray", "OrderedDict", "Tuple"],
        correctIndex: 1,
        explanation: "NumPy's ndarray provides homogenous, contiguous memory allocation optimized for fast vector computations."
      },
      {
        id: "q202",
        question: "Which metric is best suited for evaluating a highly imbalanced binary classification dataset?",
        options: ["Raw Accuracy", "F1-Score / PR-AUC", "Mean Squared Error", "R-squared"],
        correctIndex: 1,
        explanation: "In imbalanced datasets, raw accuracy is deceptive. F1-score or Precision-Recall AUC accurately reflects minority class detection."
      }
    ],
    assignments: [
      {
        id: "a102",
        title: "Predictive Analytics on Student Completion Trends",
        dueDate: "November 5, 2026",
        points: 100,
        description: "Analyze learner engagement logs to train a predictive model identifying students at risk of drop-out.",
        submissionGuidelines: "Submit your Jupyter notebook or Python script link along with model evaluation charts.",
        rubric: [
          "Data preprocessing and imputation (30 pts)",
          "Exploratory visual analysis (30 pts)",
          "Model selection & validation (40 pts)"
        ]
      }
    ]
  },
  {
    id: "103",
    title: "UI/UX Design Masterclass: Figma to Interactive Prototypes",
    category: "Design",
    difficulty: "Beginner",
    instructor: "Elena Rostova",
    instructorRole: "Head of Product Design at PixelCraft Studio",
    duration: "24 hours",
    durationHours: 24,
    rating: 4.95,
    studentsCount: 8900,
    price: "$69.99",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=60",
    description: "Learn user research, wireframing, color theory, typography, design systems, and advanced Figma auto-layout to build modern digital products that delight users.",
    learningMaterials: [
      {
        id: "l301",
        title: "Foundations of Human-Centered Interaction Design",
        duration: "40 mins",
        type: "Lecture & Case Studies",
        summary: "Heuristic evaluation, accessibility (WCAG 2.2), information hierarchy, and user journey mapping.",
        content: `Explore Nielsen's 10 usability heuristics, color contrast ratios for accessibility, and wireframe ergonomics for touch devices.`,
        resources: ["WCAG 2.2 Guidelines", "Nielsen Norman Usability Heuristics"]
      },
      {
        id: "l302",
        title: "Figma Mastery: Components, Variants, and Auto-Layout 5.0",
        duration: "65 mins",
        type: "Live Workshop",
        summary: "Creating reusable component sets, tokens, responsive constraints, and design tokens.",
        content: `Construct scalable component systems in Figma. We implement auto-layout nesting, boolean component properties, and dark mode tokens.`,
        resources: ["Design Token Specs", "Figma Community Kit"]
      }
    ],
    quiz: [
      {
        id: "q301",
        question: "What minimum contrast ratio is required for normal text according to WCAG AA guidelines?",
        options: ["2.5:1", "3:1", "4.5:1", "7:1"],
        correctIndex: 2,
        explanation: "WCAG 2.1/2.2 AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text."
      }
    ],
    assignments: [
      {
        id: "a103",
        title: "Design a Cross-Platform E-Learning Student Portal",
        dueDate: "November 10, 2026",
        points: 100,
        description: "Create a high-fidelity interactive prototype for a mobile and desktop learning portal using Figma components.",
        submissionGuidelines: "Submit Figma public prototype link and design system token summary.",
        rubric: [
          "Information architecture & layout (35 pts)",
          "Design system tokenization (35 pts)",
          "Interactive prototyping & micro-animations (30 pts)"
        ]
      }
    ]
  },
  {
    id: "104",
    title: "Cloud Architecture & DevOps with AWS and Kubernetes",
    category: "Cloud & DevOps",
    difficulty: "Advanced",
    instructor: "David Miller",
    instructorRole: "AWS Certified Solutions Architect & SRE Director",
    duration: "45 hours",
    durationHours: 45,
    rating: 4.85,
    studentsCount: 11400,
    price: "$99.99",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    description: "Design resilient cloud architectures on AWS. Automate provisioning with Terraform, containerize workloads with Docker, and orchestrate with Kubernetes and CI/CD pipelines.",
    learningMaterials: [
      {
        id: "l401",
        title: "AWS Cloud Infrastructure: VPC, EC2, S3, and IAM",
        duration: "60 mins",
        type: "Architecture Blueprint",
        summary: "Subnets, internet gateways, NAT gateways, security groups, and least-privilege IAM policies.",
        content: `Design multi-tier, multi-AZ virtual private clouds with isolated private subnets, Bastion hosts, and encrypted S3 storage buckets.`,
        resources: ["AWS Well-Architected Framework", "IAM Policy Simulator"]
      },
      {
        id: "l402",
        title: "Containerization & Orchestration with Docker and EKS",
        duration: "75 mins",
        type: "Hands-on Lab",
        summary: "Multi-stage Docker builds, Kubernetes pods, deployments, services, ingress, and Helm charts.",
        content: `Package microservices with optimized Alpine Docker images and deploy onto managed Amazon Elastic Kubernetes Service clusters.`,
        resources: ["Kubernetes Cheat Sheet", "Helm Best Practices"]
      }
    ],
    quiz: [
      {
        id: "q401",
        question: "In Kubernetes, which controller ensures that a specified number of pod replicas are running at all times?",
        options: ["IngressController", "ReplicaSet / Deployment", "DaemonSet", "ConfigMap"],
        correctIndex: 1,
        explanation: "A ReplicaSet (managed by a Deployment) ensures that the desired number of identical pods remain healthy and active."
      }
    ],
    assignments: [
      {
        id: "a104",
        title: "Deploy a High-Availability Multi-Tier Web App on AWS",
        dueDate: "November 18, 2026",
        points: 100,
        description: "Write Terraform scripts to spin up an auto-scaling group behind an Application Load Balancer with secure RDS database.",
        submissionGuidelines: "Submit Terraform configuration files and architecture diagram.",
        rubric: [
          "Security group & VPC design (40 pts)",
          "Terraform IAC structure (35 pts)",
          "Health check & auto-scaling policies (25 pts)"
        ]
      }
    ]
  },
  {
    id: "105",
    title: "Cross-Platform Mobile App Development with React Native",
    category: "Mobile",
    difficulty: "Intermediate",
    instructor: "Sophia Chen",
    instructorRole: "Mobile Lead at AppVenture Labs",
    duration: "30 hours",
    durationHours: 30,
    rating: 4.78,
    studentsCount: 7600,
    price: "$74.99",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
    description: "Build iOS and Android applications with a single React Native codebase using Expo, React Navigation, NativeWind, and device APIs.",
    learningMaterials: [
      {
        id: "l501",
        title: "React Native Core Components & Expo Workflow",
        duration: "50 mins",
        type: "Code Along",
        summary: "View, Text, Image, FlatList, ScrollView, and native bridge communications.",
        content: `Understand the React Native bridge and New Architecture (Fabric & TurboModules). Setup clean mobile navigation with React Navigation stack and bottom tabs.`,
        resources: ["Expo Documentation", "React Native Performance Guide"]
      }
    ],
    quiz: [
      {
        id: "q501",
        question: "Which component in React Native is optimized for rendering long, scrollable lists with memory recycling?",
        options: ["ScrollView", "FlatList", "SectionList", "ListView"],
        correctIndex: 1,
        explanation: "FlatList lazily renders items on screen and recycles views out of viewport to optimize mobile memory usage."
      }
    ],
    assignments: [
      {
        id: "a105",
        title: "Build a Cross-Platform Habit Tracking App",
        dueDate: "November 22, 2026",
        points: 100,
        description: "Develop a mobile app with local SQLite/AsyncStorage persistence and gesture animations.",
        submissionGuidelines: "Submit GitHub repo with video demo recording.",
        rubric: [
          "UI responsiveness on both iOS & Android (40 pts)",
          "State management and local persistence (30 pts)",
          "Code cleanliness and navigation flow (30 pts)"
        ]
      }
    ]
  },
  {
    id: "106",
    title: "Cybersecurity Essentials & Modern Ethical Hacking",
    category: "Cybersecurity",
    difficulty: "Advanced",
    instructor: "Marcus Vance",
    instructorRole: "Certified Information Systems Security Professional (CISSP)",
    duration: "38 hours",
    durationHours: 38,
    rating: 4.92,
    studentsCount: 9300,
    price: "$94.99",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=60",
    description: "Learn vulnerability assessment, penetration testing techniques, OWASP Top 10 web vulnerabilities, cryptography, and defensive network posture.",
    learningMaterials: [
      {
        id: "l601",
        title: "Network Security Protocols and Cryptography",
        duration: "55 mins",
        type: "Security Lab",
        summary: "TLS handshakes, asymmetric encryption, hashing algorithms, and public key infrastructure.",
        content: `Examine network attack vectors, packet inspection with Wireshark, and defend against man-in-the-middle attacks using modern TLS 1.3 standards.`,
        resources: ["NIST Cryptographic Standards", "OWASP Cheat Sheet"]
      }
    ],
    quiz: [
      {
        id: "q601",
        question: "What is the primary defense against SQL Injection attacks?",
        options: [
          "Client-side regex checking",
          "Parameterized queries (Prepared Statements)",
          "Using HTTP POST instead of GET",
          "Increasing database server memory"
        ],
        correctIndex: 1,
        explanation: "Parameterized queries separate SQL instructions from user data, preventing arbitrary code execution regardless of input characters."
      }
    ],
    assignments: [
      {
        id: "a106",
        title: "Web Application Penetration Test and Audit Report",
        dueDate: "November 28, 2026",
        points: 100,
        description: "Conduct a vulnerability assessment on a simulated lab environment and produce an executive audit report.",
        submissionGuidelines: "Submit PDF audit report detailing findings and remediation roadmaps.",
        rubric: [
          "Vulnerability identification (40 pts)",
          "Risk categorization (CVSS) (30 pts)",
          "Actionable remediation advice (30 pts)"
        ]
      }
    ]
  }
];

export { CATEGORIES, DIFFICULTIES, DURATIONS } from './courseFilters';
