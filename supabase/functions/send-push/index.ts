import webpush from "npm:web-push@3.6.7"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return new Response(JSON.stringify({ error: 'Missing authorization header' }), { status: 401, headers: corsHeaders })

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const callerClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } })
    const { data: userData, error: userErr } = await callerClient.auth.getUser()
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers: corsHeaders })

    const adminClient = createClient(supabaseUrl, serviceRoleKey)

    const { data: callerProfile, error: profileErr } = await adminClient.from('profiles').select('role').eq('id', userData.user.id).single()
    if (profileErr || !callerProfile || callerProfile.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), { status: 403, headers: corsHeaders })
    }

    const { title, body, url } = await req.json()
    if (!title || !body) return new Response(JSON.stringify({ error: 'title and body are required' }), { status: 400, headers: corsHeaders })

    const { data: subs, error: subsErr } = await adminClient.from('push_subscriptions').select('id, endpoint, p256dh, auth')
    if (subsErr) return new Response(JSON.stringify({ error: subsErr.message }), { status: 500, headers: corsHeaders })

    const payload = JSON.stringify({ title, body, url: url || '/member/dashboard.html' })

    const results = await Promise.allSettled((subs || []).map(function(sub){
      return webpush.sendNotification({
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      }, payload)
    }))

    const expiredIds: string[] = []
    results.forEach(function(result, i){
      if (result.status === 'rejected') {
        const statusCode = (result as any).reason && (result as any).reason.statusCode
        if (statusCode === 404 || statusCode === 410) expiredIds.push((subs as any)[i].id)
      }
    })

    if (expiredIds.length) {
      await adminClient.from('push_subscriptions').delete().in('id', expiredIds)
    }

    const sent = results.filter(function(r){ return r.status === 'fulfilled' }).length

    return new Response(JSON.stringify({ success: true, sent: sent, total: (subs||[]).length, cleaned: expiredIds.length }), { status: 200, headers: corsHeaders })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders })
  }
})