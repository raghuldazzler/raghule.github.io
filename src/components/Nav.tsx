import { useEffect, useState } from 'react'
import { useApp } from '../AppContext'
import { ui } from '../content'
import { useActiveSection } from '../hooks'

const SECTION_IDS = ['about', 'expertise', 'experience', 'projects', 'contact']

function Monogram() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" role="img" aria-label="Raghul Elamathi">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M16 3.2 27 9.6v12.8L16 28.8 5 22.4V9.6z" />
        <circle cx="16" cy="16" r="4.4" />
      </g>
    </svg>
  )
}

export function Nav() {
  const { theme, toggleTheme, lang, setLang, t } = useApp()
  const active = useActiveSection(SECTION_IDS)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
  }, [open])

  const links = SECTION_IDS.map((id) => ({ id, label: t(ui.nav[id as keyof typeof ui.nav]) }))

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a className="nav__brand" href="#top" aria-label="Raghul Elamathi">
        <Monogram />
        <span className="nav__brand-text">
          Raghul<span className="dot">.</span>
        </span>
      </a>

      <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Primary">
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className={active === l.id ? 'is-active' : ''}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="nav__actions">
        <div className="seg" role="group" aria-label={t(ui.toggles.lang)}>
          <button
            type="button"
            className={lang === 'en' ? 'is-active' : ''}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
          <button
            type="button"
            className={lang === 'fr' ? 'is-active' : ''}
            onClick={() => setLang('fr')}
            aria-pressed={lang === 'fr'}
          >
            FR
          </button>
        </div>

        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={t(ui.toggles.theme)}
          title={t(ui.toggles.theme)}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.4 8.4 0 1 0 10.4 10.4Z" />
            </svg>
          )}
        </button>

        <a className="nav__cta" href={`mailto:raghulbolt2002@gmail.com`}>
          {t(ui.hero.book)} <span aria-hidden="true">↗</span>
        </a>

        <button
          type="button"
          className="icon-btn nav__burger"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Menu"
        >
          <span className={`burger ${open ? 'is-open' : ''}`} />
        </button>
      </div>
    </header>
  )
}
