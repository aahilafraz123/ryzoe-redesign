import { createElement, type ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  immediate?: boolean;
  id?: string;
  /** Optional node inserted after the word at this index (inline typography object). */
  insert?: { after: number; node: ReactNode };
};

/** Heading whose words rise out of masks; animated by MotionDirector via data-split. */
export default function SplitHeading({ text, as = 'h2', className, immediate, id, insert }: Props) {
  const words = text.split(/\s+/).filter(Boolean);
  return createElement(
    as,
    { className: clsx(className), 'data-split': '', 'data-immediate': immediate ? '' : undefined, id, 'aria-label': text },
    words.map((w, i) => (
      <span key={i} aria-hidden="true">
        <span className="split-word">
          <span>{w}</span>
        </span>
        {insert && insert.after === i ? insert.node : null}
        {i < words.length - 1 ? ' ' : null}
      </span>
    )),
  );
}
