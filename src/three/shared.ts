import * as THREE from 'three'
import type { Theme } from '../AppContext'

export interface MechPalette {
  steel: number
  steelDark: number
  accent: number
  glass: number
  key: number
  rim: number
  hemi: number
  envIntensity: number
  exposure: number
}

export const MECH_PALETTES: Record<Theme, MechPalette> = {
  light: {
    steel: 0xd4d4d4,
    steelDark: 0x8a8a8a,
    accent: 0x1f6b48,
    glass: 0xbfd8cb,
    key: 0xffffff,
    rim: 0x9fd6b4,
    hemi: 0x808080,
    envIntensity: 0.95,
    exposure: 1.0,
  },
  dark: {
    steel: 0x7a7a7a,
    steelDark: 0x3c3c3c,
    accent: 0x7ddc9f,
    glass: 0x2f4a3e,
    key: 0xf2f2f2,
    rim: 0x5ad39a,
    hemi: 0x2a2a2a,
    envIntensity: 0.6,
    exposure: 1.15,
  },
}

/** Procedural studio environment map so metals have something to reflect. */
export function makeStudioEnv(renderer: THREE.WebGLRenderer, theme: Theme): THREE.Texture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  if (theme === 'dark') {
    g.addColorStop(0, '#2d2d2d')
    g.addColorStop(0.45, '#131313')
    g.addColorStop(0.5, '#404040')
    g.addColorStop(1, '#070707')
  } else {
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.45, '#d8d8d8')
    g.addColorStop(0.5, '#ffffff')
    g.addColorStop(1, '#b0b0b0')
  }
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  // bright softbox strips give crisp specular highlights on metal
  ctx.fillStyle = theme === 'dark' ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.9)'
  ctx.fillRect(0, 36, 256, 26)
  ctx.fillRect(0, 150, 256, 12)

  const tex = new THREE.CanvasTexture(c)
  tex.mapping = THREE.EquirectangularReflectionMapping
  const pmrem = new THREE.PMREMGenerator(renderer)
  const env = pmrem.fromEquirectangular(tex).texture
  pmrem.dispose()
  tex.dispose()
  return env
}

export interface MechMaterials {
  steel: THREE.MeshStandardMaterial
  steelDark: THREE.MeshStandardMaterial
  accent: THREE.MeshStandardMaterial
  glass: THREE.MeshStandardMaterial
  line: THREE.LineBasicMaterial
  all: THREE.Material[]
}

export function createMechMaterials(): MechMaterials {
  const steel = new THREE.MeshStandardMaterial({ metalness: 0.95, roughness: 0.26 })
  const steelDark = new THREE.MeshStandardMaterial({ metalness: 0.9, roughness: 0.5 })
  const accent = new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.32 })
  const glass = new THREE.MeshStandardMaterial({
    metalness: 0,
    roughness: 0.1,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
  })
  const line = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.4 })
  return { steel, steelDark, accent, glass, line, all: [steel, steelDark, accent, glass, line] }
}

export function applyMechPalette(m: MechMaterials, theme: Theme) {
  const p = MECH_PALETTES[theme]
  m.steel.color.setHex(p.steel)
  m.steelDark.color.setHex(p.steelDark)
  m.accent.color.setHex(p.accent)
  m.accent.emissive.setHex(p.accent)
  m.accent.emissiveIntensity = theme === 'dark' ? 0.25 : 0.06
  m.glass.color.setHex(p.glass)
  m.glass.opacity = theme === 'dark' ? 0.14 : 0.12
  m.line.color.setHex(theme === 'dark' ? 0x7ddc9f : 0x7b7b7b)
  m.line.opacity = theme === 'dark' ? 0.4 : 0.32
}
