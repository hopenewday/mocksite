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
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
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
    const body = await req.json()
    const parsed = z.array(RowSchema).parse(body.rows)
    const client = createClient(Deno.env.get('SUPABASE_URL') as string, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string)
    const payload = parsed.map(r => ({
      test_id: r.test_id,
      type: r.type || 'mcq',
      content_en: { text: r.content_en },
      content_hi: r.content_hi ? { text: r.content_hi } : null,
      options: r.options.split(',').map(x => x.trim()),
      correct_answer: r.correct_answer,
      topic: r.topic || null,
      section: r.section || null,
      explanation_en: r.explanation_en,
      explanation_hi: r.explanation_hi
    }))
    const { error } = await client.from('questions').insert(payload)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    return new Response(JSON.stringify({ inserted: payload.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
