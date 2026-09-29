export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-dashed border-[var(--silver)] bg-white px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">{body}</p>
    </div>
  );
}
