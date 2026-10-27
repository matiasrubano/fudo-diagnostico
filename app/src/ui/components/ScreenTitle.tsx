import { useEffect, useRef, type ReactNode } from 'react'

/** Título de cada pantalla: al cambiar de paso recibe el foco (teclado y lectores de pantalla) y sube al inicio. */
export function ScreenTitle({
  children,
  eyebrow,
  className = '',
  titleClassName = 'break-words text-[32px] font-extrabold leading-[1.1] sm:text-5xl',
  eyebrowClassName = 'eyebrow mb-2',
}: {
  children: ReactNode
  eyebrow?: string
  className?: string
  titleClassName?: string
  eyebrowClassName?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    window.scrollTo({ top: 0 })
    ref.current?.focus({ preventScroll: true })
  }, [])
  return (
    <div className={className}>
      {eyebrow && <p className={eyebrowClassName}>{eyebrow}</p>}
      <h1 ref={ref} tabIndex={-1} className={titleClassName}>
        {children}
      </h1>
    </div>
  )
}
