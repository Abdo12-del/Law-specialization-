import { CircleCheck, Compass, FileText, Goal, Info, Layers, Lightbulb, MessageCircleQuestion } from 'lucide-react';
import type { ChapterData, PresentationData } from '@/types/presentation';

/** نسخة خام للاختبارات ومَن يريد بدء عرض من الصفر؛ التطبيق الفعلي يستخدم مخطط تحليل القرار. */
const blankChapters: ChapterData[] = ['ch1', 'ch2', 'ch3'].map((id) => ({
  id,
  title: '',
  icon: Layers,
  color: 'from-sky-600/20 to-sky-400/10',
  accent: 'text-sky-200 border-sky-400/40',
  slides: [
    { id: `${id}-preface`, chapterId: id, title: '', icon: Info, archetype: 'chapter-preface', content: null },
    { id: `${id}-slide-1`, chapterId: id, title: '', icon: FileText, archetype: 'placeholder', content: null },
    { id: `${id}-slide-2`, chapterId: id, title: '', icon: FileText, archetype: 'placeholder', content: null },
    { id: `${id}-summary`, chapterId: id, title: '', icon: CircleCheck, archetype: 'chapter-summary', content: null },
  ],
}));

export const blankPresentation: PresentationData = {
  meta: { organization: [], workType: '', title: '', authors: [], date: '', startLabel: '', background: 'stars' },
  preface: [
    { id: 'preface-context', kind: 'context', title: '', icon: Lightbulb, content: null },
    { id: 'preface-problem', kind: 'problem', title: '', icon: MessageCircleQuestion, content: null },
    { id: 'preface-objectives', kind: 'objectives', title: '', icon: Goal, content: null },
    { id: 'preface-scope', kind: 'scope', title: '', icon: Compass, content: null },
  ],
  chapters: blankChapters,
  final: { title: '', summary: [], closing: '', thanks: '', celebrate: false },
};
