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
    if (role !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const body: any = await req.json()
    const action = String(body.action || '')
    if (action === 'list') {
      const { q, role: filterRole, limit = 50 } = body
      let query = serviceClient.from('profiles').select('id, email, role').limit(Math.min(limit, 200))
      if (filterRole) query = query.eq('role', filterRole)
      if (q) query = query.ilike('email', `%${q}%`)
      const { data, error } = await query
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      return new Response(JSON.stringify({ users: data }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (action === 'create') {
      const { email, password, role: newRole } = body
      const { data: created, error } = await serviceClient.auth.admin.createUser({ email, password, email_confirm: true })
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      if (created.user?.id && newRole) await serviceClient.from('profiles').upsert({ id: created.user.id, email, role: newRole })
      await serviceClient.from('admin_audit_logs').insert({ user_id: userData.user.id, action: 'admin_create_user', meta: { email, role: newRole } })
      return new Response(JSON.stringify({ user: created.user }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (action === 'bulk_update') {
      const { operations } = body as { operations: Array<{ user_id: string; role?: string; status?: string }> }
      for (const op of operations || []) {
        if (op.role) await serviceClient.from('profiles').upsert({ id: op.user_id, role: op.role })
        if (op.status) await serviceClient.auth.admin.updateUserById(op.user_id, { ban_duration: op.status === 'banned' ? 'indefinite' : null })
      }
      await serviceClient.from('admin_audit_logs').insert({ user_id: userData.user.id, action: 'admin_bulk_update_users', meta: { count: (operations || []).length } })
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (action === 'update') {
      const { user_id, role: updRole, status } = body
      if (updRole) await serviceClient.from('profiles').upsert({ id: user_id, role: updRole })
      if (status) await serviceClient.auth.admin.updateUserById(user_id, { ban_duration: status === 'banned' ? 'indefinite' : null })
      await serviceClient.from('admin_audit_logs').insert({ user_id: userData.user.id, action: 'admin_update_user', meta: { user_id, role: updRole, status } })
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (action === 'delete') {
      const { user_id } = body
      const { error } = await serviceClient.auth.admin.deleteUser(user_id)
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      await serviceClient.from('admin_audit_logs').insert({ user_id: userData.user.id, action: 'admin_delete_user', meta: { user_id } })
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (action === 'reset_password') {
      const { user_id, new_password } = body
      const newPass = String(new_password || Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2))
      const { error } = await serviceClient.auth.admin.updateUserById(user_id, { password: newPass })
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      await serviceClient.from('admin_audit_logs').insert({ user_id: userData.user.id, action: 'admin_reset_password', meta: { user_id } })
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (action === 'assign_test') {
      const { user_id, test_id } = body
      const { error } = await serviceClient.from('user_test_assignments').insert({ user_id, test_id })
      if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      await serviceClient.from('admin_audit_logs').insert({ user_id: userData.user.id, action: 'admin_assign_test', meta: { user_id, test_id } })
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
