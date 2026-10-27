import type { ReactNode } from 'react'
import { getCountry } from '../../config/countries'
import { copy } from '../../content/copy'
import type { CountryCode } from '../../domain/types'
import { SimulatedBadge } from './ProvenanceBadge'

/**
 * Logo oficial de Fudo (public/brand/*.svg). Brasil se vende como "Deli" y no tenemos su logo:
 * ahí se muestra el nombre en texto.
 */
export function BrandLogo({
  country,
  tone = 'light',
}: {
  country?: CountryCode | null
  /** light = logo blanco (para fondos azul noche) · dark = logo naranja (fondos claros) */
  tone?: 'light' | 'dark'
}) {
  if (country === 'BR') {
    return (
      <span
        className={`font-display text-2xl font-extrabold leading-none ${tone === 'light' ? 'text-white' : 'text-primary-text'}`}
      >
        Deli
      </span>
    )
  }
  return (
    <img
      src={tone === 'light' ? '/brand/fudo-logo-white.svg' : '/brand/fudo-logo.svg'}
      alt={copy.brand.logoAlt}
      width={100}
      height={25}
      className="h-[25px] w-[100px]"
    />
  )
}

export function Header({ country }: { country?: CountryCode | null }) {
  return (
    <header className="bg-night text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2">
        <a href="/" className="flex min-h-touch items-center gap-3">
          <BrandLogo country={country} />
          <span className="hidden h-5 w-px bg-white/30 sm:block" aria-hidden="true" />
          <span className="hidden font-display text-lg font-bold sm:inline">{copy.brand.name}</span>
          <span className="rounded-pill border border-white/50 px-2 py-0.5 text-xs font-semibold text-on-night-muted">
            {copy.brand.demoTag}
          </span>
        </a>
        <a
          href="/blog/"
          className="inline-flex min-h-touch min-w-touch items-center justify-center px-3 text-sm font-semibold text-white underline-offset-4 hover:underline"
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

/** Barra final azul noche: logo, aviso de "no oficial" y enlaces. */
export function NightBar({ country }: { country?: CountryCode | null }) {
  const product = country ? getCountry(country).productName : 'Fudo'
  return (
    <div className="bg-night text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <BrandLogo country={country} />
        <p className="max-w-xl text-sm text-on-night-muted">{copy.footer.unofficial(product)}</p>
        <p className="flex flex-wrap gap-x-4 text-sm font-semibold">
          <a href="/blog/" className="inline-flex min-h-touch items-center underline">
            {copy.nav.blog}
          </a>
        </p>
      </div>
    </div>
  )
}

export function Footer({ country }: { country?: CountryCode | null }) {
  const f = copy.footer
  // En Brasil el producto es Deli: el pie legal no puede decir "Fudo" ni "fu.do" (B-12)
  const c = country ? getCountry(country) : null
  const product = c?.productName ?? 'Fudo'
  const site = c ? new URL(c.fudoSiteUrl).hostname : 'fu.do'
  const rows = f.rows(product, site)
  return (
    <footer className="mt-16">
      <div className="border-t border-line bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h2 className="text-2xl font-extrabold">{f.title}</h2>
          <p className="mt-1 text-sm text-muted">{f.disclaimer(product)}</p>
          {/* Mobile: tarjetas apiladas. Desde sm: tabla. */}
          <ul className="mt-4 space-y-3 sm:hidden">
            {rows.map((row) => (
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
                {rows.map((row) => (
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
        </div>
      </div>
      <NightBar country={country} />
    </footer>
  )
}

/** Pie corto para las páginas estáticas del blog. */
export function SimpleFooter({ note }: { note: string }) {
  return (
    <footer className="mt-16">
      <div className="mx-auto max-w-3xl px-4 pb-8 text-sm text-muted">
        <p>{note}</p>
      </div>
      <NightBar />
    </footer>
  )
}

export function Page({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <main className={`mx-auto px-4 pb-8 pt-8 sm:pt-12 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
      {children}
    </main>
  )
}
