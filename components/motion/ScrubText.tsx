import clsx from 'clsx';

type Props = { segments: { text: string; className?: string }[]; className?: string; as?: 'p' | 'h2' | 'h3' };

/** Words fade from faint to solid as the block scrolls through the viewport. */
export default function ScrubText({ segments, className, as: Tag = 'p' }: Props) {
  const label = segments.map((s) => s.text).join(' ');
  return (
    <Tag className={clsx(className)} data-scrub="" aria-label={label}>
      {segments.map((seg, si) => (
        <span key={si} className={seg.className} aria-hidden="true">
          {seg.text.split(/\s+/).map((w, i) => (
            <span key={i} className="scrub-w">
              {w}{' '}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
