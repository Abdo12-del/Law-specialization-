import { BookOpen, FileText, Scale, ShieldCheck } from 'lucide-react';
import type { ChapterData } from '@/types/presentation';

/** عناوين التحليل الموضوعي ومبحث الأساس القانوني كما في فهرس البحث. */
export const ch2: ChapterData = {
  id: 'ch2',
  title: 'ثانياً: التحليل الموضوعي — الأساس القانوني',
  subtitle: 'التمييز بين الخطبة والزواج وشروط اعتبار الاقتران زواجاً صحيحاً',
  icon: BookOpen,
  color: 'from-[#35232f] to-[#111a2a]',
  accent: 'text-rose-200 border-rose-300/35',
  slides: [
    { id: 'ch2-plan', chapterId: 'ch2', title: 'مقدمة وخطة التحليل', subtitle: 'خطة التحليل الموضوعي الواردة في البحث', icon: FileText, archetype: 'bullets', content: null },
    { id: 'ch2-engagement-marriage', chapterId: 'ch2', title: 'التمييز بين الخطبة والزواج', icon: Scale, archetype: 'comparison', content: null },
    { id: 'ch2-validity-conditions', chapterId: 'ch2', title: 'شروط اعتبار اقتران الخطبة بالفاتحة بمجلس العقد زواجاً صحيحاً', subtitle: 'الأركان والشروط كما يسردها البحث؛ إحالات المواد تحتاج مطابقة الأصل', icon: ShieldCheck, archetype: 'bullets', content: null },
  ],
};
