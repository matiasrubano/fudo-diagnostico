import type { IncomingMessage, ServerResponse } from 'node:http'
import { loadEnv, type Plugin } from 'vite'

type Handler = { default: { fetch: (request: Request) => Promise<Response> } }

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks)
}

/**
 * Monta app/api/*.ts como middleware del dev server de Vite.
 * Así `npm run dev` funciona sin Vercel CLI ni login, con los MISMOS handlers que corren en producción.
 */
export function apiDevServer(): Plugin {
  return {
    name: 'fudo-api-dev-server',
    apply: 'serve',
    configureServer(server) {
      // El .env.local / .env del proyecto llega a process.env (solo lo lee el servidor)
      Object.assign(process.env, {
        ...loadEnv(server.config.mode, server.config.root, ''),
        ...process.env,
      })

      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const match = req.url?.match(/^\/api\/([a-z-]+)(?:\?|$)/)
        if (!match) return next()
        try {
          const mod = (await server.ssrLoadModule(`/api/${match[1]}.ts`)) as Handler
          const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
          const request = new Request(`http://${req.headers.host ?? 'localhost'}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: hasBody ? new Uint8Array(await readBody(req)) : undefined,
          })
          const response = await mod.default.fetch(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          server.ssrFixStacktrace(error as Error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Error interno del dev server' }))
          console.error(error)
        }
      })
    },
  }
}
