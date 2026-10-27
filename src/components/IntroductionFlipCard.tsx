import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Scale } from 'lucide-react';

/** بطاقة المقدمة: تنقلب تفاعلياً لكشف الإشكالية القانونية. */
export function IntroductionFlipCard() {
  const [showIssue, setShowIssue] = useState(false);

  return (
    <div className="flex h-full min-h-[380px] w-full items-center justify-center px-3 py-5 sm:px-6" style={{ perspective: '1200px' }}>
      <motion.button
        type="button"
        aria-pressed={showIssue}
        aria-label={showIssue ? 'العودة إلى مقدمة الموضوع' : 'اعرض إشكالية الموضوع'}
        onClick={() => setShowIssue((value) => !value)}
        className="relative min-h-[390px] w-full max-w-3xl rounded-[2rem] text-right shadow-2xl shadow-slate-950/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 sm:min-h-[430px]"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: showIssue ? 180 : 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[2rem] border border-amber-400/35 bg-gradient-to-br from-[#10243d] via-[#0b1b30] to-[#071426] p-7 sm:p-10"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="flex items-center gap-3 text-amber-200">
            <Scale className="h-6 w-6" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wide">مدخل إلى الموضوع</span>
          </span>
          <span className="my-7 block">
            <span className="mb-4 block text-sm font-semibold text-slate-300">الإطار القانوني</span>
            <span className="block text-3xl font-extrabold leading-relaxed text-[#fffaf0] sm:text-4xl">
              التفرقة بين الخطبة والزواج
            </span>
            <span className="mt-5 block max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              تُعدّ هذه التفرقة من المسائل المهمة في قانون الأسرة، ولا سيما عند اقتران الخطبة بقراءة الفاتحة في مجلس العقد بحضور الولي والشهود مع تحديد الصداق. فالخطبة وعدٌ بالزواج، بينما يُعدّ اقتران الفاتحة بها في مجلس العقد زواجاً عند تحقق الرضا واستيفاء الشروط القانونية.
            </span>
            <span className="mt-4 block text-xs leading-6 text-slate-400">
              قانون الأسرة الجزائري، المادتان 5 و6 المعدّلتان بالأمر 05-02؛ وشروط الزواج وفق المادة 9 مكرر.
            </span>
          </span>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100">
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            اضغط لعرض الإشكالية
          </span>
        </span>

        <span
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[2rem] border border-amber-300/45 bg-gradient-to-br from-[#16263a] via-[#111827] to-[#241b2a] p-7 sm:p-10"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="flex items-center gap-3 text-amber-200">
            <Scale className="h-6 w-6" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wide">الإشكالية القانونية</span>
          </span>
          <span className="my-7 block text-2xl font-bold leading-[1.9] text-[#fffaf0] sm:text-3xl">
            هل يُعدّ اقتران الخطبة بالفاتحة في مجلس العقد زواجاً صحيحاً متى توافرت أركانه القانونية، أم يُعدّ مجرد خطبة ووعد بالزواج؟
          </span>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100">
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            اضغط للعودة إلى المقدمة
          </span>
        </span>
      </motion.button>
    </div>
  );
}
