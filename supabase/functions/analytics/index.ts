import { createClient } from 'npm:@supabase/supabase-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

async function isAllowedOrigin(req: Request) {
  const origin = req.headers.get('Origin') || ''
  const allow = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(s => s.trim()).filter(Boolean)
  if (allow.length === 0) return true
  return allow.includes(origin)
}

function verifyCsrf(req: Request) {
  const secret = Deno.env.get('CSRF_SECRET') || ''
  const token = req.headers.get('X-CSRF-Token') || ''
  return secret && token && secret === token
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (!(await isAllowedOrigin(req))) {
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  if (!verifyCsrf(req)) {
    return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const token = authHeader.replace('Bearer ', '')
    const publicClient = createClient(Deno.env.get('SUPABASE_URL') as string, Deno.env.get('SUPABASE_ANON_KEY') as string)
    const { data: userData, error: userErr } = await publicClient.auth.getUser(token)
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const serviceClient = createClient(Deno.env.get('SUPABASE_URL') as string, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string)
    const { data: prof } = await serviceClient.from('profiles').select('role').eq('id', userData.user.id).single()
    const role = (prof as any)?.role || 'user'
    if (role !== 'super_admin' && role !== 'junior_admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: tests } = await serviceClient.from('tests').select('id, title')
    const { data: attempts } = await serviceClient.from('user_attempts').select('score, test_id, completed_at')

    const totalTests = (tests || []).length
    const totalAttempts = (attempts || []).length
    const avgScore = Math.round(((attempts || []).reduce((sum: number, r: any) => sum + (r.score || 0), 0) / Math.max(totalAttempts, 1)) || 0)
    const completionRate = Math.round(((attempts || []).filter((r: any) => r.completed_at).length / Math.max(totalAttempts, 1)) * 100)
    const byTest: Record<string, number> = {}
    (attempts || []).forEach((r: any) => { byTest[r.test_id] = (byTest[r.test_id] || 0) + 1 })
    const popular = Object.entries(byTest).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([test_id, count]) => ({ test_id, count }))

    const result = { totalTests, totalAttempts, avgScore, completionRate, popular }
    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
