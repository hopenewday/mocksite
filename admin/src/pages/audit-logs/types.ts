export type AuditLog = {
  id: string
  user_id: string
  action: string
  details: string
  created_at: string
  profiles: {
    email: string
  }
}
