import { createClient } from 'npm:@supabase/supabase-js'
import { z } from 'npm:zod'

const RowSchema = z.object({
  test_id: z.string(),
  type: z.enum(['mcq','tf','fib','match']).optional().default('mcq'),
  content_en: z.string(),
  content_hi: z.string().optional().default(''),
  options: z.string(),
  correct_answer: z.number().int(),
  topic: z.string().optional().default(''),
  section: z.string().optional().default(''),
  explanation_en: z.string().optional().default(''),
  explanation_hi: z.string().optional().default('')
})

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
  try {
    if (!(await isAllowedOrigin(req))) {
      return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (!verifyCsrf(req)) {
      return new Response(JSON.stringify({ error: 'Invalid CSRF token' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
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
    const parsed = z.array(RowSchema).parse(body.rows)
    const client = serviceClient
    const testTitles = [...new Set(parsed.map(r => r.test_id))]
    const { data: tests, error: testsError } = await client.from('tests').select('id, title').in('title', testTitles)
    if (testsError) throw testsError
    const testIdMap = new Map((tests || []).map(t => [t.title, t.id]))
    const payload = parsed.map(r => {
      const test_id = testIdMap.get(r.test_id)
      if (!test_id) throw new Error(`Test with title "${r.test_id}" not found`)
      return {
        test_id: test_id,
        type: r.type || 'mcq',
        content_en: { text: r.content_en },
        content_hi: r.content_hi ? { text: r.content_hi } : null,
        options: r.options.split(',').map(x => x.trim()),
        correct_answer: r.correct_answer,
        topic: r.topic || null,
        section: r.section || null,
        explanation_en: r.explanation_en,
        explanation_hi: r.explanation_hi
      }
    })
    const { error } = await client.from('questions').insert(payload)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    return new Response(JSON.stringify({ inserted: payload.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
