import Reveal from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Upload the document",
    body: "Drop in a PDF — a lease, a policy, a consent form. Your analysis stays in temporary server memory.",
  },
  {
    n: "02",
    title: "Redline reads every clause",
    body: "It's broken into pieces, checked for what actually affects your money, rights, or obligations, and ranked by risk.",
  },
  {
    n: "03",
    title: "Ask it anything",
    body: "\u201cWhat happens if I cancel early?\u201d Answers come from your document's own text — never a generic guess.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-[#D7C9B8] bg-[#F5F1EA]/60 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-lg">
          <p className="font-mono text-xs uppercase tracking-wider text-[#4A342A]/60">
            Process
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-[#4A342A] sm:text-4xl">
            From confusing to clear in three steps
          </h2>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
          <div
            className="absolute left-0 right-0 top-5 hidden h-px bg-[#D7C9B8] sm:block"
            aria-hidden
          />
          {steps.map((step) => (
            <Reveal key={step.n} delay={Number(step.n) * 0.08} className="relative">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#4A342A] bg-[#F5F1EA] font-mono text-xs text-[#4A342A] shadow-sm">
                {step.n}
              </div>
              <h3 className="mt-5 font-display text-xl text-[#4A342A]">{step.title}</h3>
              <p className="mt-2 max-w-xs font-sans text-[15px] leading-relaxed text-[#4A342A]/75">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}