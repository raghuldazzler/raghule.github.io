import { useState } from 'react'
import { useApp } from '../AppContext'
import {
  awards,
  certifications,
  domainSkills,
  education,
  experience,
  languages,
  portfolioFile,
  profile,
  projects,
  resumeFile,
  softwareSkills,
  ui,
} from '../content'
import { useReveal } from '../hooks'
import { Scene } from '../three/Scene'

const PORTRAIT_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect width='400' height='500' fill='%23e4e4e4'/%3E%3Ccircle cx='200' cy='185' r='78' fill='%23bdbdbd'/%3E%3Cpath d='M70 470a130 130 0 0 1 260 0z' fill='%23bdbdbd'/%3E%3C/svg%3E"

function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <header className="sec__head" data-reveal>
      <span className="sec__label mono">{label}</span>
      <h2 className="sec__title">{title}</h2>
    </header>
  )
}

export function About() {
  const { t, lang } = useApp()
  const ref = useReveal<HTMLElement>()

  return (
    <section className="sec sec--about" id="about" ref={ref}>
      <SectionHead label={t(ui.about.label)} title={t(ui.about.title)} />

      <div className="about__grid">
        <div className="about__aside" data-reveal>
          <figure className="portrait">
            <img
              src="portrait.jpeg"
              alt={t(ui.about.portraitName)}
              onError={(e) => {
                e.currentTarget.src = PORTRAIT_FALLBACK
              }}
            />
            <span className="portrait__tick portrait__tick--tl" aria-hidden="true" />
            <span className="portrait__tick portrait__tick--br" aria-hidden="true" />
            <figcaption className="portrait__cap">
              <strong>{t(ui.about.portraitName)}</strong>
              <span className="mono">{t(ui.about.portraitRole)}</span>
            </figcaption>
            <span className="portrait__badge mono">
              <i className="dot-live" aria-hidden="true" />
              {t(ui.about.available)}
            </span>
          </figure>
        </div>

        <div className="about__main">
          <div className="about__body" data-reveal>
            <p className="lead">{t(ui.about.body)}</p>
            <div className="btn-row">
              <a className="btn btn--solid" href={resumeFile[lang]} download>
                {t(ui.about.downloadCv)} <span aria-hidden="true">↓</span>
              </a>
              <a className="btn" href={portfolioFile} download>
                {t(ui.about.downloadPortfolio)} <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <div className="about__lower">
            <div className="about__edu" data-reveal>
              <h3 className="minor-title mono">{t(ui.about.educationLabel)}</h3>
              {education.map((e) => (
                <article className="edu" key={e.school}>
                  <span className="edu__period mono">{e.period}</span>
                  <h4>{e.school}</h4>
                  <p>{t(e.degree)}</p>
                  <span className="edu__place mono">{t(e.place)}</span>
                </article>
              ))}
            </div>

            <div className="about__bearing" data-reveal>
              <Scene kind="bearing" spin={0.15} />
              <span className="mech-tag mono">{t(ui.showcase.bearingTag)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EngineShowcase() {
  const { t } = useApp()
  const ref = useReveal<HTMLElement>()

  return (
    <section className="showcase" ref={ref}>
      <div className="showcase__inner">
        <div className="showcase__text" data-reveal>
          <span className="sec__label mono">{t(ui.showcase.engineLabel)}</span>
          <h2 className="sec__title">{t(ui.showcase.engineTitle)}</h2>
          <p className="lead">{t(ui.showcase.engineBody)}</p>
        </div>
        <div className="showcase__stage" data-reveal>
          <Scene kind="engine" spin={0.12} />
          <span className="mech-tag mono">{t(ui.showcase.engineTag)}</span>
        </div>
      </div>
    </section>
  )
}

export function Expertise() {
  const { t } = useApp()
  const ref = useReveal<HTMLElement>()

  return (
    <section className="sec sec--expertise" id="expertise" ref={ref}>
      <SectionHead label={t(ui.expertise.label)} title={t(ui.expertise.title)} />

      <div className="skills">
        <div className="skills__col" data-reveal>
          <h3 className="minor-title mono">{t(ui.expertise.software)}</h3>
          <ul className="bars">
            {softwareSkills.map((s) => (
              <li key={s.name}>
                <div className="bars__row">
                  <span>{s.name}</span>
                  <span className="mono">{s.level}%</span>
                </div>
                <div className="bar">
                  <i style={{ '--w': `${s.level}%` } as React.CSSProperties} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="skills__col" data-reveal>
          <h3 className="minor-title mono">{t(ui.expertise.domains)}</h3>
          <ul className="chips">
            {domainSkills.map((d) => (
              <li key={d.en}>{t(d)}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  const { t, lang } = useApp()
  const ref = useReveal<HTMLElement>()

  return (
    <section className="sec sec--experience" id="experience" ref={ref}>
      <SectionHead label={t(ui.experienceSection.label)} title={t(ui.experienceSection.title)} />

      <ol className="timeline">
        {experience.map((e) => (
          <li className="tl" key={e.company + e.period} data-reveal>
            <div className="tl__marker" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
              </svg>
            </div>
            <div className="tl__period mono">{e.period}</div>
            <div className="tl__body">
              <h3>{t(e.role)}</h3>
              <p className="tl__company">
                {e.company} <span className="sep">/</span> <span className="mono">{t(e.place)}</span>
              </p>
              <ul>
                {e.bullets[lang].map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ProjectCard({ p }: { p: (typeof projects)[number] }) {
  const { t } = useApp()
  const [open, setOpen] = useState(false)

  return (
    <article className={`proj ${open ? 'is-open' : ''}`} data-reveal>
      <div className="proj__media">
        {p.images.map((img, i) => (
          <figure key={img.src} className={`proj__img ${img.wide ? 'proj__img--wide' : ''}`}>
            <img src={img.src} alt={`${t(p.title)} — ${i + 1}`} loading="lazy" />
          </figure>
        ))}
      </div>

      <div className="proj__info">
        <span className="proj__index">{p.index}.</span>
        <span className="proj__tag mono">
          {t(p.tag)} <span className="sep">/</span> {p.year}
        </span>
        <h3 className="proj__title">{t(p.title)}</h3>
        <p className="proj__summary">{t(p.summary)}</p>

        <div className="proj__detail" hidden={!open}>
          <p>{t(p.detail)}</p>
        </div>

        <ul className="proj__stack">
          {p.stack.map((s) => (
            <li key={s} className="mono">
              {s}
            </li>
          ))}
        </ul>

        <button type="button" className="link-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? t(ui.projectsSection.hideDetail) : t(ui.projectsSection.viewDetail)}
          <span aria-hidden="true">{open ? '↑' : '↓'}</span>
        </button>
      </div>
    </article>
  )
}

export function Projects() {
  const { t } = useApp()
  const ref = useReveal<HTMLElement>()

  return (
    <section className="sec sec--projects" id="projects" ref={ref}>
      <div className="projects__head">
        <SectionHead label={t(ui.projectsSection.label)} title={t(ui.projectsSection.title)} />
        <div className="projects__arm" data-reveal>
          <Scene kind="arm" spin={0} parallax={false} />
          <span className="mech-tag mono">{t(ui.showcase.armTag)}</span>
        </div>
      </div>
      <div className="projects">
        {projects.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  )
}

export function Credentials() {
  const { t } = useApp()
  const ref = useReveal<HTMLElement>()

  return (
    <section className="sec sec--credentials" ref={ref}>
      <SectionHead label={t(ui.credentials.label)} title={t(ui.credentials.certs)} />

      <div className="cred">
        <ul className="cred__certs" data-reveal>
          {certifications.map((c) => (
            <li key={c.name}>
              <span className="cred__badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              <div>
                <strong>{c.name}</strong>
                <span>{c.issuer}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="cred__side">
          <div data-reveal>
            <h3 className="minor-title mono">{t(ui.credentials.awards)}</h3>
            <ul className="awards">
              {awards.map((a) => (
                <li key={a.title}>
                  <div className="awards__top">
                    <strong>{a.title}</strong>
                    <span className="mono">{a.date}</span>
                  </div>
                  <p>{t(a.desc)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <h3 className="minor-title mono">{t(ui.credentials.languages)}</h3>
            <ul className="bars bars--compact">
              {languages.map((l) => (
                <li key={l.name.en}>
                  <div className="bars__row">
                    <span>{t(l.name)}</span>
                    <span className="mono">{t(l.level)}</span>
                  </div>
                  <div className="bar">
                    <i style={{ '--w': `${l.value}%` } as React.CSSProperties} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const { t, lang } = useApp()
  const ref = useReveal<HTMLElement>()

  return (
    <section className="sec sec--contact" id="contact" ref={ref}>
      <SectionHead label={t(ui.contact.label)} title={t(ui.contact.title)} />

      <div className="contact" data-reveal>
        <p className="lead">{t(ui.contact.body)}</p>

        <ul className="contact__list">
          <li>
            <span className="mono">E-mail</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <span className="mono">Tel</span>
            <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
          </li>
          <li>
            <span className="mono">LinkedIn</span>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              {profile.linkedinLabel}
            </a>
          </li>
          <li>
            <span className="mono">{lang === 'fr' ? 'Localisation' : 'Location'}</span>
            <span>{profile.location}</span>
          </li>
        </ul>

        <div className="btn-row">
          <a className="btn btn--solid" href={`mailto:${profile.email}`}>
            {t(ui.contact.emailMe)} <span aria-hidden="true">↗</span>
          </a>
          <a className="btn" href={resumeFile[lang]} download>
            {t(ui.about.downloadCv)} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  )
}
