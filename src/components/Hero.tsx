import { useApp } from '../AppContext'
import { profile, ui } from '../content'
import { useCountUp } from '../hooks'
import { Scene } from '../three/Scene'

function Stat({ value, label }: { value: number; label: string }) {
  const { ref, value: n } = useCountUp(value)
  return (
    <div className="stat">
      <span className="stat__value" ref={ref}>
        +{n}
      </span>
      <span className="stat__label">{label}</span>
    </div>
  )
}

export function Hero() {
  const { t } = useApp()

  return (
    <section className="hero" id="top">
      <div className="hero__rail hero__rail--left" aria-hidden="true">
        <span>{t(ui.hero.role)}</span>
      </div>
      <div className="hero__rail hero__rail--right" aria-hidden="true">
        <span>2026</span>
      </div>

      <div className="hero__grid">
        <div className="hero__content">
          <div className="hero__stats">
            <Stat value={4} label={t(ui.hero.statA)} />
            <Stat value={6} label={t(ui.hero.statB)} />
            <Stat value={3} label={t(ui.hero.statC)} />
          </div>

          <h1 className="hero__title">{t(ui.hero.greeting)}</h1>
          <p className="hero__tagline">{t(ui.hero.tagline)}</p>

          <div className="hero__meta">
            <span className="mono">{profile.location}</span>
            <span className="mono">{profile.phone}</span>
          </div>
        </div>

        <div className="hero__visual">
          <Scene kind="gear" className="gear-canvas" />
          <div className="hero__visual-tag mono" aria-hidden="true">
            <span>ASSY-01 / GEAR TRAIN</span>
            <span>z 26 · 16 · 12 — m 0.34</span>
          </div>
        </div>
      </div>

      <a className="hero__scroll mono" href="#about">
        {t(ui.hero.scroll)} <span aria-hidden="true">↓</span>
      </a>
    </section>
  )
}
