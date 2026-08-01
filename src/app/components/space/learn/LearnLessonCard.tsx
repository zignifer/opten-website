import { Play } from "lucide-react";
import {
  getLearnAuthorName,
  getLearnLessonAuthor,
  getLearnLessonCategoryLabel,
  getLearnLessonDescription,
  getLearnLessonTitle,
  type LearnLang,
  type LearnLesson,
} from "../../../../content/space/learn";
import LocalizedLink from "../../LocalizedLink";
import ResponsiveImage from "../../ResponsiveImage";

type LearnLessonCardProps = {
  lesson: LearnLesson;
  lang: LearnLang;
  href?: string;
  showDescription?: boolean;
};

export default function LearnLessonCard({ lesson, lang, href, showDescription = false }: LearnLessonCardProps) {
  const author = getLearnLessonAuthor(lesson);
  const authorName = getLearnAuthorName(author, lang);

  return (
    <LocalizedLink
      to={href ?? `/learn/${lesson.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[9px] border border-white/10 bg-[#0e2023] text-left no-underline transition hover:-translate-y-0.5 hover:border-[#9cfb51]/45 hover:bg-[#10282c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9cfb51]"
    >
      <div className="relative aspect-video overflow-hidden bg-[#0e2023]">
        <ResponsiveImage
          src={lesson.thumbnailPath}
          alt=""
          width="1200"
          height="676"
          loading="lazy"
          widths={[360, 480, 720, 960]}
          sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 36px), 380px"
          className="h-full w-full object-cover opacity-82 transition duration-500 group-hover:scale-[1.035]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,16,18,0.04),rgba(1,16,18,0.26))]" />
        <span className="absolute left-1/2 top-1/2 grid size-[48px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#9cfb51] text-[#011417] shadow-[0_14px_38px_rgba(156,251,81,0.22)] transition group-hover:scale-[1.04] group-hover:bg-[#8ff144]">
          <Play size={21} fill="currentColor" className="ml-[2px]" />
        </span>
        <span className="absolute bottom-[8px] right-[8px] rounded-[4px] bg-black/72 px-[6px] py-[4px] text-[13px] font-medium leading-none text-white">
          {lesson.duration}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-[14px] pb-[20px] pt-[13px]">
        <p className="text-[12px] leading-none text-white/38">{getLearnLessonCategoryLabel(lesson, lang)}</p>
        <h3 className="mt-[9px] line-clamp-2 min-h-[47px] text-[18px] font-bold leading-[1.3] text-white">
          {getLearnLessonTitle(lesson, lang)}
        </h3>
        {showDescription && (
          <p className="mt-[9px] line-clamp-3 text-[13px] leading-[1.5] text-white/58">
            {getLearnLessonDescription(lesson, lang)}
          </p>
        )}
        <div className={`${showDescription ? "mt-auto pt-[20px]" : "mt-[22px]"} flex items-center gap-[10px] text-[13px] text-white/52`}>
          <ResponsiveImage
            src={author.avatarPath}
            alt=""
            width="400"
            height="400"
            loading="lazy"
            decoding="async"
            widths={[64, 96]}
            sizes="25px"
            className="size-[25px] shrink-0 rounded-full border border-white/14 object-cover"
          />
          <span className="truncate">{authorName}</span>
          <span className="ml-auto shrink-0 text-white/35">{formatLessonDate(lesson.publishedAt, lang)}</span>
        </div>
      </div>
    </LocalizedLink>
  );
}

function formatLessonDate(publishedAt: string, lang: LearnLang) {
  const date = new Date(`${publishedAt}T00:00:00Z`);
  return new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}
