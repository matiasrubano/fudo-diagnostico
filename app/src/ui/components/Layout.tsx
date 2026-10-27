import type { ReactNode } from 'react'
import { copy } from '../../content/copy'
import { SimulatedBadge } from './ProvenanceBadge'

export function Header() {
  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2">
        <a
          href="/"
          className="flex min-h-touch items-center gap-2 font-display text-xl font-extrabold"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500 text-lg text-white"
          >
            D
          </span>
          {copy.brand.name}
          <span className="rounded-pill bg-night px-2 py-0.5 text-xs font-semibold text-white">
            {copy.brand.demoTag}
          </span>
        </a>
        <a
          href="/blog/"
          className="inline-flex min-h-touch items-center px-2 text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          {copy.nav.blog}
        </a>
      </div>
    </header>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'simulado') return <SimulatedBadge />
  return (
    <span
      className={`rounded-pill px-2.5 py-0.5 text-xs font-semibold ${
        status === 'real' ? 'bg-success-bg text-success-text' : 'bg-surface text-muted'
      }`}
    >
      {copy.footer.status[status]}
    </span>
  )
}

export function Footer() {
  const f = copy.footer
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-2xl font-extrabold">{f.title}</h2>
        <p className="mt-1 text-sm text-muted">{f.disclaimer}</p>
        {/* Mobile: tarjetas apiladas. Desde sm: tabla. */}
        <ul className="mt-4 space-y-3 sm:hidden">
          {f.rows.map((row) => (
            <li key={row.what} className="rounded-xl border border-line p-3 text-sm">
              <p className="font-semibold">{row.what}</p>
              <p className="my-1.5">
                <StatusBadge status={row.status} />
              </p>
              <p className="text-muted">{row.detail}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 hidden overflow-x-auto rounded-xl border border-line sm:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface text-ink">
              <tr>
                <th className="px-3 py-2 font-semibold">{f.columns.what}</th>
                <th className="px-3 py-2 font-semibold">{f.columns.status}</th>
                <th className="px-3 py-2 font-semibold">{f.columns.detail}</th>
              </tr>
            </thead>
            <tbody>
              {f.rows.map((row) => (
                <tr key={row.what} className="border-t border-line align-top">
                  <td className="px-3 py-2 font-medium">{row.what}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-2 text-muted">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm">
          <a href="/debug" className="inline-flex min-h-touch items-center font-medium underline">
            {f.debug}
          </a>
        </p>
      </div>
    </footer>
  )
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto max-w-3xl px-4 pb-8 pt-8 sm:pt-12">{children}</main>
}
