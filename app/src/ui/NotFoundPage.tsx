import { getCountry } from '../config/countries'
import { copy } from '../content/copy'
import { LANDING_COUNTRIES } from '../domain/showcase'
import { Footer, Header } from './components/Layout'

/** La página 404 que sirve el hosting (dist/404.html): noindex, con salida a la home, las guías y los países. */
export function NotFoundPage() {
  const t = copy.notFoundPage
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-8 pt-12">
        <h1 className="break-words text-[32px] font-extrabold leading-[1.1] sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{t.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="/" className="btn btn-primary">
            {t.home}
          </a>
          <a href="/blog/" className="btn btn-secondary">
            {t.guides}
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-2">
          {LANDING_COUNTRIES.map((code) => (
            <li key={code}>
              <a href={`/${code.toLowerCase()}/`} className="chip">
                {getCountry(code).name}
              </a>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  )
}
