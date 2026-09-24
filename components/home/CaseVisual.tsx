import clsx from 'clsx';

const TINTS = [
  ['#2997ff', '#7a5cff'],
  ['#34c759', '#2997ff'],
  ['#ff9f0a', '#ff375f'],
  ['#5e5ce6', '#bf5af2'],
  ['#ff375f', '#ff9f0a'],
  ['#30b0c7', '#34c759'],
];

/**
 * An abstract, perspective-tilted interface panel that carries the case outcome.
 * Each variant draws a different structure (queue, calendar, bars, receipt…).
 */
export default function CaseVisual({ index, outcome, dark }: { index: number; outcome: string; dark?: boolean }) {
  const [a, b] = TINTS[index % TINTS.length];
  const variant = index % 3;
  const panel = dark ? 'bg-white/[0.06] ring-white/10' : 'bg-white ring-black/[0.06]';
  const bar = dark ? 'bg-white/12' : 'bg-black/[0.06]';

  return (
    <div aria-hidden className="relative h-full min-h-[280px] w-full [perspective:1400px]">
      <div className="absolute inset-0 rounded-[1.5rem] opacity-60 blur-3xl" style={{ background: `radial-gradient(60% 60% at 60% 50%, ${a}40, transparent 70%)` }} />
      <div className="absolute inset-4 [transform-style:preserve-3d] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] [transform:rotateX(14deg)_rotateY(-16deg)_rotateZ(2deg)] group-hover:[transform:rotateX(6deg)_rotateY(-6deg)_rotateZ(0deg)]">
        <div className={clsx('absolute inset-0 overflow-hidden rounded-[1.25rem] p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.35)] ring-1', panel)}>
          <div className="mb-5 flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className={clsx('size-2 rounded-full', bar)} />
            ))}
            <span className={clsx('ml-3 h-2 w-24 rounded-full', bar)} />
          </div>

          {variant === 0 && (
            <div className="space-y-2.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="size-6 shrink-0 rounded-lg" style={{ background: i === 1 ? `linear-gradient(135deg, ${a}, ${b})` : undefined }} />
                  <span className={clsx('h-2.5 rounded-full', bar)} style={{ width: `${40 + ((i * 23) % 45)}%` }} />
                  <span className={clsx('ml-auto h-2.5 w-10 rounded-full', bar)} />
                </div>
              ))}
            </div>
          )}
          {variant === 1 && (
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className={clsx('aspect-square rounded-md', bar)}
                  style={[3, 9, 10, 16, 22, 24].includes(i) ? { background: `linear-gradient(135deg, ${a}, ${b})`, opacity: 0.35 + ((i * 7) % 6) / 10 } : undefined}
                />
              ))}
            </div>
          )}
          {variant === 2 && (
            <div className="flex h-[55%] items-end gap-2">
              {[38, 52, 44, 66, 58, 80, 72, 94].map((h, i) => (
                <span key={i} className={clsx('flex-1 rounded-t-md', i < 7 && bar)} style={{ height: `${h}%`, background: i === 7 ? `linear-gradient(to top, ${a}, ${b})` : undefined }} />
              ))}
            </div>
          )}
        </div>

        {/* Floating outcome chip, lifted off the panel in 3D. */}
        <div
          className={clsx(
            'absolute -bottom-3 left-6 max-w-[80%] rounded-2xl px-4 py-3 text-[0.85rem] font-medium leading-snug shadow-[0_20px_50px_-20px_rgba(0,0,0,0.45)] backdrop-blur-xl [transform:translateZ(60px)]',
            dark ? 'bg-white/90 text-ink' : 'bg-ink/90 text-white',
          )}
        >
          <span className="mr-2 inline-block size-1.5 -translate-y-px rounded-full align-middle" style={{ background: a, boxShadow: `0 0 12px ${a}` }} />
          {outcome}
        </div>
      </div>
    </div>
  );
}
