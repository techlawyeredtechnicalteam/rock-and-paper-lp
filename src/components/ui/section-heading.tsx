type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
      <p className={`eyebrow pt-2 ${light ? "text-stone/70" : "text-taupe"}`}>{eyebrow}</p>
      <div className="lg:col-span-8 lg:col-start-5">
        <h2
          className={`display-title max-w-4xl text-5xl sm:text-6xl lg:text-7xl ${
            light ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {description ? (
          <p className={`mt-7 max-w-2xl text-base leading-8 ${light ? "text-stone/75" : "text-muted"}`}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
