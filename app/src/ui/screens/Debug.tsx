import { useEffect, useState } from 'react'
import { clearEvents, funnelCounts, readEvents } from '../../analytics/events'
import { copy } from '../../content/copy'

const d = copy.debug

/** /debug: tabla de eventos + embudo, para mostrar la instrumentación en la entrevista. */
export function Debug() {
  const [events, setEvents] = useState(readEvents)
  const funnel = funnelCounts(events)
  const max = Math.max(1, ...funnel.map((f) => f.sessions))

  // /debug es una ruta de la SPA: sin esto hereda el <title> de la home (y no debe indexarse)
  useEffect(() => {
    document.title = d.documentTitle
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)
    return () => {
      robots.remove()
    }
  }, [])

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-4xl font-extrabold">{d.title}</h1>
      <p className="mt-2 text-muted">{d.intro}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href="/" className="btn btn-secondary">
          {d.back}
        </a>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            clearEvents()
            setEvents([])
          }}
        >
          {d.clear}
        </button>
      </div>

      <section className="mt-8" aria-labelledby="funnel-title">
        <h2 id="funnel-title" className="text-2xl font-extrabold">
          {d.funnel}
        </h2>
        <p className="mb-3 text-sm text-muted">{d.funnelHint}</p>
        <ul className="space-y-2">
          {funnel.map((step) => (
            <li
              key={step.name}
              className="grid grid-cols-[150px_1fr_32px] items-center gap-3 text-sm"
            >
              <code className="truncate">{step.name}</code>
              <div className="h-5 overflow-hidden rounded-md bg-line" aria-hidden="true">
                <div
                  className="h-full bg-primary-500"
                  style={{ width: `${(step.sessions / max) * 100}%` }}
                />
              </div>
              <span className="text-right font-semibold">{step.sessions}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="events-title">
        <h2 id="events-title" className="text-2xl font-extrabold">
          {d.events} ({events.length})
        </h2>
        {events.length === 0 ? (
          <p className="mt-3 text-muted">{d.empty}</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="px-3 py-2">{d.cols.time}</th>
                  <th className="px-3 py-2">{d.cols.session}</th>
                  <th className="px-3 py-2">{d.cols.event}</th>
                  <th className="px-3 py-2">{d.cols.props}</th>
                </tr>
              </thead>
              <tbody>
                {[...events].reverse().map((e, i) => (
                  <tr key={`${e.at}-${i}`} className="border-t border-line align-top">
                    <td className="whitespace-nowrap px-3 py-2">
                      {new Date(e.at).toLocaleTimeString('es-AR')}
                    </td>
                    <td className="px-3 py-2">
                      <code>{e.session}</code>
                    </td>
                    <td className="px-3 py-2 font-semibold">{e.name}</td>
                    <td className="break-all px-3 py-2">
                      <code>{JSON.stringify(e.props)}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
