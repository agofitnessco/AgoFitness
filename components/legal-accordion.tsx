"use client";

import clsx from "clsx";
import { useState } from "react";

export type LegalSection = {
  title: string;
  body: React.ReactNode;
};

export function LegalAccordion({
  sections,
  numbered = true,
  className,
  defaultOpenIndex = 0,
}: {
  sections: LegalSection[];
  numbered?: boolean;
  className?: string;
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className={clsx("border-t border-neutral-200", className ?? "mt-12")}>
      {sections.map((section, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={section.title} className="border-b border-neutral-200">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="text-lg font-medium tracking-tight text-black lg:text-xl">
                {numbered ? `${index + 1}. ` : ""}
                {section.title}
              </span>
              <span
                className={clsx(
                  "relative h-4 w-4 flex-none transition-transform duration-300",
                  isOpen && "rotate-45",
                )}
              >
                <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 bg-black" />
                <span className="absolute top-0 left-1/2 h-4 w-[1.5px] -translate-x-1/2 bg-black" />
              </span>
            </button>
            <div
              className={clsx(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] pb-7" : "grid-rows-[0fr]",
              )}
            >
              <div className="space-y-4 overflow-hidden text-[15px] leading-relaxed text-neutral-600">
                {section.body}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
