import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useApp } from '../AppContext'
import type { SceneKind } from './SceneImpl'

const SceneImpl = lazy(() => import('./SceneImpl'))

interface Props {
  kind: SceneKind
  spin?: number
  parallax?: boolean
  /** class applied to the inner canvas host (styling hook) */
  className?: string
}

/**
 * Defers loading three.js until the scene is near the viewport, then renders it.
 * The whole three.js bundle only downloads on demand, per scene.
 */
export function Scene({ kind, spin, parallax, className = 'mech-canvas' }: Props) {
  const { theme } = useApp()
  const hostRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={hostRef} className="scene-host">
      {active && (
        <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}>
          <SceneImpl kind={kind} theme={theme} spin={spin} parallax={parallax} className={className} />
        </Suspense>
      )}
    </div>
  )
}
