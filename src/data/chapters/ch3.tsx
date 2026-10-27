import { Gavel, Lightbulb } from 'lucide-react';
import type { ChapterData } from '@/types/presentation';

/** عناوين مبحث موقف المحكمة العليا والقاعدة وأهمية القرار كما في الفهرس. */
export const ch3: ChapterData = {
  id: 'ch3',
  title: 'موقف المحكمة العليا من النزاع وآثار القرار',
  subtitle: 'مناقشة الموقف والتعليل والقاعدة المستخلصة وأهمية القرار',
  icon: Gavel,
  color: 'from-[#342c20] to-[#111a2a]',
  accent: 'text-amber-300 border-amber-400/40',
  slides: [
    { id: 'ch3-court-reasoning', chapterId: 'ch3', title: 'مناقشة موقف المحكمة العليا وتعليل قرارها', subtitle: 'يُعرض بوصفه نقضاً وإحالة وفق التفريغ؛ منطوق القرار الأصلي غير متاح للتحقق', icon: Gavel, archetype: 'bullets', content: null },
    { id: 'ch3-rule-significance', chapterId: 'ch3', title: 'القاعدة القانونية المستخلصة من القرار وأهمية القرار', icon: Lightbulb, archetype: 'bullets', content: null },
  ],
};
