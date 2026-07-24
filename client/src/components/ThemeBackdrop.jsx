// Fixed, purely decorative backdrop mounted once at the app root. Only the
// Space theme reveals it (CSS: body[data-theme="space"] .theme-backdrop). It
// renders several thin "shooting star" streaks that drift along elliptical
// offset-path orbits, each staggered by delay/speed/radius so they don't move
// in lockstep — an orbital feel rather than a single left-to-right streak.
// aria-hidden; no theme subscription is needed because CSS gates visibility.
const STAR_COUNT = 7;

export default function ThemeBackdrop() {
  return (
    <div className="theme-backdrop" aria-hidden="true">
      {Array.from({ length: STAR_COUNT }, (_, i) => (
        <span key={i} className={`shooting-star ss-${i + 1}`} />
      ))}
    </div>
  );
}
