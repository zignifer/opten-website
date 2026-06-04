import { useMemo, useState } from "react";
import { CourseSection, LearnSectionWrapper } from "../../components/space/learn/LearnComponents";
import { getLearnOverviewSections, learnFilters, type LearnFilter } from "../../../content/space/learn";

export default function LearnOverviewPage() {
  const [activeFilter, setActiveFilter] = useState<LearnFilter>("All");
  const [query, setQuery] = useState("");

  const sections = useMemo(() => getLearnOverviewSections(query, activeFilter), [query, activeFilter]);

  return (
    <LearnSectionWrapper>
      <section className="max-w-[740px]">
        <div>
          <h1 className="font-['Unbounded',sans-serif] text-[32px] font-medium leading-[1.1] tracking-normal text-white max-sm:text-[30px]">
            Learn
          </h1>
          <p className="mt-[10px] text-[14px] leading-[1.5] text-white/70">
            Practical Opten workflows for prompt packs, models, and brand context.
          </p>

          <label className="relative mt-[18px] block">
            <span className="sr-only">Search lessons</span>
            <img
              src="/assets/space/figma/search.svg"
              alt=""
              aria-hidden="true"
              width="16"
              height="16"
              className="pointer-events-none absolute left-[16px] top-1/2 h-[16px] w-[16px] -translate-y-1/2"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lessons"
              className="h-[42px] w-full rounded-full border border-white/10 bg-white/[0.05] pl-[44px] pr-[18px] text-[14px] text-white outline-none transition placeholder:text-white/40 focus:border-white/25 focus:bg-white/[0.07]"
            />
          </label>

          <div className="mt-[16px] flex flex-wrap gap-[8px]" role="group" aria-label="Learn filters">
            {learnFilters.map((filter) => {
              const active = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={active}
                  className={`h-[32px] rounded-full border px-[14px] text-[14px] font-medium transition ${
                    active
                      ? "border-transparent bg-[#9cfb51] text-[#011417]"
                      : "border-white/12 bg-transparent text-white/80 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mt-[40px] space-y-[42px]">
        {sections.map((section) => (
          <CourseSection key={section.id} section={section} />
        ))}
      </div>

      {sections.length === 0 && (
        <section className="mt-[32px] rounded-[10px] border border-white/10 bg-white/[0.035] px-[20px] py-[42px] text-center">
          <p className="text-[16px] text-white">No lessons found</p>
        </section>
      )}

    </LearnSectionWrapper>
  );
}
