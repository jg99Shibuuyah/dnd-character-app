// Fixed, purely decorative backdrop mounted once at the app root. It hosts two
// theme-gated effect layers; CSS reveals only the one matching the active theme
// (see body[data-theme=...] .theme-backdrop rules in public/styles.css), so no
// theme subscription is needed here. aria-hidden — nothing here is content.
//
//  • Space: several thin "shooting star" streaks drifting along elliptical
//    offset-path orbits, each staggered so they don't move in lockstep.
//  • Rain: many individual droplets, each with its own randomized column,
//    length, speed and start offset. Per-drop randomness (rather than the old
//    tiled-gradient grid) is what keeps the shower from ever looking in sync —
//    tiled backgrounds are periodic and always beat; independent drops don't.
const STAR_COUNT = 7;
const RAIN_COUNT = 120;

// Small deterministic PRNG (mulberry32) seeded with a constant, so the drop
// field is randomized but stable across renders/reloads — no layout jitter and
// nothing to memoize per-render.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x5eed);
const RAIN_DROPS = Array.from({ length: RAIN_COUNT }, () => ({
  left: (rand() * 100).toFixed(2),        // column across the width, %
  height: (7 + rand() * 13).toFixed(1),   // streak length, px
  duration: (0.6 + rand() * 0.95).toFixed(2), // fall time — varied speed = parallax + no shared period
  delay: (-rand() * 2.2).toFixed(2),      // negative: mid-fall at load, staggered
  opacity: (0.28 + rand() * 0.5).toFixed(2),
  drift: (10 + rand() * 18).toFixed(1),   // slight sideways travel over the fall (wind), px
}));

export default function ThemeBackdrop() {
  return (
    <div className="theme-backdrop" aria-hidden="true">
      {Array.from({ length: STAR_COUNT }, (_, i) => (
        <span key={`s${i}`} className={`shooting-star ss-${i + 1}`} />
      ))}
      {RAIN_DROPS.map((d, i) => (
        <span
          key={`r${i}`}
          className="rain-drop"
          style={{
            left: `${d.left}%`,
            height: `${d.height}px`,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            '--drift': `${d.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
