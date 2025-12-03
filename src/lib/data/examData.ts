export interface Exam {
  id: string
  name: string
  description: string
  category: string
  subcategory: string
  duration: number
  questions: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  isPremium: boolean
  attempts: number
  avgScore: number
  rating: number
}

export interface Question {
  id: string
  examId: string
  type: 'mcq' | 'tf' | 'fib'
  category: string
  difficulty: string
  content: {
    en: string
    hi?: string
  }
  options?: string[]
  correctAnswer: number | string
  explanation: {
    en: string
    hi?: string
  }
  previousYear?: number
  marks: number
  negativeMarks: number
  timeLimit?: number
}

export interface UserAttempt {
  id: string
  userId: string
  examId: string
  startTime: Date
  endTime?: Date
  score: number
  totalMarks: number
  accuracy: number
  speed: number
  answers: Record<string, number | string>
  timePerQuestion: Record<string, number>
  status: 'in-progress' | 'completed' | 'abandoned'
}

export interface UserStats {
  totalTests: number
  avgScore: number
  bestScore: number
  totalStudyTime: number
  streak: number
  rank: number
  percentile: number
  subjectWiseScores: Record<string, number>
  weakAreas: string[]
  strongAreas: string[]
}

export const examCategories = {
  ssc: {
    name: 'SSC Exams',
    description: 'Staff Selection Commission Exams',
    icon: '🏛️',
    color: 'brutal-cyan',
    subcategories: [
      { 
        id: 'ssc-cgl', 
        name: 'SSC CGL', 
        description: 'Combined Graduate Level Examination',
        icon: '📋'
      },
      { 
        id: 'ssc-chsl', 
        name: 'SSC CHSL', 
        description: 'Combined Higher Secondary Level',
        icon: '📝'
      },
      { 
        id: 'ssc-mts', 
        name: 'SSC MTS', 
        description: 'Multi Tasking Staff',
        icon: '👥'
      },
      { 
        id: 'ssc-gd', 
        name: 'SSC GD', 
        description: 'General Duty Constable',
        icon: '👮'
      },
      { 
        id: 'ssc-je', 
        name: 'SSC JE', 
        description: 'Junior Engineer',
        icon: '🔧'
      }
    ]
  },
  banking: {
    name: 'Banking Exams',
    description: 'Banking Recruitment Exams',
    icon: '🏦',
    color: 'brutal-lime',
    subcategories: [
      { 
        id: 'ibps-po', 
        name: 'IBPS PO', 
        description: 'Probationary Officer',
        icon: '💼'
      },
      { 
        id: 'ibps-clerk', 
        name: 'IBPS Clerk', 
        description: 'Clerical Cadre',
        icon: '📊'
      },
      { 
        id: 'sbi-po', 
        name: 'SBI PO', 
        description: 'State Bank PO',
        icon: '🏪'
      },
      { 
        id: 'sbi-clerk', 
        name: 'SBI Clerk', 
        description: 'State Bank Clerk',
        icon: '💳'
      },
      { 
        id: 'rbi', 
        name: 'RBI', 
        description: 'Reserve Bank of India',
        icon: '🏛️'
      }
    ]
  },
  railway: {
    name: 'Railway Exams',
    description: 'Railway Recruitment Board Exams',
    icon: '🚂',
    color: 'brutal-pink',
    subcategories: [
      { 
        id: 'rrb-ntpc', 
        name: 'RRB NTPC', 
        description: 'Non-Technical Popular Categories',
        icon: '🎫'
      },
      { 
        id: 'rrb-group-d', 
        name: 'RRB Group D', 
        description: 'Group D Recruitment',
        icon: '👥'
      },
      { 
        id: 'rrb-je', 
        name: 'RRB JE', 
        description: 'Junior Engineer',
        icon: '🔧'
      },
      { 
        id: 'rrb-alp', 
        name: 'RRB ALP', 
        description: 'Assistant Loco Pilot',
        icon: '🚂'
      }
    ]
  },
  upsc: {
    name: 'UPSC Exams',
    description: 'Union Public Service Commission Exams',
    icon: '🏛️',
    color: 'brutal-yellow',
    subcategories: [
      { 
        id: 'upsc-cse', 
        name: 'UPSC CSE', 
        description: 'Civil Services Examination',
        icon: '📜'
      },
      { 
        id: 'upsc-cds', 
        name: 'UPSC CDS', 
        description: 'Combined Defence Services',
        icon: '🎖️'
      },
      { 
        id: 'upsc-capf', 
        name: 'UPSC CAPF', 
        description: 'Central Armed Police Forces',
        icon: '🚔'
      },
      { 
        id: 'upsc-epfo', 
        name: 'UPSC EPFO', 
        description: 'Employees Provident Fund Organisation',
        icon: '💼'
      }
    ]
  },
  state: {
    name: 'State Exams',
    description: 'State Government Recruitment Exams',
    icon: '🗺️',
    color: 'brutal-purple',
    subcategories: [
      { 
        id: 'state-psc', 
        name: 'State PSC', 
        description: 'Public Service Commission',
        icon: '🏛️'
      },
      { 
        id: 'state-police', 
        name: 'State Police', 
        description: 'Police Recruitment',
        icon: '👮'
      },
      { 
        id: 'state-teacher', 
        name: 'State Teacher', 
        description: 'Teacher Eligibility Test',
        icon: '👨‍🏫'
      }
    ]
  }
}

export const mockExams: Exam[] = [
  {
    id: 'ssc-cgl-2024-mock1',
    name: 'SSC CGL Tier 1 Mock Test 1',
    description: 'Full length mock test for SSC CGL Tier 1 with latest pattern',
    category: 'ssc',
    subcategory: 'ssc-cgl',
    duration: 60,
    questions: 100,
    difficulty: 'Medium',
    tags: ['mock', 'tier1', 'full-length', '2024'],
    isPremium: false,
    attempts: 15420,
    avgScore: 68.5,
    rating: 4.2
  },
  {
    id: 'ssc-cgl-2024-mock2',
    name: 'SSC CGL Tier 1 Mock Test 2',
    description: 'Advanced mock test with previous year questions',
    category: 'ssc',
    subcategory: 'ssc-cgl',
    duration: 60,
    questions: 100,
    difficulty: 'Hard',
    tags: ['mock', 'tier1', 'advanced', 'pyq'],
    isPremium: true,
    attempts: 8930,
    avgScore: 72.3,
    rating: 4.5
  },
  {
    id: 'ibps-po-2024-mock1',
    name: 'IBPS PO Prelims Mock Test',
    description: 'IBPS PO Preliminary examination mock test',
    category: 'banking',
    subcategory: 'ibps-po',
    duration: 60,
    questions: 100,
    difficulty: 'Medium',
    tags: ['mock', 'prelims', 'banking'],
    isPremium: false,
    attempts: 12350,
    avgScore: 65.8,
    rating: 4.1
  },
  {
    id: 'rrb-ntpc-2024-mock1',
    name: 'RRB NTPC Mock Test 1',
    description: 'RRB NTPC CBT 1 mock test with latest syllabus',
    category: 'railway',
    subcategory: 'rrb-ntpc',
    duration: 90,
    questions: 100,
    difficulty: 'Easy',
    tags: ['mock', 'cbt1', 'railway'],
    isPremium: false,
    attempts: 18760,
    avgScore: 71.2,
    rating: 4.3
  }
]

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    examId: 'ssc-cgl-2024-mock1',
    type: 'mcq',
    category: 'Quantitative Aptitude',
    difficulty: 'Medium',
    content: {
      en: 'What is the value of 25% of 200?',
      hi: '200 का 25% मान क्या है?'
    },
    options: ['40', '50', '60', '80'],
    correctAnswer: 1,
    explanation: {
      en: '25% of 200 = (25/100) × 200 = 50',
      hi: '200 का 25% = (25/100) × 200 = 50'
    },
    marks: 2,
    negativeMarks: 0.5,
    timeLimit: 60
  },
  {
    id: 'q2',
    examId: 'ssc-cgl-2024-mock1',
    type: 'mcq',
    category: 'Reasoning Ability',
    difficulty: 'Easy',
    content: {
      en: 'Which number comes next in the series: 2, 4, 8, 16, ?',
      hi: 'श्रृंखला में अगला नंबर क्या है: 2, 4, 8, 16, ?'
    },
    options: ['24', '32', '28', '20'],
    correctAnswer: 1,
    explanation: {
      en: 'Each number is double the previous number. 16 × 2 = 32',
      hi: 'प्रत्येक संख्या पिछली संख्या का दोगुना है। 16 × 2 = 32'
    },
    marks: 2,
    negativeMarks: 0.5,
    timeLimit: 45
  },
  {
    id: 'q3',
    examId: 'ssc-cgl-2024-mock1',
    type: 'mcq',
    category: 'General Awareness',
    difficulty: 'Medium',
    content: {
      en: 'Who is the current Prime Minister of India?',
      hi: 'भारत के वर्तमान प्रधान मंत्री कौन हैं?'
    },
    options: ['Rahul Gandhi', 'Narendra Modi', 'Amit Shah', 'Yogi Adityanath'],
    correctAnswer: 1,
    explanation: {
      en: 'Narendra Modi is the current Prime Minister of India',
      hi: 'नरेंद्र मोदी भारत के वर्तमान प्रधान मंत्री हैं'
    },
    marks: 2,
    negativeMarks: 0.5,
    timeLimit: 30
  }
]

export const subjects = [
  'Quantitative Aptitude',
  'Reasoning Ability',
  'General Awareness',
  'English Language',
  'Computer Knowledge',
  'Current Affairs',
  'Indian History',
  'Geography',
  'Polity',
  'Economics'
]
