import { useEffect, useRef, type ReactNode } from 'react'

/** Título de cada pantalla: al cambiar de paso recibe el foco (teclado y lectores de pantalla) y sube al inicio. */
export function ScreenTitle({
  children,
  eyebrow,
  className = '',
}: {
  children: ReactNode
  eyebrow?: string
  className?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    window.scrollTo({ top: 0 })
    ref.current?.focus({ preventScroll: true })
  }, [])
  return (
    <div className={className}>
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h1 ref={ref} tabIndex={-1} className="text-[32px] font-extrabold leading-[1.1] sm:text-5xl">
        {children}
      </h1>
    </div>
  )
}
