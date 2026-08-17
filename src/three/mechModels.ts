import * as THREE from 'three'
import type { MechMaterials } from './shared'

export interface MechModel {
  object: THREE.Object3D
  update: (dt: number, elapsed: number) => void
  /** camera distance used to frame the model */
  fit: number
  /** vertical look/offset tweak */
  offsetY?: number
}

export type MechBuilder = (m: MechMaterials) => MechModel

const Y_AXIS = new THREE.Vector3(0, 1, 0)

/* =====================================================================
 * Inline-3 crank–slider engine (real reciprocating kinematics)
 * ===================================================================*/
export function createEngine(m: MechMaterials): MechModel {
  const group = new THREE.Group()

  const R = 0.72 // crank throw
  const L = 2.15 // connecting-rod length
  const N = 3
  const spacing = 1.75
  const xs = Array.from({ length: N }, (_, i) => (i - (N - 1) / 2) * spacing)

  // -------------------------------------------------- crankshaft (spins X)
  const crank = new THREE.Group()
  group.add(crank)

  const mainShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, spacing * N + 1.4, 28),
    m.steelDark,
  )
  mainShaft.rotation.z = Math.PI / 2
  crank.add(mainShaft)

  const pinPositions: number[] = [] // local crank-pin y offset is constant (=R)
  xs.forEach((x, i) => {
    const phase = (i * Math.PI * 2) / N
    const throwGrp = new THREE.Group()
    throwGrp.rotation.x = phase // stagger the throws around the shaft
    crank.add(throwGrp)

    // two crank webs
    for (const off of [-0.42, 0.42]) {
      const web = new THREE.Mesh(new THREE.BoxGeometry(0.22, R * 2 + 0.7, 0.62), m.steel)
      web.position.set(x + off, R / 2, 0)
      throwGrp.add(web)
    }
    // crank pin
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.0, 20), m.accent)
    pin.rotation.z = Math.PI / 2
    pin.position.set(x, R, 0)
    throwGrp.add(pin)
    pinPositions.push(phase)
  })

  // flywheel on one end
  const flywheel = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.25, 0.34, 48), m.steel)
  flywheel.rotation.z = Math.PI / 2
  flywheel.position.x = xs[0] - spacing * 0.85
  crank.add(flywheel)
  const flyRim = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.09, 12, 60), m.accent)
  flyRim.position.x = flywheel.position.x
  flyRim.rotation.y = Math.PI / 2
  crank.add(flyRim)

  // -------------------------------------------------- pistons, rods, liners
  const pistons: THREE.Mesh[] = []
  const rods: THREE.Mesh[] = []

  xs.forEach((x) => {
    const liner = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2.6, 32, 1, true), m.glass)
    liner.position.set(x, R + L * 0.55, 0)
    group.add(liner)

    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.62, 28), m.steel)
    piston.position.set(x, R + L, 0)
    group.add(piston)
    pistons.push(piston)

    // pin boss ring on top of piston
    const cap = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 10, 28), m.steelDark)
    cap.rotation.x = Math.PI / 2
    piston.add(cap)

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, L, 16), m.steelDark)
    group.add(rod)
    rods.push(rod)
  })

  // small mounting rail
  const rail = new THREE.Mesh(new THREE.BoxGeometry(spacing * N + 1.8, 0.28, 1.5), m.steelDark)
  rail.position.y = -R - 0.55
  group.add(rail)

  const crankPin = new THREE.Vector3()
  const pistonPin = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const mid = new THREE.Vector3()
  const quat = new THREE.Quaternion()

  const update = (_dt: number, elapsed: number) => {
    const theta = elapsed * 2.4
    crank.rotation.x = theta

    xs.forEach((x, i) => {
      const a = theta + pinPositions[i]
      const cy = R * Math.cos(a)
      const cz = R * Math.sin(a)
      const yp = cy + Math.sqrt(Math.max(L * L - cz * cz, 0.0001))

      pistons[i].position.y = yp

      crankPin.set(x, cy, cz)
      pistonPin.set(x, yp, 0)
      mid.addVectors(crankPin, pistonPin).multiplyScalar(0.5)
      dir.subVectors(pistonPin, crankPin).normalize()
      quat.setFromUnitVectors(Y_AXIS, dir)
      rods[i].position.copy(mid)
      rods[i].quaternion.copy(quat)
    })
  }

  return { object: group, update, fit: 9.2, offsetY: -0.4 }
}

/* =====================================================================
 * Deep-groove ball bearing (outer race static, inner race + cage spin)
 * ===================================================================*/
function racePoints(outer: number, inner: number, halfW: number): THREE.Vector2[] {
  return [
    new THREE.Vector2(outer, -halfW),
    new THREE.Vector2(outer, halfW),
    new THREE.Vector2(inner, halfW),
    new THREE.Vector2(inner, -halfW),
    new THREE.Vector2(outer, -halfW),
  ]
}

export function createBearing(m: MechMaterials): MechModel {
  const group = new THREE.Group()
  group.rotation.x = Math.PI * 0.32 // tilt so the annulus reads

  const HALF_W = 0.5
  const outerRace = new THREE.Mesh(
    new THREE.LatheGeometry(racePoints(2.0, 1.62, HALF_W), 96),
    m.steel,
  )
  outerRace.material.side = THREE.DoubleSide
  group.add(outerRace)

  const innerHub = new THREE.Group()
  group.add(innerHub)
  const innerRace = new THREE.Mesh(
    new THREE.LatheGeometry(racePoints(1.18, 0.8, HALF_W), 96),
    m.steel,
  )
  innerRace.material.side = THREE.DoubleSide
  innerHub.add(innerRace)
  // keyway notch marker so inner-race spin is visible
  const key = new THREE.Mesh(new THREE.BoxGeometry(0.14, HALF_W * 2 + 0.02, 0.16), m.accent)
  key.position.set(0.8, 0, 0)
  innerHub.add(key)

  const RC = 1.4 // ball pitch radius
  const RB = 0.2
  const BALLS = 11
  const cage = new THREE.Group()
  group.add(cage)
  const ballMeshes: THREE.Mesh[] = []
  const ballGeo = new THREE.SphereGeometry(RB, 24, 18)
  for (let i = 0; i < BALLS; i++) {
    const a = (i / BALLS) * Math.PI * 2
    const ball = new THREE.Mesh(ballGeo, m.steel)
    ball.position.set(Math.cos(a) * RC, 0, Math.sin(a) * RC)
    cage.add(ball)
    ballMeshes.push(ball)
  }
  // cage ring
  const cageRing = new THREE.Mesh(new THREE.TorusGeometry(RC, 0.055, 12, 96), m.accent)
  cageRing.rotation.x = Math.PI / 2
  cage.add(cageRing)

  const update = (dt: number) => {
    const wi = 1.1
    innerHub.rotation.y += wi * dt
    cage.rotation.y += wi * 0.41 * dt // epicyclic cage speed
    for (const b of ballMeshes) b.rotation.z -= wi * 2.6 * dt
  }

  return { object: group, update, fit: 6.2 }
}

/* =====================================================================
 * 4-DOF articulated robotic arm (matches the robotics projects)
 * ===================================================================*/
export function createRoboticArm(m: MechMaterials): MechModel {
  const root = new THREE.Group()

  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.35, 0.4, 40), m.steelDark)
  base.position.y = -2.2
  root.add(base)

  const column = new THREE.Group()
  column.position.y = -2.0
  root.add(column)
  const columnMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.75, 0.9, 32), m.steel)
  columnMesh.position.y = 0.45
  column.add(columnMesh)

  const joint = (r: number) => {
    const g = new THREE.Group()
    const j = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.7, 28), m.accent)
    j.rotation.x = Math.PI / 2
    g.add(j)
    return g
  }

  const link = (len: number, w: number, mat: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, len, w), mat)
    mesh.position.y = len / 2
    return mesh
  }

  const shoulder = joint(0.5)
  shoulder.position.y = 0.9
  column.add(shoulder)
  shoulder.add(link(2.4, 0.5, m.steel))

  const elbow = joint(0.42)
  elbow.position.y = 2.4
  shoulder.add(elbow)
  elbow.add(link(2.0, 0.42, m.steel))

  const wrist = joint(0.32)
  wrist.position.y = 2.0
  elbow.add(wrist)

  // gripper
  const gripBase = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), m.steelDark)
  gripBase.position.y = 0.35
  wrist.add(gripBase)
  const prongs: THREE.Mesh[] = []
  for (const s of [-1, 1]) {
    const prong = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.3), m.accent)
    prong.position.set(s * 0.22, 0.65, 0)
    wrist.add(prong)
    prongs.push(prong)
  }

  const update = (_dt: number, t: number) => {
    column.rotation.y = Math.sin(t * 0.4) * 0.9
    shoulder.rotation.z = -0.5 + Math.sin(t * 0.6) * 0.45
    elbow.rotation.z = 0.9 + Math.sin(t * 0.6 + 1.1) * 0.5
    wrist.rotation.z = Math.sin(t * 0.8) * 0.4
    const grip = 0.12 + Math.abs(Math.sin(t * 1.2)) * 0.16
    prongs[0].position.x = -grip
    prongs[1].position.x = grip
  }

  return { object: root, update, fit: 9.5, offsetY: 0.4 }
}
