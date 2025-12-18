export type User = {
  id: string
  email: string
  role: 'super_admin' | 'junior_admin' | 'student'
  created_at: string
  updated_at: string
}
