/**
 * Seed content used to power the public site before (or without) Firestore.
 * In Firestore mode the same shapes are stored in the collections below.
 */

export const defaultProfile = {
  name: 'Deepak Raj',
  title: 'Full-Stack Developer',
  titles: ['Full-Stack Developer', 'React Specialist', 'UI/UX Enthusiast', 'AI Explorer'],
  tagline: 'I design and build fast, beautiful, and scalable web experiences.',
  intro:
    'Full-stack developer from India who loves turning complex problems into clean, elegant products. I work primarily with React, Node.js and Firebase, and I care deeply about performance, accessibility and detail.',
  location: 'Vijayawada, India',
  email: '2500032739@kluniversity.in',
  phone: '+91 98765 43210',
  avatar: '/deepak-raj.jpg',
  resumeUrl: '',
  about: {
    introduction:
      "I'm Deepak, a full-stack developer with a strong focus on the React ecosystem. I started coding during college and have since shipped production web apps for startups, open-source communities and personal ventures. I enjoy the whole journey — from shaping an idea and designing the interface, to writing the backend and deploying it at scale.",
    education:
      "I hold a Bachelor's degree in Computer Science, where I built a solid foundation in data structures, algorithms, databases and software engineering. Most of my practical learning, however, came from building real projects and contributing to open source.",
    objectives:
      'To grow into a senior engineering role where I can architect reliable systems, mentor other developers, and drive product decisions with a strong technical perspective.',
    interests:
      'Frontend architecture, design systems, AI-assisted developer tools, cloud infrastructure, performance optimization and creating delightful user interfaces.',
    achievements:
      'Winner of a national hackathon, published open-source packages used by thousands of developers, and mentor to 20+ students entering tech.',
    goals:
      'Launch a product of my own, speak at a major developer conference, and keep contributing to tools that make the web faster and more accessible.',
  },
  socials: {
    github: 'https://github.com/dashboard',
    linkedin: 'https://www.linkedin.com/feed/',
    twitter: 'https://x.com/home?lang=en',
  },
}

export const defaultSettings = {
  siteName: 'Deepak Raj',
  tagline: 'Full-Stack Developer & UI/UX Enthusiast',
  footerText:
    'Crafting premium web experiences with React, Firebase and a strong eye for design. Available for freelance and full-time opportunities.',
  contactEmail: '2500032739@kluniversity.in',
  socials: {
    github: 'https://github.com/dashboard',
    linkedin: 'https://www.linkedin.com/feed/',
    twitter: 'https://x.com/home?lang=en',
  },
}

export const defaultSkills = [
  { id: 'sk1', name: 'JavaScript', category: 'Programming Languages', level: 92 },
  { id: 'sk2', name: 'Python', category: 'Programming Languages', level: 85 },
  { id: 'sk3', name: 'TypeScript', category: 'Programming Languages', level: 80 },
  { id: 'sk4', name: 'Java', category: 'Programming Languages', level: 72 },
  { id: 'sk5', name: 'React', category: 'Frontend Development', level: 95 },
  { id: 'sk6', name: 'Next.js', category: 'Frontend Development', level: 85 },
  { id: 'sk7', name: 'Tailwind CSS', category: 'Frontend Development', level: 93 },
  { id: 'sk8', name: 'HTML & CSS', category: 'Frontend Development', level: 96 },
  { id: 'sk9', name: 'Node.js', category: 'Backend Development', level: 88 },
  { id: 'sk10', name: 'Express.js', category: 'Backend Development', level: 84 },
  { id: 'sk11', name: 'REST APIs', category: 'Backend Development', level: 90 },
  { id: 'sk12', name: 'Firebase', category: 'Database', level: 91 },
  { id: 'sk13', name: 'MongoDB', category: 'Database', level: 80 },
  { id: 'sk14', name: 'PostgreSQL', category: 'Database', level: 74 },
  { id: 'sk15', name: 'TensorFlow', category: 'AI / Machine Learning', level: 70 },
  { id: 'sk16', name: 'Scikit-learn', category: 'AI / Machine Learning', level: 72 },
  { id: 'sk17', name: 'Git & GitHub', category: 'Developer Tools', level: 92 },
  { id: 'sk18', name: 'Docker', category: 'Developer Tools', level: 76 },
  { id: 'sk19', name: 'VS Code', category: 'Developer Tools', level: 95 },
  { id: 'sk20', name: 'Vercel', category: 'Developer Tools', level: 87 },
]

export const skillCategories = [
  'Programming Languages',
  'Frontend Development',
  'Backend Development',
  'Database',
  'AI / Machine Learning',
  'Developer Tools',
]

export const defaultProjects = [
  {
    id: 'pj1',
    name: 'NexaBoard Analytics',
    description:
      'A real-time SaaS analytics dashboard with interactive charts, team workspaces, role-based access and a fully customizable reporting engine.',
    category: 'Web App',
    tech: ['React', 'Tailwind CSS', 'Firebase', 'Recharts'],
    github: 'https://github.com/dashboard',
    live: 'https://nexaboard-demo.vercel.app',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    featured: true,
    createdAt: '2025-11-02T10:00:00.000Z',
  },
  {
    id: 'pj2',
    name: 'ShopSwift E-Commerce',
    description:
      'Full-featured online store with cart, checkout, Stripe payments, order tracking and an admin panel for inventory management.',
    category: 'E-Commerce',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: 'https://github.com/dashboard',
    live: 'https://shopswift-demo.vercel.app',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
    featured: true,
    createdAt: '2025-09-18T10:00:00.000Z',
  },
  {
    id: 'pj3',
    name: 'MediMate AI Assistant',
    description:
      'An AI-powered health triage assistant that suggests possible conditions from symptoms using a trained ML model and explains its reasoning.',
    category: 'AI / ML',
    tech: ['Python', 'Flask', 'TensorFlow', 'React'],
    github: 'https://github.com/dashboard',
    live: 'https://medimate-demo.vercel.app',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    featured: true,
    createdAt: '2025-07-05T10:00:00.000Z',
  },
  {
    id: 'pj4',
    name: 'DevFolio CMS',
    description:
      'A headless portfolio content system where developers manage profile, projects and blogs from a polished admin dashboard.',
    category: 'Web App',
    tech: ['React', 'Vite', 'Firebase', 'Tailwind CSS'],
    github: 'https://github.com/dashboard',
    live: 'https://devfolio-demo.vercel.app',
    image:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=900&q=80',
    featured: false,
    createdAt: '2025-05-22T10:00:00.000Z',
  },
  {
    id: 'pj5',
    name: 'TaskFlow Collaboration',
    description:
      'A Kanban-style team workspace with real-time updates via Firestore, drag-and-drop boards, comments and activity feeds.',
    category: 'Productivity',
    tech: ['React', 'Firebase', 'Framer Motion', 'Tailwind CSS'],
    github: 'https://github.com/dashboard',
    live: 'https://taskflow-demo.vercel.app',
    image:
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=900&q=80',
    featured: true,
    createdAt: '2025-03-14T10:00:00.000Z',
  },
  {
    id: 'pj6',
    name: 'VisionIQ Image Classifier',
    description:
      'Browser-based image classification tool that identifies everyday objects with confidence scores, built on a fine-tuned CNN.',
    category: 'AI / ML',
    tech: ['Python', 'OpenCV', 'TensorFlow', 'Streamlit'],
    github: 'https://github.com/dashboard',
    live: 'https://visioniq-demo.vercel.app',
    image:
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80',
    featured: false,
    createdAt: '2025-01-30T10:00:00.000Z',
  },
]

export const projectCategories = ['Web App', 'E-Commerce', 'AI / ML', 'Productivity', 'Mobile', 'Open Source']

export const defaultEducation = [
  {
    id: 'ed1',
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'Andhra University College of Engineering',
    period: '2021 — 2025',
    grade: 'CGPA: 8.7/10',
    description:
      'Studied data structures, algorithms, operating systems, DBMS and software engineering. Led the campus developer community and shipped multiple full-stack projects.',
  },
  {
    id: 'ed2',
    degree: 'Higher Secondary (MPC)',
    institution: 'Sri Chaitanya Junior College',
    period: '2019 — 2021',
    grade: '94.2%',
    description: 'Focused on mathematics, physics and chemistry with a strong interest in computational problem solving.',
  },
  {
    id: 'ed3',
    degree: 'Full-Stack Web Development Bootcamp',
    institution: 'Udemy / Online',
    period: '2022',
    grade: 'Certificate of Completion',
    description: 'Intensive hands-on program covering React, Node.js, REST APIs, databases and deployment workflows.',
  },
]

export const defaultCertificates = [
  {
    id: 'ct1',
    name: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta (Coursera)',
    date: '2024-08-12',
    credentialId: 'META-FE-88213',
    link: 'https://coursera.org',
  },
  {
    id: 'ct2',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    date: '2024-04-02',
    credentialId: 'AWS-CCP-44120',
    link: 'https://aws.amazon.com/certification/',
  },
  {
    id: 'ct3',
    name: 'Google Data Analytics Professional Certificate',
    issuer: 'Google (Coursera)',
    date: '2023-11-20',
    credentialId: 'GOOG-DA-29011',
    link: 'https://coursera.org',
  },
  {
    id: 'ct4',
    name: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI',
    date: '2023-06-15',
    credentialId: 'DLAI-ML-77302',
    link: 'https://deeplearning.ai',
  },
]

export const defaultAchievements = [
  {
    id: 'ac1',
    title: 'Winner — National Hackathon 2024',
    description: 'Led a 4-person team to build an offline-first education app that won first place among 400+ teams.',
    icon: 'Trophy',
    year: '2024',
  },
  {
    id: 'ac2',
    title: '10k+ GitHub Contributions',
    description: 'Consistent open-source activity across React, Firebase and developer-tooling repositories.',
    icon: 'Github',
    year: '2025',
  },
  {
    id: 'ac3',
    title: 'Top 5% — LeetCode Global Ranking',
    description: 'Solved 700+ algorithm problems with a peak global ranking in the top 5% of users.',
    icon: 'Code',
    year: '2024',
  },
  {
    id: 'ac4',
    title: 'Mentored 20+ Students',
    description: 'Guided juniors through web-development fundamentals, resume reviews and interview preparation.',
    icon: 'Users',
    year: '2023',
  },
]

export const defaultMessages = []

export function buildDefaultData() {
  return {
    profile: { ...defaultProfile },
    settings: { ...defaultSettings },
    skills: defaultSkills.map((item) => ({ ...item })),
    projects: defaultProjects.map((item) => ({ ...item })),
    education: defaultEducation.map((item) => ({ ...item })),
    certificates: defaultCertificates.map((item) => ({ ...item })),
    achievements: defaultAchievements.map((item) => ({ ...item })),
    messages: [],
    users: [],
  }
}
