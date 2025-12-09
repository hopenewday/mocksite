export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  edgeCsvUrl: import.meta.env.VITE_EDGE_CSV_URL || '',
  edgeAdminUsersUrl: import.meta.env.VITE_EDGE_ADMIN_USERS_URL || '',
  edgeAnalyticsUrl: import.meta.env.VITE_EDGE_ANALYTICS_URL || '',
  edgeAdminTestsUrl: import.meta.env.VITE_EDGE_ADMIN_TESTS_URL || '',
  jobsLandingUrl: import.meta.env.VITE_JOBS_URL || 'https://example.com',
  analyticsUrl: import.meta.env.VITE_ANALYTICS_URL || '',
  csrfToken: import.meta.env.VITE_CSRF_TOKEN || ''
}
