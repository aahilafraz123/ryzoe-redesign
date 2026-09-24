import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center bg-canvas pt-24">
      <div className="shell text-center">
        <p className="eyebrow mb-6">404</p>
        <h1 className="display text-ink">This page moved on.</h1>
        <div className="mt-10 flex justify-center">
          <Button href="/">Back to home</Button>
        </div>
      </div>
    </section>
  );
}
