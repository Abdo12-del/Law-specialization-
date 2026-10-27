import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReactFlow } from '@xyflow/react';
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Check, CornerDownLeft, Gavel, LogOut, Map as MapIcon } from 'lucide-react';
import type { ChapterData } from '@/types/presentation';
import type { FlatSlide } from '@/lib/navigation';
import { cn } from '@/lib/cn';
import { isBlankChapter } from '@/lib/blank';

interface MapScreenProps {
  chapters: ChapterData[];
  slides: FlatSlide[];
  currentChapterId?: string;
  lastSlideId?: string;
  visited: string[];
  onSelect: (index: number) => void;
}

type MindMapNodeData =
  | { kind: 'root'; filled: boolean }
  | {
      kind: 'chapter';
      chapter: ChapterData;
      title: string;
      chapterIndex: number;
      current: boolean;
      visitedCount: number;
      focused: boolean;
      activeSlideId?: string;
      lastSlideId?: string;
      visited: string[];
      filled: boolean;
      onSelect: (index: number, chapterId: string) => void;
      slideIndexes: Record<string, number>;
    };
type MindMapFlowNode = Node<MindMapNodeData, 'mindmap'>;

const SHORT_CHAPTER_TITLES = ['التحليل الشكلي', 'الأساس القانوني', 'موقف المحكمة وآثار القرار'];
const SHORT_TOPIC_TITLES: Record<string, string[]> = {
  ch1: ['الوقائع والأطراف', 'ادعاءات الأطراف', 'المسار الإجرائي', 'الإشكال والحل'],
  ch2: ['مدخل وخطة التحليل', 'الخطبة أم الزواج؟', 'شروط صحة الزواج'],
  ch3: ['تعليل المحكمة', 'القاعدة وأهمية القرار'],
};

function MindMapNodeView({ data }: NodeProps<MindMapFlowNode>) {
  if (data.kind === 'root') {
    return (
      <>
        <Handle id="root-right-upper" type="source" position={Position.Right} style={{ top: '26%' }} className="law-map-handle" />
        <Handle id="root-right-lower" type="source" position={Position.Right} style={{ top: '74%' }} className="law-map-handle" />
        <Handle id="root-left" type="source" position={Position.Left} className="law-map-handle" />
        <div className="flex h-full w-full flex-col items-center justify-center rounded-[1.6rem] border border-amber-300/50 bg-[#172237] px-5 text-center shadow-[0_0_35px_rgba(214,166,90,0.14),0_16px_45px_-22px_rgba(0,0,0,0.9)]">
          {data.filled && <span className="text-[10px] font-bold tracking-[0.16em] text-amber-300">المسألة المركزية</span>}
          {data.filled && <span className="mt-1 text-base font-extrabold leading-6 text-[#fffaf0]">تحليل القرار القضائي</span>}
          {!data.filled && <Gavel className="h-6 w-6 text-amber-300" aria-hidden="true" />}
        </div>
      </>
    );
  }

  const { chapter, title, chapterIndex, current, visitedCount, focused, activeSlideId, lastSlideId, visited, filled, onSelect, slideIndexes } = data;
  const ChapterIcon = chapter.icon;
  const targetSide = chapterIndex === 2 ? Position.Right : Position.Left;

  return (
    <>
      <Handle id="chapter-target" type="target" position={targetSide} className="law-map-handle" />
      <motion.section
        animate={{
          scale: focused ? 1.025 : 1,
          borderColor: focused ? 'rgba(245,200,118,.9)' : 'rgba(214,166,90,.25)',
          boxShadow: focused ? '0 0 0 2px rgba(245,200,118,.18), 0 0 40px rgba(214,166,90,.28)' : '0 18px 50px -32px rgba(0,0,0,.9)',
        }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full overflow-hidden rounded-[1.35rem] border bg-gradient-to-br from-[#17283c]/95 to-[#0b1525]/95 p-4 sm:p-5"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/25 bg-[#0b1220]/65 text-amber-300">
            <ChapterIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            {filled && (
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-amber-300">
                <span>الفصل {chapterIndex + 1}</span>
                {current && <span className="rounded-full bg-amber-300 px-2 py-0.5 text-slate-950">الفصل الحالي</span>}
              </div>
            )}
            {filled && <h3 className="mt-1 text-lg font-extrabold leading-6 text-[#fffaf0]">{title}</h3>}
            {!filled && <span className="sr-only">{chapterIndex + 1}</span>}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full bg-amber-300/80" style={{ width: `${(visitedCount / chapter.slides.length) * 100}%` }} />
          </span>
          <span className="tabular-nums">{visitedCount} / {chapter.slides.length}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" aria-label={`محاور ${chapter.title || `الفصل ${chapterIndex + 1}`}`}>
          {chapter.slides.map((slide, slideIndex) => {
            const SlideIcon = slide.icon;
            const isLast = slide.id === lastSlideId;
            const seen = visited.includes(slide.id);
            const isPlaceholder = slide.archetype === 'placeholder';
            const topicTitle = filled
              ? (SHORT_TOPIC_TITLES[chapter.id]?.[slideIndex] ?? slide.title) || `محور ${slideIndex + 1}`
              : '';
            return (
              <button
                key={slide.id}
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(slideIndexes[slide.id] ?? 0, chapter.id);
                }}
                aria-label={`افتح الشريحة: ${topicTitle || `المحور ${slideIndex + 1}`} — ${chapter.title || `الفصل ${chapterIndex + 1}`}`}
                className={cn(
                  'nodrag nopan inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-start text-[11px] font-semibold leading-4 transition sm:text-xs',
                  activeSlideId === slide.id && 'ring-2 ring-amber-200/80 ring-offset-2 ring-offset-[#111b2a]',
                  isLast
                    ? 'border-amber-300/60 bg-amber-300/15 text-amber-100'
                    : isPlaceholder
                      ? 'border-dashed border-white/20 bg-[#0b1220]/35 text-slate-300 hover:border-amber-300/40 hover:text-amber-100'
                      : 'border-white/10 bg-[#0b1220]/40 text-slate-200 hover:border-amber-300/35 hover:bg-amber-300/[0.08] hover:text-[#fffaf0]',
                )}
              >
                {seen && !isLast ? <Check className="h-3 w-3 shrink-0 text-emerald-300" aria-hidden="true" /> : <SlideIcon className="h-3 w-3 shrink-0 text-amber-300/80" aria-hidden="true" />}
                {filled && <span className="max-w-[15rem] truncate">{topicTitle}</span>}
                {isPlaceholder && filled && <span className="text-[10px] font-normal text-amber-300/80">فارغة</span>}
              </button>
            );
          })}
        </div>
      </motion.section>
    </>
  );
}

const nodeTypes: NodeTypes = { mindmap: MindMapNodeView };

/** Builds the presentation graph separately so its legal branches and links stay testable. */
export function createMindMapGraph(
  props: MapScreenProps,
  compact = false,
  focusedChapterId?: string,
  activeSlideId?: string,
  onSelectTopic?: (index: number, chapterId: string) => void,
) {
  const { chapters, slides, currentChapterId, lastSlideId, visited, onSelect } = props;
  const filled = chapters.some((chapter) => !isBlankChapter(chapter));
  const slideIndexes = Object.fromEntries(slides.map((slide) => [slide.slide.id, slide.index]));
  const chapterPositions = compact
    ? chapters.map((_, index) => ({ x: 70, y: 150 + index * 220 }))
    : chapters.map((_, index) => {
        if (index === 0) return { x: 900, y: 25 };
        if (index === 1) return { x: 900, y: 375 };
        if (index === 2) return { x: 30, y: 200 };
        return { x: 900, y: 75 + index * 210 };
      });

  const nodes: MindMapFlowNode[] = [
    {
      id: 'law-mindmap-root',
      type: 'mindmap',
      position: compact ? { x: 130, y: 10 } : { x: 500, y: 242 },
      data: { kind: 'root', filled },
      style: { width: compact ? 240 : 230, height: 92 },
      draggable: false,
      selectable: false,
    },
    ...chapters.map((chapter, chapterIndex): MindMapFlowNode => ({
      id: chapter.id,
      type: 'mindmap',
      position: chapterPositions[chapterIndex] ?? { x: 900, y: 75 + chapterIndex * 210 },
      data: {
        kind: 'chapter',
        chapter,
        title: filled && chapters.length === 3 ? SHORT_CHAPTER_TITLES[chapterIndex] ?? chapter.title : chapter.title,
        chapterIndex,
        current: chapter.id === currentChapterId,
        visitedCount: chapter.slides.filter((slide) => visited.includes(slide.id)).length,
        focused: focusedChapterId === chapter.id,
        activeSlideId: focusedChapterId === chapter.id ? activeSlideId : undefined,
        lastSlideId,
        visited,
        filled,
        onSelect: onSelectTopic ?? ((index: number) => onSelect(index)),
        slideIndexes,
      },
      style: { width: compact ? 340 : 360, height: 190 },
      draggable: false,
      selectable: false,
    })),
  ];

  const edges: Edge[] = chapters.map((chapter, index) => ({
    id: `law-map-edge-${chapter.id}`,
    source: 'law-mindmap-root',
    target: chapter.id,
    sourceHandle: compact ? 'root-right-upper' : index === 0 ? 'root-right-upper' : index === 1 ? 'root-right-lower' : 'root-left',
    targetHandle: 'chapter-target',
    type: 'default',
    animated: focusedChapterId === chapter.id,
    style: {
      stroke: focusedChapterId === chapter.id ? '#f5c876' : '#c49a58',
      strokeWidth: focusedChapterId === chapter.id ? 4 : 3,
      opacity: focusedChapterId && focusedChapterId !== chapter.id ? 0.28 : 0.9,
    },
    selectable: false,
  }));

  return { nodes, edges, filled };
}

function MindMapCanvas(props: MapScreenProps) {
  const compact = typeof window !== 'undefined' && window.innerWidth < 760;
  const { fitView } = useReactFlow<MindMapFlowNode, Edge>();
  const [focus, setFocus] = useState<{ chapterId: string; slideId: string } | null>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (navigationTimer.current) clearTimeout(navigationTimer.current);
  }, []);

  const focusThenNavigate = useCallback((index: number, chapterId: string) => {
    if (navigationTimer.current) clearTimeout(navigationTimer.current);
    const slideId = props.slides[index]?.slide.id ?? '';
    setFocus({ chapterId, slideId });
    void fitView({ nodes: [{ id: chapterId }], padding: 0.2, duration: 420 });
    navigationTimer.current = setTimeout(() => {
      navigationTimer.current = null;
      setFocus(null);
      props.onSelect(index);
    }, 460);
  }, [fitView, props.onSelect, props.slides]);

  const { nodes, edges } = createMindMapGraph(
    props,
    compact,
    focus?.chapterId,
    focus?.slideId,
    focusThenNavigate,
  );

  return (
    <div className="legal-mindmap relative mt-5 min-h-[560px] flex-1 overflow-hidden rounded-3xl border border-amber-400/15 bg-[#071326]/25" style={{ height: compact ? 850 : '100%' }}>
      <ReactFlow<MindMapFlowNode, Edge>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: compact ? 0.08 : 0.07, minZoom: compact ? 0.42 : 0.65, maxZoom: 1.15 }}
        minZoom={compact ? 0.32 : 0.5}
        maxZoom={1.35}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        proOptions={{ hideAttribution: false }}
        aria-label="الخريطة الذهنية لتحليل القرار القضائي"
      >
        <Background variant={BackgroundVariant.Dots} gap={26} size={1} color="#b88c50" />
        <Controls position="bottom-left" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export function MapScreen(props: MapScreenProps) {
  const filled = props.chapters.some((chapter) => !isBlankChapter(chapter));
  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col overflow-y-auto px-5 pt-7 pb-24 sm:px-8 sm:pt-9 lg:px-10">
      {filled && (
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <MapIcon className="h-4 w-4" /> خريطة العرض
            </div>
            <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">من وقائع النزاع إلى أثر القرار</h2>
            <p className="mt-1 text-sm text-slate-400">اسحب الخريطة للتنقّل، واستخدم أزرار التكبير أو مرّر للتقريب.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <CornerDownLeft className="h-3.5 w-3.5" /> Enter للمتابعة من آخر موضع
            </span>
            <span className="inline-flex items-center gap-1.5">
              <LogOut className="h-3.5 w-3.5" /> Esc للعودة إلى شاشة العنوان
            </span>
          </div>
        </header>
      )}
      <ReactFlowProvider>
        <MindMapCanvas {...props} />
      </ReactFlowProvider>
    </div>
  );
}
