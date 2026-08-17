import * as THREE from 'three'

export interface GearOptions {
  teeth: number
  module: number
  thickness: number
  boreRadius: number
  /** number of lightening holes in the web */
  spokes?: number
}

function gearProfile(teeth: number, m: number): THREE.Vector2[] {
  const pitch = (m * teeth) / 2
  const rTip = pitch + m
  const rRoot = pitch - 1.25 * m
  const rPitch = pitch
  const step = (Math.PI * 2) / teeth
  const pts: THREE.Vector2[] = []

  const push = (r: number, a: number) => pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r))

  for (let i = 0; i < teeth; i++) {
    const a = i * step
    // root land
    push(rRoot, a)
    push(rRoot, a + step * 0.16)
    // rising flank (two segments to fake an involute curve)
    push(rPitch, a + step * 0.26)
    push(rTip, a + step * 0.36)
    // tip land
    push(rTip, a + step * 0.5)
    // falling flank
    push(rPitch, a + step * 0.6)
    push(rRoot, a + step * 0.7)
    push(rRoot, a + step * 0.84)
  }
  return pts
}

export function createGearGeometry(opts: GearOptions): THREE.ExtrudeGeometry {
  const { teeth, module: m, thickness, boreRadius, spokes = 0 } = opts
  const shape = new THREE.Shape(gearProfile(teeth, m))

  const bore = new THREE.Path()
  bore.absarc(0, 0, boreRadius, 0, Math.PI * 2, true)
  shape.holes.push(bore)

  if (spokes > 0) {
    const pitch = (m * teeth) / 2
    const holeOrbit = (boreRadius + (pitch - 1.25 * m)) / 2
    const holeR = Math.min(holeOrbit - boreRadius, pitch - 1.25 * m - holeOrbit) * 0.72
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * Math.PI * 2
      const p = new THREE.Path()
      p.absarc(Math.cos(a) * holeOrbit, Math.sin(a) * holeOrbit, holeR, 0, Math.PI * 2, true)
      shape.holes.push(p)
    }
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: thickness * 0.06,
    bevelSize: m * 0.07,
    bevelSegments: 2,
    curveSegments: 24,
  })

  geo.translate(0, 0, -thickness / 2)
  geo.computeVertexNormals()
  return geo
}

export function pitchRadius(teeth: number, m: number) {
  return (m * teeth) / 2
}
