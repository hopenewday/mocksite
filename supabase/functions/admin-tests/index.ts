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

    const body = await req.json()
    const action = String(body.action || '')
    if (action === 'create') {
      const payload = {
        title: String(body.title || ''),
        exam: String(body.exam || ''),
        difficulty: String(body.difficulty || 'easy'),
        duration_minutes: Number(body.duration_minutes || 30),
        language: String(body.language || 'en')
      }
      const { data, error } = await serviceClient.from('tests').insert(payload).select('id').single()
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      await serviceClient.from('admin_audit_logs').insert({ user_id: userData.user.id, action: 'admin_create_test', meta: payload })
      return new Response(JSON.stringify({ id: data?.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (action === 'delete') {
      const id = String(body.id || '')
      const { error } = await serviceClient.from('tests').delete().eq('id', id)
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      await serviceClient.from('admin_audit_logs').insert({ user_id: userData.user.id, action: 'admin_delete_test', meta: { id } })
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
