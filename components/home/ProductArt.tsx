/** Generative, product-specific CSS objects used in place of photography. */
export default function ProductArt({ index }: { index: number }) {
  if (index === 0) {
    // POS Daily: a receipt that keeps printing.
    return (
      <div aria-hidden className="absolute inset-0 grid place-items-center [perspective:900px]">
        <div className="relative h-[62%] w-[46%] min-w-[150px] max-w-[220px] overflow-hidden rounded-t-xl bg-white/[0.92] shadow-[0_40px_80px_-20px_rgba(41,151,255,0.35)] [transform:rotateX(18deg)_rotateZ(-6deg)] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
          <div className="[animation:ticker_9s_linear_infinite]">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="space-y-3 p-5">
                {Array.from({ length: 9 }).map((__, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <span className="h-1.5 rounded-full bg-black/15" style={{ width: `${35 + ((i * 29) % 40)}%` }} />
                    <span className="h-1.5 w-8 rounded-full bg-black/25" />
                  </div>
                ))}
                <div className="!mt-5 h-px bg-black/15" />
                <div className="flex justify-between">
                  <span className="h-2.5 w-12 rounded-full bg-black/60" />
                  <span className="h-2.5 w-10 rounded-full bg-[#2997ff]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (index === 1) {
    // Smart Safe: concentric dial rings.
    return (
      <div aria-hidden className="absolute inset-0 grid place-items-center [perspective:900px]">
        <div className="relative size-[min(62%,260px)] [transform:rotateX(24deg)]">
          {[1, 0.78, 0.56, 0.34].map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 m-auto rounded-full border border-white/20"
              style={{
                width: `${s * 100}%`,
                height: `${s * 100}%`,
                borderStyle: i % 2 ? 'dashed' : 'solid',
                animation: `spin-slow ${18 + i * 6}s linear infinite ${i % 2 ? 'reverse' : ''}`,
                boxShadow: i === 0 ? 'inset 0 0 60px rgba(255,255,255,0.06)' : undefined,
              }}
            >
              <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            </div>
          ))}
          <div className="absolute inset-0 m-auto size-[18%] rounded-full bg-gradient-to-br from-[#34c759] to-[#30b0c7] shadow-[0_0_40px_rgba(52,199,89,0.6)]" />
        </div>
      </div>
    );
  }
  if (index === 2) {
    // Salon Platform: a schedule with bookings filling in.
    return (
      <div aria-hidden className="absolute inset-0 grid place-items-center [perspective:900px]">
        <div className="grid w-[70%] max-w-[300px] grid-cols-5 gap-2 [transform:rotateX(28deg)_rotateZ(-8deg)]">
          {Array.from({ length: 30 }).map((_, i) => {
            const on = [1, 7, 8, 12, 18, 19, 23, 27].includes(i);
            return (
              <span
                key={i}
                className="aspect-[4/3] rounded-md"
                style={{
                  background: on ? 'linear-gradient(135deg,#ff375f,#ff9f0a)' : 'rgba(255,255,255,0.07)',
                  animation: on ? `pulse-soft ${3 + (i % 4)}s ease-in-out ${i * 0.15}s infinite` : undefined,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
  // Custom Product Development: isometric layers assembling.
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center [perspective:1000px]">
      <div className="relative h-[46%] w-[56%] max-w-[260px] [transform-style:preserve-3d] [transform:rotateX(60deg)_rotateZ(-42deg)]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-2xl border border-white/20"
            style={{
              transform: `translateZ(${i * 22}px)`,
              background: i === 4 ? 'linear-gradient(135deg,#5e5ce6,#bf5af2)' : `rgba(255,255,255,${0.03 + i * 0.025})`,
              animation: `float-y ${4 + i * 0.7}s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
