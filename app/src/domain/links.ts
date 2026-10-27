/**
 * Todos los enlaces salientes a Fudo llevan UTM, así la atribución llega hasta la cuenta
 * (el alta de fu.do lee utm_source: ver docs/research/fudo-tools.md §4).
 */
export function withUtm(url: string, campaign: string): string {
  const u = new URL(url)
  u.searchParams.set('utm_source', 'diagnostico')
  u.searchParams.set('utm_medium', 'tool')
  u.searchParams.set('utm_campaign', campaign)
  return u.toString()
}
