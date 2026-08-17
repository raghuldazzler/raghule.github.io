import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang } from './content'

export type Theme = 'light' | 'dark'

interface AppState {
  theme: Theme
  lang: Lang
  toggleTheme: () => void
  setLang: (l: Lang) => void
  t: (entry: Record<Lang, string>) => string
}

const AppContext = createContext<AppState | null>(null)

function readStored<T extends string>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return (v as T) || fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    readStored<Theme>('re-theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'),
  )
  const [lang, setLangState] = useState<Lang>(() => readStored<Lang>('re-lang', 'en'))

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('re-theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    try {
      localStorage.setItem('re-lang', lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  const toggleTheme = useCallback(() => setTheme((p) => (p === 'dark' ? 'light' : 'dark')), [])
  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const t = useCallback((entry: Record<Lang, string>) => entry[lang], [lang])

  const value = useMemo(() => ({ theme, lang, toggleTheme, setLang, t }), [theme, lang, toggleTheme, setLang, t])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
