import { GearScene } from './GearScene'
import { MechScene } from './MechScene'
import { createBearing, createEngine, createRoboticArm } from './mechModels'
import type { MechBuilder } from './mechModels'
import type { Theme } from '../AppContext'

export type SceneKind = 'gear' | 'engine' | 'bearing' | 'arm'

const BUILDERS: Record<Exclude<SceneKind, 'gear'>, MechBuilder> = {
  engine: createEngine,
  bearing: createBearing,
  arm: createRoboticArm,
}

interface Props {
  kind: SceneKind
  theme: Theme
  spin?: number
  parallax?: boolean
  className?: string
}

/** Heavy entry point — this module (and all of three.js) is code-split via React.lazy. */
export default function SceneImpl({ kind, theme, spin, parallax, className }: Props) {
  if (kind === 'gear') return <GearScene theme={theme} />
  return (
    <MechScene
      theme={theme}
      build={BUILDERS[kind]}
      spin={spin}
      parallax={parallax}
      className={className}
    />
  )
}
