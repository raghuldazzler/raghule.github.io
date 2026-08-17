import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createGearGeometry, pitchRadius } from './gear'
import type { Theme } from '../AppContext'

interface Palette {
  bg: number
  steel: number
  steelDark: number
  accent: number
  key: number
  fill: number
  rim: number
  envIntensity: number
}

const PALETTES: Record<Theme, Palette> = {
  light: {
    bg: 0xf8f8f8,
    steel: 0xd9d9d9,
    steelDark: 0x8d8d8d,
    accent: 0x2f6f4e,
    key: 0xffffff,
    fill: 0xe6e6e6,
    rim: 0x9fd6b4,
    envIntensity: 0.9,
  },
  dark: {
    bg: 0x161616,
    steel: 0xa6a6a6,
    steelDark: 0x777777,
    accent: 0x7ddc9f,
    key: 0xf2f2f2,
    fill: 0x3a3a3a,
    rim: 0x5ad39a,
    envIntensity: 1.1,
  },
}

/** Procedural studio environment so metals have something to reflect. */
function makeEnvTexture(renderer: THREE.WebGLRenderer, theme: Theme) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  if (theme === 'dark') {
    g.addColorStop(0, '#2b2b2b')
    g.addColorStop(0.45, '#121212')
    g.addColorStop(0.5, '#3d3d3d')
    g.addColorStop(1, '#080808')
  } else {
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.45, '#dcdcdc')
    g.addColorStop(0.5, '#ffffff')
    g.addColorStop(1, '#b4b4b4')
  }
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  ctx.fillStyle = theme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.85)'
  ctx.fillRect(0, 40, 256, 26)
  ctx.fillRect(0, 150, 256, 12)

  const tex = new THREE.CanvasTexture(c)
  tex.mapping = THREE.EquirectangularReflectionMapping
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromEquirectangular(tex).texture
  pmrem.dispose()
  tex.dispose()
  return env
}

export function GearScene({ theme }: { theme: Theme }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef(theme)
  const applyThemeRef = useRef<(t: Theme) => void>(() => {})

  themeRef.current = theme

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0.6, 15)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    host.appendChild(renderer.domElement)

    // ---------------------------------------------------------------- lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x404040, 0.7)
    const key = new THREE.DirectionalLight(0xffffff, 2.1)
    key.position.set(5, 7, 8)
    const fill = new THREE.DirectionalLight(0xffffff, 0.7)
    fill.position.set(-7, -2, 4)
    const rim = new THREE.PointLight(0xffffff, 45, 40)
    rim.position.set(-4, 3, -6)
    scene.add(hemi, key, fill, rim)

    // ------------------------------------------------------------- materials
    const steel = new THREE.MeshStandardMaterial({ metalness: 0.92, roughness: 0.22 })
    const steelDark = new THREE.MeshStandardMaterial({ metalness: 0.85, roughness: 0.42 })
    const accentMat = new THREE.MeshStandardMaterial({ metalness: 0.55, roughness: 0.32 })
    const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 })

    // ----------------------------------------------------------- gear train
    const M = 0.34
    const specs = [
      { teeth: 26, mat: steel, spokes: 6, thick: 0.85, x: 0, y: 0, z: 0 },
      { teeth: 16, mat: accentMat, spokes: 4, thick: 0.7, x: 0, y: 0, z: 0 },
      { teeth: 12, mat: steelDark, spokes: 3, thick: 0.55, x: 0, y: 0, z: 0 },
    ]

    const r0 = pitchRadius(specs[0].teeth, M)
    const r1 = pitchRadius(specs[1].teeth, M)
    const r2 = pitchRadius(specs[2].teeth, M)

    // place gear 2 up-right of gear 1, gear 3 below gear 2
    const a01 = Math.PI * 0.28
    specs[1].x = Math.cos(a01) * (r0 + r1)
    specs[1].y = Math.sin(a01) * (r0 + r1)
    const a12 = -Math.PI * 0.06
    specs[2].x = specs[1].x + Math.cos(a12) * (r1 + r2)
    specs[2].y = specs[1].y + Math.sin(a12) * (r1 + r2)

    const assembly = new THREE.Group()
    scene.add(assembly)

    const gears = specs.map((s, i) => {
      const g = new THREE.Group()
      const geo = createGearGeometry({
        teeth: s.teeth,
        module: M,
        thickness: s.thick,
        boreRadius: pitchRadius(s.teeth, M) * 0.26,
        spokes: s.spokes,
      })
      const mesh = new THREE.Mesh(geo, s.mat)
      g.add(mesh)

      // hub
      const pr = pitchRadius(s.teeth, M)
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(pr * 0.34, pr * 0.34, s.thick * 1.55, 40, 1, true),
        i === 1 ? accentMat : steelDark,
      )
      hub.rotation.x = Math.PI / 2
      g.add(hub)

      // shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(pr * 0.2, pr * 0.2, 3.2, 28), steelDark)
      shaft.rotation.x = Math.PI / 2
      g.add(shaft)

      g.position.set(s.x, s.y, s.z)
      assembly.add(g)
      return { group: g, teeth: s.teeth, mesh }
    })

    // reference circles (technical-drawing feel)
    const circle = (radius: number, x: number, y: number) => {
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2
        pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0))
      }
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat)
      line.position.set(x, y, 0)
      return line
    }
    assembly.add(circle(r0, 0, 0), circle(r1, specs[1].x, specs[1].y), circle(r2, specs[2].x, specs[2].y))

    // slow-drifting outer housing ring
    const housing = new THREE.Mesh(new THREE.TorusGeometry(r0 * 1.28, 0.06, 12, 160), steelDark)
    assembly.add(housing)

    // centre the whole assembly on its bounding box
    const box = new THREE.Box3().setFromObject(assembly)
    const centre = box.getCenter(new THREE.Vector3())
    assembly.position.sub(centre)

    const pivot = new THREE.Group()
    pivot.add(assembly)
    scene.add(pivot)

    // -------------------------------------------------------------- theming
    let env: THREE.Texture | null = null
    const applyTheme = (t: Theme) => {
      const p = PALETTES[t]
      steel.color.setHex(p.steel)
      steelDark.color.setHex(p.steelDark)
      accentMat.color.setHex(p.accent)
      accentMat.emissive.setHex(p.accent)
      accentMat.emissiveIntensity = t === 'dark' ? 0.22 : 0.05
      lineMat.color.setHex(t === 'dark' ? 0x7ddc9f : 0x7b7b7b)
      lineMat.opacity = t === 'dark' ? 0.45 : 0.35
      key.color.setHex(p.key)
      key.intensity = t === 'dark' ? 1.6 : 2.2
      fill.color.setHex(p.fill)
      rim.color.setHex(p.rim)
      rim.intensity = t === 'dark' ? 60 : 25
      hemi.intensity = t === 'dark' ? 0.35 : 0.8

      env?.dispose()
      env = makeEnvTexture(renderer, t)
      scene.environment = env
      scene.environmentIntensity = p.envIntensity
      renderer.toneMappingExposure = t === 'dark' ? 1.15 : 1.0
    }
    applyThemeRef.current = applyTheme
    applyTheme(themeRef.current)

    // ------------------------------------------------------------ interaction
    const pointer = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const onPointerMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let scrollN = 0
    const onScroll = () => {
      scrollN = window.scrollY / Math.max(window.innerHeight, 1)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ----------------------------------------------------------------- resize
    const bounds = new THREE.Box3().setFromObject(assembly)
    const sphere = bounds.getBoundingSphere(new THREE.Sphere())

    const resize = () => {
      const w = host.clientWidth
      const h = host.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.fov = 38
      camera.updateProjectionMatrix()

      // frame the whole assembly whatever the container ratio is
      const vFov = (camera.fov * Math.PI) / 180
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect)
      const dist = sphere.radius / Math.sin(Math.min(vFov, hFov) / 2)
      camera.position.set(0, 0, dist * 1.02)
      camera.lookAt(0, 0, 0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    resize()

    // ------------------------------------------------------------------ loop
    let raf = 0
    let running = true
    const clock = new THREE.Clock()
    const baseSpeed = 0.5

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!running) return
      const dt = Math.min(clock.getDelta(), 0.05)
      const speed = reduceMotion ? 0 : baseSpeed

      // meshed rotation: w1*z1 = w2*z2, alternating direction
      let dir = 1
      for (const g of gears) {
        g.group.rotation.z += dir * speed * dt * (gears[0].teeth / g.teeth)
        dir *= -1
      }

      housing.rotation.z -= speed * dt * 0.12

      pointer.x += (target.x - pointer.x) * 0.05
      pointer.y += (target.y - pointer.y) * 0.05

      pivot.rotation.y = -0.34 + pointer.x * 0.4 + Math.sin(clock.elapsedTime * 0.25) * 0.06
      pivot.rotation.x = 0.16 - pointer.y * 0.28 + scrollN * 0.35
      pivot.position.y = -scrollN * 1.2
      pivot.scale.setScalar(1 - Math.min(scrollN, 1) * 0.12)

      renderer.render(scene, camera)
    }
    tick()

    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
    })
    io.observe(host)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Line) o.geometry.dispose()
      })
      steel.dispose()
      steelDark.dispose()
      accentMat.dispose()
      lineMat.dispose()
      env?.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    applyThemeRef.current(theme)
  }, [theme])

  return <div className="gear-canvas" ref={hostRef} aria-hidden="true" />
}
