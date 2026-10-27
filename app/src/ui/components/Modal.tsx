import { useEffect, useRef, type ReactNode } from 'react'

/** Modal con <dialog> nativo: trampa de foco, Esc y backdrop ya vienen resueltos por el navegador. */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // clic en el fondo (el <dialog> es el destino del clic solo fuera del contenido): cierra (B-15)
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-32px)] max-w-lg rounded-2xl p-0 shadow-float backdrop:bg-night/60"
    >
      <div className="p-6">
        <h2 id="modal-title" className="mb-3 text-2xl font-extrabold">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  )
}
