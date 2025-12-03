import { env } from '@/config/env'

let redirecting = false

function showSpinner() {
  const el = document.createElement('div')
  el.id = 'jobs-redirect-overlay'
  el.setAttribute('aria-live', 'polite')
  el.className = 'fixed inset-0 z-50 grid place-items-center bg-black/30 backdrop-blur-sm'
  el.innerHTML = '<div class="animate-spin h-10 w-10 rounded-full border-4 border-brand border-t-transparent"></div>'
  document.body.appendChild(el)
}

function hideSpinner() {
  const el = document.getElementById('jobs-redirect-overlay')
  if (el) el.remove()
}

interface LogPayload {
  ts: number
  result: 'success' | 'timeout' | 'error'
  detail: string
  url: string
  ua: string
}

function log(result: 'success' | 'timeout' | 'error', detail?: string) {
  const payload: LogPayload = {
    ts: Date.now(),
    result,
    detail: detail || '',
    url: env.jobsLandingUrl,
    ua: navigator.userAgent
  }
  try {
    if (env.analyticsUrl && 'sendBeacon' in navigator) navigator.sendBeacon(env.analyticsUrl, JSON.stringify(payload))
  } catch {}
  console[result === 'success' ? 'info' : 'warn']('[jobsRedirect]', result, detail || '')
}

function targetUrl(el: Element): string {
  const custom = el.getAttribute('data-jobs-url') || ''
  const token = (window as { __APP_AUTH_TOKEN?: string }).__APP_AUTH_TOKEN || ''
  const base = custom || env.jobsLandingUrl
  return token ? `${base}${base.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}` : base
}

function handler(e: Event) {
  if (redirecting) return
  const t = e.target as Element
  const el = t.closest('[data-jobs-nav], .jobs-nav')
  if (!el) return
  e.preventDefault()
  e.stopPropagation()
  redirecting = true
  showSpinner()
  const url = targetUrl(el)
  const start = performance.now()
  try {
    // Use replace to avoid extra history entries
    window.location.replace(url)
  } catch (err) {
    hideSpinner()
    redirecting = false
    log('error', (err as Error)?.message)
    // Fallback
    window.location.href = url
  }
  // Timeout watchdog (5s)
  setTimeout(() => {
    if (!document.hidden) { // if still on this document
      hideSpinner()
      redirecting = false
      log('timeout')
      // Fallback attempt
      window.location.href = url
    }
  }, 5000)
  // Performance metric log
  setTimeout(() => { log('success', `${Math.round(performance.now() - start)}ms`) }, 600)
}

export function initJobsRedirect() {
  document.addEventListener('click', handler, { passive: false })
  document.addEventListener('touchend', handler, { passive: false })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handler(e)
  })
}
