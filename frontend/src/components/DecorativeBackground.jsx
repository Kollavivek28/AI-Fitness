export default function DecorativeBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora blur-3xl" />
      <div className="noise opacity-40 mix-blend-soft-light" />
      <div className="pointer-events-none absolute inset-0 bg-grid-light opacity-30 dark:bg-grid-dark" />
    </div>
  );
}

