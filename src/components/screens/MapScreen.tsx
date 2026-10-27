import { motion } from 'framer-motion';
import { Check, CornerDownLeft, LogOut, Map as MapIcon } from 'lucide-react';
import type { ChapterData } from '@/types/presentation';
import type { FlatSlide } from '@/lib/navigation';
import { fadeUp } from '@/components/ui';
import { cn } from '@/lib/cn';
import { hasText, isBlankChapter } from '@/lib/blank';

interface MapScreenProps {
  chapters: ChapterData[];
  slides: FlatSlide[];
  currentChapterId?: string;
  lastSlideId?: string;
  visited: string[];
  onSelect: (index: number) => void;
}

const BRANCH_POSITIONS = [
  'md:right-0 md:top-[1%] md:w-[32%]',
  'md:right-0 md:bottom-[1%] md:w-[32%]',
  'md:left-0 md:top-1/2 md:w-[32%] md:-translate-y-1/2',
];

const LEGAL_BRANCH_TITLES = ['التحليل الشكلي', 'الأساس القانوني', 'موقف المحكمة وآثار القرار'];

/** خريطة ذهنية تفاعلية: العقدة المركزية تتفرع إلى فصول البحث ومحاورها القابلة للنقر. */
export function MapScreen({ chapters, slides, currentChapterId, lastSlideId, visited, onSelect }: MapScreenProps) {
  const indexOf = (slideId: string) => slides.find((s) => s.slide.id === slideId)?.index ?? 0;
  const filled = chapters.some((chapter) => !isBlankChapter(chapter));

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-y-auto px-5 pt-7 pb-24 sm:px-8 sm:pt-9 lg:px-10">
      {filled && (
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <MapIcon className="h-4 w-4" /> خريطة العرض
            </div>
            <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">من وقائع النزاع إلى أثر القرار</h2>
            <p className="mt-1 text-sm text-slate-400">مسار التحليل: الوقائع، ثم الأساس القانوني، ثم موقف المحكمة.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CornerDownLeft className="h-3.5 w-3.5" /> Enter للمتابعة من آخر موضع
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LogOut className="h-3.5 w-3.5" /> Esc للعودة إلى شاشة العنوان
            </span>
          </div>
        </motion.header>
      )}

      <div className="relative mt-5 min-h-[540px] flex-1 md:min-h-[560px]">
        {filled && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            viewBox="0 0 1000 620"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="mindmap-copper" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#d6a65a" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#d6a65a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#a87939" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <path d="M500 310 C640 310 650 125 805 125" fill="none" stroke="url(#mindmap-copper)" strokeWidth="3" />
            <path d="M500 310 C640 310 650 495 805 495" fill="none" stroke="url(#mindmap-copper)" strokeWidth="3" />
            <path d="M500 310 C380 310 340 310 195 310" fill="none" stroke="url(#mindmap-copper)" strokeWidth="3" />
            <circle cx="500" cy="310" r="8" fill="#d6a65a" />
            <circle cx="805" cy="125" r="6" fill="#d6a65a" />
            <circle cx="805" cy="495" r="6" fill="#d6a65a" />
            <circle cx="195" cy="310" r="6" fill="#d6a65a" />
          </svg>
        )}

        {filled && (
          <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2">
            <div className="flex min-w-48 flex-col items-center rounded-[1.6rem] border border-amber-300/55 bg-[#172237] px-5 py-3 text-center shadow-[0_0_35px_rgba(214,166,90,0.14),0_16px_45px_-22px_rgba(0,0,0,0.9)] md:min-w-52 md:px-6 md:py-5">
              <span className="text-[10px] font-bold tracking-[0.18em] text-amber-300">المسألة المركزية</span>
              <span className="mt-1 text-sm font-extrabold leading-6 text-[#fffaf0] md:text-base">تحليل القرار القضائي</span>
            </div>
          </div>
        )}

        <ol aria-label="فروع الخريطة الذهنية" className={cn('relative z-10 flex flex-col gap-3', filled && 'pt-20 md:block md:h-full md:pt-0')}>
          {chapters.map((chapter, ci) => {
            const ChapterIcon = chapter.icon;
            const isCurrent = chapter.id === currentChapterId;
            const visitedCount = chapter.slides.filter((slide) => visited.includes(slide.id)).length;
            const branchPosition = BRANCH_POSITIONS[ci] ?? 'md:right-0 md:top-1/2 md:w-[32%] md:-translate-y-1/2';
            const branchTitle = filled && chapters.length === 3 ? LEGAL_BRANCH_TITLES[ci] ?? chapter.title : chapter.title;

            return (
              <motion.li
                key={chapter.id}
                variants={fadeUp}
                aria-label={chapter.title || `الفصل ${ci + 1}`}
                className={cn(
                  'relative w-full rounded-[1.4rem] border bg-gradient-to-br p-4 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.9)] transition sm:p-5',
                  chapter.color,
                  isCurrent ? 'border-amber-300/65 shadow-[0_0_0_1px_rgba(214,166,90,0.28),0_18px_55px_-28px_rgba(214,166,90,0.34)]' : 'border-white/12',
                  filled && 'md:absolute md:min-h-[146px]',
                  filled && branchPosition,
                )}
              >
                <div className="flex items-start gap-3">
                  <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border bg-[#0b1220]/70', chapter.accent)}>
                    <ChapterIcon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {filled && <span className="text-[11px] font-bold text-amber-300">الفصل {ci + 1} · المحطة {String(ci + 1).padStart(2, '0')}</span>}
                      {isCurrent && filled && <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-black text-slate-950">الفصل الحالي</span>}
                    </div>
                    <h3 className="mt-1 text-base font-extrabold leading-6 text-[#fffaf0] sm:text-lg">{branchTitle}</h3>
                    {chapters.length !== 3 && hasText(chapter.subtitle) && <p className="mt-1 text-xs leading-5 text-slate-300/80">{chapter.subtitle}</p>}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <span className="block h-full bg-amber-300/80" style={{ width: `${(visitedCount / chapter.slides.length) * 100}%` }} />
                  </span>
                  <span className="tabular-nums">{visitedCount} / {chapter.slides.length}</span>
                </div>

                <ol className="mt-3 flex flex-wrap gap-2" aria-label={`محاور ${chapter.title || `الفصل ${ci + 1}`}`}>
                  {chapter.slides.map((slide, si) => {
                    const SlideIcon = slide.icon;
                    const isLast = slide.id === lastSlideId;
                    const seen = visited.includes(slide.id);
                    const isPlaceholder = slide.archetype === 'placeholder';
                    return (
                      <li key={slide.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(indexOf(slide.id))}
                          aria-label={`${slide.title || `المحور ${si + 1}`} — ${chapter.title || `الفصل ${ci + 1}`}`}
                          className={cn(
                            'group inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-start text-[11px] font-semibold leading-4 transition sm:text-xs',
                            isLast
                              ? 'border-amber-300/60 bg-amber-300/15 text-amber-100'
                              : isPlaceholder
                                ? 'border-dashed border-white/20 bg-[#0b1220]/35 text-slate-300 hover:border-amber-300/40 hover:text-amber-100'
                                : 'border-white/10 bg-[#0b1220]/40 text-slate-200 hover:border-amber-300/35 hover:bg-amber-300/[0.08] hover:text-[#fffaf0]',
                          )}
                        >
                          {seen && !isLast ? <Check className="h-3 w-3 shrink-0 text-emerald-300" aria-hidden="true" /> : <SlideIcon className="h-3 w-3 shrink-0 text-amber-300/80" aria-hidden="true" />}
                          <span className="max-w-[15rem] truncate">{filled ? slide.title || `محور ${si + 1}` : ''}</span>
                          {isPlaceholder && filled && <span className="text-[10px] font-normal text-amber-300/80">فارغة</span>}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
