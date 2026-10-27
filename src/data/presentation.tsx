import { ClipboardCheck, Gavel, Landmark, Lightbulb, Scale } from 'lucide-react';
import { Card, Stagger } from '@/components/ui';
import { IntroductionFlipCard } from '@/components/IntroductionFlipCard';
import type { PresentationData } from '@/types/presentation';
import { chapters } from './chapters';

/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  هيكل عرض لتحليل قرار قضائي مستخرج من فهرس البحث المرسل.              ║
 * ║  تُحدَّد هنا العناوين والفصول فقط؛ المحتوى التفصيلي مؤجل للباحث.       ║
 * ║  تُملأ content لاحقاً عند تزويد نص كل عنوان والبيانات الدقيقة للقرار. ║
 * ║  نسخة القالب الفارغ محفوظة في data/blank-template.tsx للاختبارات.     ║
 * ║  والوصفة الكاملة في docs/PRESENTATION_TEMPLATE_SPEC.md (§7).         ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * الترتيب: الغلاف ← المقدمة/الإشكالية ← أهمية الموضوع ← مآل القرار ← خارطة العرض ← التحليل الشكلي والموضوعي ← الخاتمة
 */
export const presentation: PresentationData = {
  outlineOnly: true,
  // ── 2.1 شاشة العنوان: بطاقة تعريف العرض (هوية فقط، لا محتوى) ───────────
  meta: {
    // سطور الجهة من الأعم إلى الأخص: ['الدولة / الوزارة', 'الجامعة / المؤسسة', 'الكلية / القسم']
    organization: [],
    // طبيعة العمل: 'مذكرة تخرج' | 'تقرير' | 'دورة تكوينية' | 'عرض منتج'
    workType: 'تحليل قرار قضائي',
    // العنوان كما ورد في تفريغ البحث؛ يُراجع مقابل الصورة الأصلية.
    title: 'اقتران الخطبة بالفاتحة بحضور الشهود — زواج صحيح',
    subtitle: 'تحليل شكلي وموضوعي لقرار المحكمة العليا الجزائرية',
    // المُنجزون: [{ role: 'إعداد', names: ['…'] }, { role: 'إشراف', names: ['…'] }]
    authors: [],
    // التاريخ / الدفعة / السنة الجامعية
    date: '',
    // نص زر البدء — اتركه فارغاً فيبقى الزر أيقونة فقط، أو اكتب مثلاً 'اضغط للبدء'
    startLabel: '',
    // خلفية جسيمات لشاشة العنوان: 'stars' | 'network' | 'snow' | 'bubbles' | 'fireflies' | 'none'
    background: 'stars',
  },

  // ── 2.2 مقدمة العرض: تمهيد ← أهمية ← مآل القرار، ثم خارطة الفصول ──────
  preface: [
    {
      id: 'preface-introduction',
      kind: 'context',
      title: 'مقدمة',
      icon: Lightbulb,
      content: <IntroductionFlipCard />,
    },
    {
      id: 'preface-significance',
      kind: 'significance',
      title: 'أهمية الموضوع',
      icon: Scale,
      content: (
        <Stagger className="mx-auto grid w-full max-w-5xl gap-5 md:grid-cols-3">
          <Card className="flex flex-col gap-5 border-amber-400/20 bg-[#111a2a]/90 p-6 sm:p-7">
            <Scale className="h-7 w-7 text-amber-300" aria-hidden="true" />
            <div>
              <h3 className="text-xl font-bold text-[#fffaf0]">ضبط التكييف القانوني</h3>
              <p className="mt-3 leading-8 text-slate-300">
                يوضح الفرق بين الخطبة بوصفها وعداً بالزواج، واقتران الفاتحة بها في مجلس العقد عند استيفاء الشروط.
              </p>
            </div>
          </Card>
          <Card className="flex flex-col gap-5 border-amber-400/20 bg-[#111a2a]/90 p-6 sm:p-7">
            <Landmark className="h-7 w-7 text-amber-200" aria-hidden="true" />
            <div>
              <h3 className="text-xl font-bold text-[#fffaf0]">ربط الحكم بوقائعه</h3>
              <p className="mt-3 leading-8 text-slate-300">
                يبرز أثر ظروف مجلس العقد، ومنها حضور الولي والشهود وتحديد الصداق، في تقدير الوصف القانوني.
              </p>
            </div>
          </Card>
          <Card className="flex flex-col gap-5 border-amber-400/20 bg-[#111a2a]/90 p-6 sm:p-7">
            <ClipboardCheck className="h-7 w-7 text-rose-200" aria-hidden="true" />
            <div>
              <h3 className="text-xl font-bold text-[#fffaf0]">سلامة تطبيق القانون</h3>
              <p className="mt-3 leading-8 text-slate-300">
                يكشف كيف يؤثر التكييف القانوني للوقائع في مراجعة سلامة تطبيق القواعد القانونية.
              </p>
            </div>
          </Card>
        </Stagger>
      ),
    },
    {
      id: 'preface-decision-outcome',
      kind: 'decision',
      title: 'مآل القرار',
      icon: Gavel,
      notes: 'صياغة مؤقتة بحسب التفريغ المنقول: نُقض القرار المطعون فيه وأُحيلت القضية إلى المجلس القضائي نفسه بتشكيلة أخرى، من دون فصل نهائي في أصل النزاع. طابق المنطوق مع صورة القرار قبل اعتمادها.',
      content: (
        <Stagger className="mx-auto flex w-full max-w-4xl flex-col gap-5">
          <Card className="relative overflow-hidden border-amber-400/30 bg-gradient-to-br from-[#1b2a40] to-[#101827] p-7 sm:p-10">
            <div className="absolute inset-y-0 start-0 w-1 bg-amber-400" aria-hidden="true" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-amber-400/35 bg-amber-400/10 text-amber-300">
                <Gavel className="h-8 w-8" aria-hidden="true" />
              </span>
              <div>
                <div className="text-sm font-bold tracking-wide text-amber-300">بحسب ما يورده البحث</div>
                <h3 className="mt-2 text-2xl font-extrabold leading-relaxed text-[#fffaf0] sm:text-3xl">
                  نقض القرار المطعون فيه والإحالة
                </h3>
                <p className="mt-3 text-base leading-8 text-slate-300">
                  إلى المجلس القضائي نفسه بتشكيلة أخرى، دون فصل نهائي في أصل النزاع.
                </p>
              </div>
            </div>
          </Card>
          <p className="text-center text-sm leading-7 text-slate-400">
            تمهيدٌ للانتقال من عرض مآل الدعوى إلى تحليل القرار وأساسه القانوني.
          </p>
        </Stagger>
      ),
    },
  ],

  // ── 3. الفصول: 3–5 فصول في chapters/ (كل فصل ملف) ───────────────────────
  chapters,

  // ── 2.5 الخاتمة النهائية: تلخّص فقط — لا معلومات جديدة ─────────────────
  final: {
    title: 'الخاتمة',
    // 3–4 جمل: جملة لكل فصل (ما شخّصه / صمّمه / اقترحه)
    summary: [],
    // نتيجة أو دعوة تأمل في جملة واحدة تُغلق بها العرض
    closing: '',
    // 'شكراً لحسن إصغائكم — أسئلتكم مرحّب بها'
    thanks: '',
    notes: 'تحقق قبل اعتماد العرض: نفي العبارة المنسوبة إلى قضاة الموضوع؛ رقم/تاريخ قرار المحكمة العليا؛ بيانات الأطراف والمحاكم؛ وجه الطعن الثاني؛ تتمة الاستناد إلى المواد 05 و06 و09. البحث المنقول يقرر أن المحكمة العليا نقضت وأحالت القضية، ولم تفصل نهائياً في أصل النزاع. «ملاحظات للمراجعة» صفحة تحريرية في التفريغ لا شريحة عرض.',
    // قصاصات احتفالية عند الوصول للخاتمة: true (= 'cannons') | 'burst' | 'stars' | 'fireworks' | 'rain' | false للعروض الرسمية
    celebrate: false,
  },
};
