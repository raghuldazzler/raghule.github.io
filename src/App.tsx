import { useApp } from './AppContext'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About, Contact, Credentials, EngineShowcase, Experience, Expertise, Projects } from './components/Sections'
import { profile, ui } from './content'

function Marquee() {
  const items = [
    'SOLIDWORKS',
    'CATIA V5',
    'GD&T',
    'LEAN MANUFACTURING',
    'DFM',
    'ANSYS',
    'ROBOTICS',
    'NX CAD',
    'SIX SIGMA',
    'INDUSTRIALISATION',
  ]
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {row.map((s, i) => (
          <span key={`${s}-${i}`}>
            {s}
            <i>◆</i>
          </span>
        ))}
      </div>
    </div>
  )
}

function Footer() {
  const { t } = useApp()
  return (
    <footer className="footer">
      <span className="mono">
        © {new Date().getFullYear()} {profile.name}. {t(ui.footer.rights)}
      </span>
      <span className="mono">{t(ui.footer.built)}</span>
      <a className="mono footer__top" href="#top">
        ↑ Top
      </a>
    </footer>
  )
}

export function App() {
  return (
    <>
      <div className="grid-bg" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Expertise />
        <Experience />
        <EngineShowcase />
        <Projects />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
