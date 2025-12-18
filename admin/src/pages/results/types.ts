export type Result = {
  id: string
  test_id: string
  user_id: string
  score: number
  completed_at: string
  tests: {
    title: string
  }
  profiles: {
    email: string
  }
}
