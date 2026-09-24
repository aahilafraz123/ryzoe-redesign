'use client';

import { useState, type FormEvent } from 'react';
import clsx from 'clsx';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';
import Html from '@/components/ui/Html';
import { AAHIL } from '@/lib/aahil';

type Field = { name: string; type: string; label: string; required: boolean };

/**
 * Same fields and validation as the live form. The static build has no backend,
 * so a valid submission opens a pre-filled email to the site's builder.
 */
export default function ContactForm({ fields, notes = [], to = AAHIL.email }: { fields: Field[]; notes?: string[]; to?: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      const v = String(data.get(f.name) ?? '').trim();
      if (f.required && !v) next[f.name] = `${f.label} is required.`;
      if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) next[f.name] = 'Enter a valid email address.';
      if (f.name === 'message' && v && v.length < 10) next[f.name] = 'Please add at least 10 characters so we can understand your project.';
    });
    setErrors(next);
    if (Object.keys(next).length) return;
    const body = fields.map((f) => `${f.label}: ${String(data.get(f.name) ?? '').trim()}`).join('\n');
    const subject = `Project inquiry from ${String(data.get('name') ?? '').trim()}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center rounded-[2rem] bg-surface p-10 ring-1 ring-inset ring-black/[0.05]">
        <CheckCircle size={40} weight="light" className="text-[#34c759]" />
        <p className="mt-6 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">Your email app should now be open.</p>
        <p className="mt-2 text-muted">Send the pre-filled message and I will get back to you.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-8 text-sm font-medium text-ink underline underline-offset-4">
          Edit your brief
        </button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-[2rem] bg-surface p-6 ring-1 ring-inset ring-black/[0.05] md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((f) => {
          const err = errors[f.name];
          const common = clsx(
            'peer w-full rounded-2xl border bg-canvas/60 px-4 pb-3 pt-7 text-[1rem] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-transparent',
            'focus:border-ink/30 focus:bg-surface focus:shadow-[0_0_0_4px_rgba(0,113,227,0.12)]',
            err ? 'border-[#ff3b30]/60' : 'border-transparent',
          );
          return (
            <div key={f.name} className={clsx('relative', f.type === 'textarea' && 'md:col-span-2')}>
              {f.type === 'textarea' ? (
                <textarea id={f.name} name={f.name} rows={6} placeholder={f.label} aria-invalid={!!err} aria-describedby={err ? `${f.name}-err` : undefined} className={clsx(common, 'resize-none')} />
              ) : (
                <input id={f.name} name={f.name} type={f.type} placeholder={f.label} aria-invalid={!!err} aria-describedby={err ? `${f.name}-err` : undefined} className={common} />
              )}
              <label
                htmlFor={f.name}
                className="pointer-events-none absolute left-4 top-2.5 text-[0.75rem] text-faint transition-all duration-300 peer-placeholder-shown:top-[1.1rem] peer-placeholder-shown:text-[1rem] peer-focus:top-2.5 peer-focus:text-[0.75rem]"
              >
                {f.label}
              </label>
              {err ? (
                <p id={`${f.name}-err`} className="mt-2 pl-1 text-[0.85rem] text-[#d70015]">
                  {err}
                </p>
              ) : (
                f.name === 'message' && <p className="mt-2 pl-1 text-[0.85rem] text-faint">Please add at least 10 characters so we can understand your project.</p>
              )}
            </div>
          );
        })}
      </div>
      <button type="submit" className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink px-7 text-[0.95rem] font-medium text-white transition-colors duration-300 hover:bg-black">
        Send message
        <ArrowRight weight="bold" className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
      </button>
      {notes.map((n) => (
        <Html key={n} as="p" html={n} className="inline-links mt-6 text-[0.95rem] text-muted" />
      ))}
    </form>
  );
}
