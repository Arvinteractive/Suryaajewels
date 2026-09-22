// Checks the dollar rail's swing against what it is supposed to do:
//   * throw the piece BOTH ways, not just lean it one way while the rail moves
//   * be back at rest about a second later
//   * get there smoothly, rather than being cut off mid-arc
//
// Run with `npm run verify-pendulum`. This exists because the behaviour is
// impossible to measure in the browser it ships to — the angles are written
// straight to transforms and never pass through React — and because "does the
// swing feel right" is a question about a curve, which is a thing you can
// print.
import { createSwing, driveFrom, stepSwing, MAX_SWING } from '../src/lib/pendulum.js'

const FPS = 60
const DT = 1 / FPS
const COUNT = 23

// The same spring the rail itself snaps with (see `goTo` in DollarsRail).
const RAIL = { stiffness: 150, damping: 24, mass: 0.9 }

function run(slots, seconds = 3) {
  const state = createSwing(COUNT)
  let x = 0
  let v = 0
  let lastV = 0
  const trace = []

  for (let f = 0; f < seconds * FPS; f++) {
    const a = (-RAIL.stiffness * (x - slots) - RAIL.damping * v) / RAIL.mass
    v += a * DT
    x += v * DT

    const drive = driveFrom((v - lastV) / DT)
    lastV = v
    stepSwing(state, COUNT, drive, DT)
    trace.push({ t: f * DT, theta: state.theta[0] })
  }
  return trace
}

function describe(trace) {
  const turns = []
  for (let i = 1; i < trace.length - 1; i++) {
    const [a, b, c] = [trace[i - 1].theta, trace[i].theta, trace[i + 1].theta]
    if (((b > a && b >= c) || (b < a && b <= c)) && Math.abs(b) > 0.6) {
      turns.push({ deg: b, t: trace[i].t })
    }
  }
  let settle = 0
  for (let i = trace.length - 1; i >= 0; i--) {
    if (Math.abs(trace[i].theta) > 0.5) {
      settle = trace[i].t
      break
    }
  }
  const peak = Math.max(...trace.map((p) => Math.abs(p.theta)))
  const directions = new Set(turns.map((p) => Math.sign(p.deg)))
  return { turns, settle, peak, directions: directions.size }
}

let failed = 0
const check = (name, ok, detail) => {
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

for (const slots of [1, 3, 8]) {
  const r = describe(run(slots))
  const arc = r.turns
    .slice(0, 6)
    .map((p) => `${p.deg > 0 ? '+' : ''}${p.deg.toFixed(1)}°@${p.t.toFixed(2)}s`)
    .join('  ')

  console.log(`\n${slots}-slot move   peak ${r.peak.toFixed(1)}°   rest at ${r.settle.toFixed(2)}s`)
  console.log(`  ${arc}`)

  check(`${slots}-slot: swings both ways`, r.directions === 2, `${r.directions} direction(s)`)
  check(`${slots}-slot: at least two turns`, r.turns.length >= 2, `${r.turns.length} turns`)
  check(`${slots}-slot: rests within 1.3s`, r.settle <= 1.3, `${r.settle.toFixed(2)}s`)
  check(`${slots}-slot: keeps inside the clamp`, r.peak <= MAX_SWING, `${r.peak.toFixed(1)}°`)
  // A swing that is still wide when it stops was cut off, not damped out.
  const last = r.turns[r.turns.length - 1]
  check(`${slots}-slot: dies away smoothly`, !last || Math.abs(last.deg) < 2, `last ${last ? last.deg.toFixed(1) : 0}°`)
}

console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed')
process.exit(failed ? 1 : 0)
