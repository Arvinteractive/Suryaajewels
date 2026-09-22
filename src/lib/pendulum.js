// The swing physics behind the dollar rail, kept out of the component so it
// can be run head-first in a plain Node script (`scripts/verify-pendulum.mjs`)
// and checked against the profile it is supposed to produce. The browser it
// ships to is the one place this is hard to measure — the angles never reach
// React state, and stepping through them by hand tells you nothing about
// whether a swing *feels* like a swing.
//
// A pendant hanging from a rail is not tilted by how fast the rail is moving;
// it is thrown by how hard the rail changes speed. Steady travel leaves a real
// pendant hanging straight down, and only the shove at the start and the stop
// at the end move it — in opposite directions. So the drive is acceleration,
// not velocity. Driving the angle from velocity, which is what this did first,
// can only ever lean a piece one way and hold it there while the rail travels.

export const OMEGA = 15 // natural frequency, rad/s — sets the period
export const ZETA = 0.23 // damping ratio — sets how fast it dies away
export const SWING_DRIVE = 60 // degrees of angular kick per slot/s² of rail
export const MAX_DRIVE = 3500
export const MAX_SWING = 16 // degrees; a hard flick should not fold a piece over
export const REST_ANGLE = 0.05 // in degrees and degrees/s: below this it has stopped

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi)

// Deterministic per-pendant jitter. Two pieces on one rail never swing in
// step — they differ in mass and in how long a drop they hang on — and a rail
// where all twenty-three moved as one body would read as a spreadsheet row
// with a rotation applied to it.
export function jitter(i, seed) {
  const v = Math.sin((i + 1) * seed) * 43758.5453
  return v - Math.floor(v)
}

export function createSwing(count) {
  return {
    theta: new Float64Array(count),
    omega: new Float64Array(count),
    lastVelocity: 0,
    resting: true,
  }
}

// Rail acceleration in slots/s² -> the angular push on every bob. Negated
// because the pivot accelerating one way throws the weight the other: this is
// the whole reason a piece swings *back* when the rail stops rather than only
// forward when it starts.
export const driveFrom = (accel) => clamp(-accel * SWING_DRIVE, -MAX_DRIVE, MAX_DRIVE)

// One semi-implicit Euler step of a damped harmonic oscillator per pendant.
// Returns true while anything is still moving, so the caller can park the
// whole loop once the rail has gone quiet.
export function stepSwing(state, count, drive, dt) {
  let moving = Math.abs(drive) >= 1

  for (let i = 0; i < count; i++) {
    const w = OMEGA * (0.9 + jitter(i, 12.9898) * 0.2)
    const z = ZETA * (0.85 + jitter(i, 78.233) * 0.3)
    const weight = 0.85 + jitter(i, 93.989) * 0.3

    const angular = drive * weight - w * w * state.theta[i] - 2 * z * w * state.omega[i]
    state.omega[i] += angular * dt
    state.theta[i] = clamp(state.theta[i] + state.omega[i] * dt, -MAX_SWING, MAX_SWING)

    if (Math.abs(state.theta[i]) < REST_ANGLE && Math.abs(state.omega[i]) < REST_ANGLE) {
      // Parked exactly at zero rather than left a hundredth of a degree off,
      // which would keep the frame loop alive for as long as the panel is open
      // and leave every piece fractionally crooked.
      state.theta[i] = 0
      state.omega[i] = 0
    } else {
      moving = true
    }
  }

  state.resting = !moving
  return moving
}
