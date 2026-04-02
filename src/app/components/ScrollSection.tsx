// app/components/ScrollSection.tsx
"use client";

import { Element } from "react-scroll";

interface ScrollSectionProps {
  id: string;
  children: React.ReactNode;
}

export default function ScrollSection({ id, children }: ScrollSectionProps) {
  return (
    <Element name={id}>
      <section className="w-full px-4 py-12 sm:px-6 lg:px-8 xl:py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </section>
    </Element>
  );
}