import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

/** Tiempo que una pantalla recién abierta ignora los clics (el segundo toque de un doble clic cae acá). */
export const SETTLE_MS = 450

/** Mientras la pantalla "se asienta", las opciones no reciben toques (Playwright y lectores esperan solos). */
export const NO_CLICKS: CSSProperties = { pointerEvents: 'none' }

/**
 * B-1: un doble clic o doble toque contestaba la pregunta siguiente en silencio, porque el segundo clic
 * caía sobre la pantalla nueva. Las opciones de cada pantalla ignoran toques los primeros SETTLE_MS:
 *  - `settled` apaga los eventos del puntero (se aplica con `style={settled ? undefined : NO_CLICKS}`);
 *  - `guard(fn)` hace lo mismo para teclado (Enter dos veces seguidas).
 */
export function useSettled(ms: number = SETTLE_MS) {
  const [settled, setSettled] = useState(false)
  const since = useRef(Date.now())
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(true), ms)
    return () => window.clearTimeout(id)
  }, [ms])
  const guard = useCallback(
    <A extends unknown[]>(fn: (...args: A) => void) =>
      (...args: A) => {
        if (Date.now() - since.current >= ms) fn(...args)
      },
    [ms],
  )
  return { settled, guard }
}
