export type Job = {
  id: string
  title: string
  org: string
  location: string
  category: 'Government' | 'Private' | 'Banking' | 'IT' | 'Education'
  type: 'Full-time' | 'Part-time' | 'Contract'
  experience: 'Fresher' | '0-2 years' | '3-5 years' | '5+ years'
  posted: string
  deadline: string
  description: string
}

export const demoJobs: Job[] = []
