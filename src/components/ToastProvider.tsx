import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

type ToastType = 'success' | 'info' | 'error'

type Toast = {
  id: string
  message: string
  type?: ToastType
}

type ToastContextType = {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, durationMs?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info', durationMs: number = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const toast: Toast = { id, message, type }
    setToasts((curr) => [...curr, toast])

    window.setTimeout(() => {
      removeToast(id)
    }, durationMs)
  }, [removeToast])

  const value = useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 bottom-4 z-[9999] flex flex-col items-end gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={`max-w-xs w-full rounded-xl px-4 py-3 shadow-lg text-sm text-white transition-all transform origin-bottom-right 
              ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-rose-600' : 'bg-slate-700'}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
