import { Link } from "@tanstack/react-router";
import { Reveal, SectionHeading } from "./Reveal";
import { FAQS } from "@/lib/structured-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <section className="bg-background py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-12">
        <SectionHeading
          eyebrow="Good To Know"
          title="Frequently Asked Questions."
          subtitle="Everything brides and party clients ask before booking their appointment."
        />

        <Reveal delay={120} className="mt-16">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${i}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="py-7 text-left font-display text-lg font-light text-foreground hover:text-champagne hover:no-underline sm:text-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-8 text-sm leading-[1.95] font-light text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={200} className="mt-14 text-center">
          <p className="text-sm font-light text-muted-foreground">
            Still have a question?
          </p>
          <Link
            to="/contact"
            className="mt-4 inline-flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.24em] text-foreground uppercase transition-colors duration-500 hover:text-champagne"
          >
            Ask Natasha Directly
            <span className="h-px w-8 bg-current" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
