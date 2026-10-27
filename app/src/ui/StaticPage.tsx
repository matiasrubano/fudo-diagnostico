import type { LandingCountry } from '../domain/showcase'
import type { ShowcaseResponse } from '../server/diagnosisService'
import { copyFor } from '../content/copy'
import { Footer, Header } from './components/Layout'
import { Home, type GuideLink } from './screens/Home'

const noop = () => undefined

/**
 * La home o una landing por país tal como se prerenderiza a HTML (scripts/prerender.ts).
 * Es el mismo árbol que monta App.tsx en la etapa "search": el buscador y los botones son inertes hasta que carga React.
 */
export function StaticPage({
  country,
  showcase,
  guides,
}: {
  country: LandingCountry | null
  showcase: ShowcaseResponse
  guides: GuideLink[]
}) {
  return (
    <>
      <Header />
      <main>
        <Home
          country={country}
          showcase={showcase}
          guides={guides}
          initialQuery=""
          loading={false}
          error={null}
          onSearch={noop}
          onOpenSample={noop}
          onOpening={noop}
        />
        <noscript>
          <p className="mx-auto mt-6 max-w-6xl px-4 text-sm font-medium text-warning-text">
            {copyFor(country).noscript}
          </p>
        </noscript>
      </main>
      <Footer />
    </>
  )
}
