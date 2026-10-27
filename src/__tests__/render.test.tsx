import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Info, Layers } from 'lucide-react';
import { blankPresentation as presentation } from '@/data/blank-template';
import { presentation as legalPresentation } from '@/data/presentation';
import { flattenSlides } from '@/lib/navigation';
import type { ChapterData, PresentationData } from '@/types/presentation';
import { Presentation } from '@/components/Presentation';
import { TitleScreen } from '@/components/screens/TitleScreen';
import { PrefaceScreen } from '@/components/screens/PrefaceScreen';
import { createMindMapGraph, MapScreen } from '@/components/screens/MapScreen';
import { SlideScreen } from '@/components/screens/SlideScreen';
import { FinalScreen } from '@/components/screens/FinalScreen';

const slides = flattenSlides(presentation.chapters);
const noop = () => undefined;

/** النصّ المرئي فقط: بلا وسوم ولا سمات (aria-label/title لا تُعرض). */
const visibleText = (html: string) =>
  html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** أرقام ومسافات وشرطة الكسر فقط (العدّادات مسموحة في القالب الأبيض). */
const onlyCounters = (text: string) => /^[\d\s/]*$/.test(text);

describe('القالب الأبيض: لا نصّ على أي شاشة (تبقى عناصر التنقل فقط)', () => {
  it('شاشة العنوان بلا أي نصّ — زر البدء أيقونة فقط', () => {
    const html = renderToStaticMarkup(<TitleScreen meta={presentation.meta} onStart={noop} />);
    expect(visibleText(html)).toBe('');
    expect(html).toContain('<button');
    expect(html).not.toContain('اضغط للبدء');
  });

  it('كل خطوات المقدمة بيضاء — مؤشر الخطوات أرقام فقط', () => {
    presentation.preface.forEach((_, step) => {
      const html = renderToStaticMarkup(<PrefaceScreen steps={presentation.preface} step={step} onGoto={noop} />);
      const text = visibleText(html);
      expect(onlyCounters(text), text).toBe(true);
      expect(text).not.toContain('المقدمة');
      expect(text).not.toContain('الإشكالية');
    });
  });

  it('الخريطة البيضاء ترسم لوحة React Flow بلا عناوين، وتحتفظ بفروعها وروابطها', () => {
    const props = { chapters: presentation.chapters, slides, visited: [], onSelect: noop, currentChapterId: 'ch1' };
    const html = renderToStaticMarkup(<MapScreen {...props} />);
    const graph = createMindMapGraph(props);
    expect(html).toContain('aria-label="الخريطة الذهنية لتحليل القرار القضائي"');
    expect(html).toContain('react-flow__controls');
    expect(html).not.toContain('خريطة العرض');
    expect(html).not.toContain('الفصل الحالي');
    expect(graph.nodes).toHaveLength(presentation.chapters.length + 1);
    expect(graph.edges).toHaveLength(presentation.chapters.length);
    expect(graph.filled).toBe(false);
  });

  it.each(slides.map((s) => [s.slide.id, s] as const))('الشريحة %s بيضاء: عدّاد فقط بلا عنوان ولا محتوى', (_id, item) => {
    const html = renderToStaticMarkup(<SlideScreen item={item} />);
    const text = visibleText(html);
    expect(onlyCounters(text), text).toBe(true);
    expect(text).toContain(`${item.indexInChapter + 1} / ${item.chapter.slides.length}`);
    expect(html).not.toContain('الفصل');
  });

  it('الخاتمة بيضاء: زرا التنقل فقط', () => {
    const html = renderToStaticMarkup(<FinalScreen data={presentation.final} onMap={noop} onRestart={noop} />);
    const text = visibleText(html).replace('العودة إلى الخريطة', '').replace('إعادة من البداية', '').trim();
    expect(text).toBe('');
    expect(html).not.toContain('الخاتمة');
  });

  it('المكوّن الجذري يبدأ بشاشة العنوان وعدّاد شريط التحكم فقط', () => {
    const html = renderToStaticMarkup(<Presentation data={presentation} />);
    expect(html).toContain('شاشة العنوان');
    // لا نصّ خارج شريط التحكم: نحذف شريط التحكم (آخر عنصر ثابت) ونفحص الباقي
    const controls = html.indexOf('pointer-events-none fixed inset-x-0 bottom-0');
    const beforeControls = html.slice(0, html.lastIndexOf('<', controls));
    expect(visibleText(beforeControls)).toBe('');
  });
});

/** عرض معبّأ (بيانات اصطناعية): الشاشات تُظهر نصوصها وشاراتها فور الكتابة فيها. */
const filledChapter: ChapterData = {
  id: 'ch1',
  title: 'الدراسة التمهيدية',
  subtitle: 'ما واقع المؤسسة؟',
  icon: Layers,
  color: 'from-sky-600/20 to-sky-400/10',
  accent: 'text-sky-200 border-sky-400/40',
  slides: [
    { id: 'ch1-preface', chapterId: 'ch1', title: 'تمهيد الفصل', icon: Info, archetype: 'chapter-preface', content: <p>تمهيد</p> },
    { id: 'ch1-a', chapterId: 'ch1', title: 'تعريف المؤسسة', subtitle: 'بطاقة', icon: Info, archetype: 'profile', content: <p>محتوى</p> },
    { id: 'ch1-blank', chapterId: 'ch1', title: '', icon: Info, archetype: 'placeholder', content: null },
    { id: 'ch1-end', chapterId: 'ch1', title: 'خلاصة الفصل', icon: Info, archetype: 'chapter-summary', content: <p>خلاصة</p> },
  ],
};
const filled: PresentationData = {
  meta: {
    organization: ['الجمهورية', 'الجامعة'],
    workType: 'مذكرة تخرج',
    title: 'نظام معلومات للمؤسسة',
    subtitle: 'دراسة حالة',
    authors: [{ role: 'إعداد', names: ['اسم الطالب'] }],
    date: '2026',
  },
  preface: presentation.preface.map((step, i) => ({ ...step, title: `خطوة المقدمة ${i + 1}`, content: <p>محتوى الخطوة</p> })),
  chapters: [filledChapter],
  final: { title: 'خلاصة العرض', summary: ['الأولى', 'الثانية', 'الثالثة'], closing: 'الختام', thanks: 'شكراً', celebrate: false },
};
const filledSlides = flattenSlides(filled.chapters);

describe('العرض المعبّأ: النصوص والشارات تظهر تلقائياً', () => {
  it('شاشة العنوان تعرض بطاقة التعريف كاملة وزر البدء بنصّه الافتراضي', () => {
    const html = renderToStaticMarkup(<TitleScreen meta={filled.meta} onStart={noop} />);
    for (const line of filled.meta.organization) expect(html).toContain(line);
    for (const t of [filled.meta.workType, filled.meta.date, filled.meta.subtitle!, 'اسم الطالب', 'اضغط للبدء', 'Enter']) expect(html).toContain(t);
  });

  it('المقدمة تعرض شارة «المقدمة» وأسماء الخطوات وعنوان الخطوة', () => {
    const html = renderToStaticMarkup(<PrefaceScreen steps={filled.preface} step={1} onGoto={noop} />);
    for (const t of ['المقدمة', 'الإشكالية', 'الأهداف', 'خطوة المقدمة 2', 'الخطوة 2 من 4', 'محتوى الخطوة']) expect(html).toContain(t);
  });

  it('الخريطة المعبّأة تعرض غلافها، ويحمل نموذج العقد الفصول والمحاور القابلة للنقر', () => {
    const props = { chapters: filled.chapters, slides: filledSlides, visited: [], onSelect: noop, currentChapterId: 'ch1' };
    const html = renderToStaticMarkup(<MapScreen {...props} />);
    const graph = createMindMapGraph(props);
    const branch = graph.nodes.find((node) => node.id === 'ch1');
    expect(html).toContain('خريطة العرض');
    expect(html).toContain('aria-label="الخريطة الذهنية لتحليل القرار القضائي"');
    expect(branch?.data.kind).toBe('chapter');
    if (branch?.data.kind === 'chapter') {
      expect(branch.data.title).toBe('الدراسة التمهيدية');
      expect(branch.data.current).toBe(true);
      expect(branch.data.chapter.slides).toHaveLength(4);
    }
    expect(graph.edges[0].target).toBe('ch1');
  });

  it('خريطة القرار تتوزع كفروع ذهنية متوازنة على المكتب والهاتف', () => {
    const legalSlides = flattenSlides(legalPresentation.chapters);
    const props = { chapters: legalPresentation.chapters, slides: legalSlides, visited: [], onSelect: noop };
    const desktop = createMindMapGraph(props);
    const mobile = createMindMapGraph(props, true);
    const branchNodes = desktop.nodes.filter((node) => node.data.kind === 'chapter');
    expect(branchNodes.map((node) => node.data.kind === 'chapter' ? node.data.title : '')).toEqual([
      'التحليل الشكلي', 'الأساس القانوني', 'موقف المحكمة وآثار القرار',
    ]);
    expect(branchNodes[0].position.x).toBeGreaterThan(branchNodes[2].position.x);
    expect(branchNodes[1].position.y).toBeGreaterThan(branchNodes[0].position.y);
    expect(mobile.nodes.filter((node) => node.data.kind === 'chapter').map((node) => node.position.y)).toEqual([150, 370, 590]);
  });

  it('الشريحة تعرض شارة الفصل وعنوانها وعنوانها الفرعي ومحتواها', () => {
    const html = renderToStaticMarkup(<SlideScreen item={filledSlides[1]} />);
    for (const t of ['الفصل 1 — الدراسة التمهيدية', 'تعريف المؤسسة', 'بطاقة', 'محتوى', '2 / 4']) expect(html).toContain(t);
  });

  it('الشريحة البيضاء داخل عرض معبّأ: شارة الفصل بالاسم، بلا صف عنوان', () => {
    const html = renderToStaticMarkup(<SlideScreen item={filledSlides[2]} />);
    expect(html).toContain('الفصل 1 — الدراسة التمهيدية');
    expect(html).not.toContain('<h2');
  });

  it('الخاتمة تعرض شارتها والخلاصة والختام والشكر', () => {
    const html = renderToStaticMarkup(<FinalScreen data={filled.final} onMap={noop} onRestart={noop} />);
    for (const t of ['الخاتمة', 'خلاصة العرض', 'الأولى', 'الثالثة', 'الختام', 'شكراً']) expect(html).toContain(t);
  });

  it('المكوّن الجذري يعرض العنوان الرئيسي', () => {
    const html = renderToStaticMarkup(<Presentation data={filled} />);
    expect(html).toContain('نظام');
  });
});
