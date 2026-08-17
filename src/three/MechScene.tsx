import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { Theme } from '../AppContext'
import { applyMechPalette, createMechMaterials, makeStudioEnv, MECH_PALETTES } from './shared'
import type { MechBuilder } from './mechModels'

interface Props {
  theme: Theme
  build: MechBuilder
  /** extra idle spin of the whole model, radians/sec */
  spin?: number
  className?: string
  /** enable pointer parallax (default true) */
  parallax?: boolean
}

export function MechScene({ theme, build, spin = 0.25, className = 'mech-canvas', parallax = true }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef(theme)
  const applyRef = useRef<(t: Theme) => void>(() => {})
  themeRef.current = theme

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    host.appendChild(renderer.domElement)

    const hemi = new THREE.HemisphereLight(0xffffff, 0x404040, 0.6)
    const key = new THREE.DirectionalLight(0xffffff, 2.0)
    key.position.set(4, 6, 7)
    const fill = new THREE.DirectionalLight(0xffffff, 0.6)
    fill.position.set(-6, -1, 4)
    const rim = new THREE.PointLight(0xffffff, 40, 50)
    rim.position.set(-4, 3, -6)
    scene.add(hemi, key, fill, rim)

    const mats = createMechMaterials()
    const model = build(mats)

    const pivot = new THREE.Group()
    pivot.add(model.object)
    scene.add(pivot)

    // frame the model
    camera.position.set(0, model.offsetY ?? 0, model.fit)
    camera.lookAt(0, model.offsetY ?? 0, 0)

    let env: THREE.Texture | null = null
    const applyTheme = (t: Theme) => {
      const p = MECH_PALETTES[t]
      applyMechPalette(mats, t)
      key.color.setHex(p.key)
      key.intensity = t === 'dark' ? 1.5 : 2.1
      rim.color.setHex(p.rim)
      rim.intensity = t === 'dark' ? 55 : 24
      hemi.color.setHex(0xffffff)
      hemi.groundColor.setHex(p.hemi)
      hemi.intensity = t === 'dark' ? 0.35 : 0.7
      env?.dispose()
      env = makeStudioEnv(renderer, t)
      scene.environment = env
      scene.environmentIntensity = p.envIntensity
      renderer.toneMappingExposure = p.exposure
    }
    applyRef.current = applyTheme
    applyTheme(themeRef.current)

    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    const onMove = (e: PointerEvent) => {
      if (!parallax) return
      const r = host.getBoundingClientRect()
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    let raf = 0
    let running = true
    const clock = new THREE.Clock()

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!running) return
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      if (!reduceMotion) model.update(dt, t)

      cur.x += (target.x - cur.x) * 0.06
      cur.y += (target.y - cur.y) * 0.06
      pivot.rotation.y = cur.x * 0.5 + (reduceMotion ? 0 : t * spin)
      pivot.rotation.x = cur.y * 0.3

      renderer.render(scene, camera)
    }
    tick()

    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting
    })
    io.observe(host)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line) o.geometry.dispose()
      })
      mats.all.forEach((mm) => mm.dispose())
      env?.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [build, spin, parallax])

  useEffect(() => {
    applyRef.current(theme)
  }, [theme])

  return <div className={className} ref={hostRef} aria-hidden="true" />
}
