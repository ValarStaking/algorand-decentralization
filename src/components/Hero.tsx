import { scrollToSection } from "@/utils/utils";

function Hero() {
  return (
    <section id="home" className="relative py-2 sm:py-16 lg:py-32">
      <div className="animate-fade-in relative mx-auto max-w-5xl px-6 text-center">
        <h1 className="mb-4 bg-gradient-to-r from-primary-600 via-neutral-900 to-secondary-600 bg-clip-text text-4xl font-extrabold leading-none text-transparent sm:text-5xl lg:text-6xl">
          <span className="inline-block pb-2.5">Algorand Decentralization</span>
        </h1>

        <p className="mb-4 text-lg font-medium text-neutral-700 sm:text-xl lg:text-2xl">
          Explore stake distribution, account participation, and node operators.
        </p>

        <p className="mx-auto mb-8 max-w-3xl text-base text-neutral-600 sm:text-lg">
          Get a detailed view of how online stake is distributed across the Algorand ecosystem. Understand
          decentralization through simple metrics and visuals.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            onClick={() => scrollToSection("overview")}
            className="rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:cursor-pointer hover:bg-primary-700 sm:text-base"
          >
            To Overview
          </a>
          <a
            onClick={() => scrollToSection("operators")}
            className="rounded-full border border-neutral-400 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:cursor-pointer hover:bg-neutral-100 sm:text-base"
          >
            View Operators
          </a>
          <a
            onClick={() => scrollToSection("faq")}
            className="rounded-full border border-neutral-400 px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:cursor-pointer hover:bg-neutral-100 sm:text-base"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
