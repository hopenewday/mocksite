export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  edgeCsvUrl: import.meta.env.VITE_EDGE_CSV_URL || '',
  jobsLandingUrl: import.meta.env.VITE_JOBS_URL || 'https://example.com',
  analyticsUrl: import.meta.env.VITE_ANALYTICS_URL || ''
}
