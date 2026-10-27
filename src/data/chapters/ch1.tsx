import { FileText, MessagesSquare, Scale, Users } from 'lucide-react';
import type { ChapterData } from '@/types/presentation';

/** عناوين التحليل الشكلي كما في فهرس البحث؛ المحتوى التفصيلي مؤجل. */
export const ch1: ChapterData = {
  id: 'ch1',
  title: 'أولاً: التحليل الشكلي للقرار',
  subtitle: 'موضوع القرار والخصومة وإجراءاتها والإشكال القانوني',
  icon: Scale,
  color: 'from-[#24344b] to-[#111a2a]',
  accent: 'text-amber-200 border-amber-400/40',
  slides: [
    { id: 'ch1-subject', chapterId: 'ch1', title: 'موضوع القرار وأطراف النزاع والوقائع', subtitle: 'قرار بشأن اقتران الخطبة بالفاتحة؛ بيانات الأطراف والوقائع التفصيلية للمراجعة', icon: Users, archetype: 'bullets', content: null },
    { id: 'ch1-claims', chapterId: 'ch1', title: 'ادعاءات الأطراف', subtitle: 'ادعاءات الطاعنة والمطعون ضده', icon: MessagesSquare, archetype: 'comparison', content: null },
    { id: 'ch1-procedure', chapterId: 'ch1', title: 'إجراءات الدعوى', subtitle: 'مسار القضية أمام الجهات القضائية', icon: FileText, archetype: 'timeline', content: null },
    { id: 'ch1-issue-solution', chapterId: 'ch1', title: 'الإشكال القانوني والحل القانوني', subtitle: 'هل يعد الاقتران في مجلس العقد زواجاً عند توافر الأركان أم مجرد وعد؟ — الصياغة النهائية للمراجعة', icon: Scale, archetype: 'comparison', content: null },
  ],
};
