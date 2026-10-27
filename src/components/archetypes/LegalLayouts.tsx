import type { ReactNode } from 'react';
import { ArrowLeft, BookOpen, FileText, Landmark, Scale } from 'lucide-react';

export interface LegalReference {
  author?: string;
  title: string;
  publisher?: string;
  year?: string;
  locator?: string;
  type?: 'legislation' | 'case' | 'book' | 'article' | 'other';
}

/** بطاقة قضية: الوقائع، المسألة، القاعدة، والحكم في بنية واضحة قابلة للمسح البصري. */
export function LegalCaseCard({
  citation,
  court,
  date,
  facts,
  issue,
  rule,
  holding,
}: {
  citation: string;
  court?: string;
  date?: string;
  facts: ReactNode;
  issue: ReactNode;
  rule: ReactNode;
  holding: ReactNode;
}) {
  return (
    <section className="law-case" aria-label="تحليل قضية">
      <header className="law-case__head">
        <span className="law-kicker"><Landmark aria-hidden="true" /> دراسة قضائية</span>
        <h3>{citation}</h3>
        {(court || date) && <p>{[court, date].filter(Boolean).join(' · ')}</p>}
      </header>
      <div className="law-case__grid">
        <LawCell label="الوقائع">{facts}</LawCell>
        <LawCell label="المسألة القانونية">{issue}</LawCell>
        <LawCell label="القاعدة" emphasized>{rule}</LawCell>
        <LawCell label="المنطوق / المبدأ" emphasized>{holding}</LawCell>
      </div>
    </section>
  );
}

/** اقتباس تشريعي أو قضائي مع إحالة ظاهرة، من دون محاكاة ورقة مخطوطة. */
export function StatuteQuote({
  children,
  source,
  article,
  note,
}: {
  children: ReactNode;
  source: string;
  article?: string;
  note?: string;
}) {
  return (
    <figure className="law-quote" dir="rtl">
      <div className="law-quote__mark" aria-hidden="true">«</div>
      <blockquote>{children}</blockquote>
      <figcaption>
        <FileText aria-hidden="true" />
        <span>{source}{article ? ` — ${article}` : ''}</span>
      </figcaption>
      {note && <p className="law-quote__note">{note}</p>}
    </figure>
  );
}

/** مخطط IRAC مختصر: يفصل السؤال عن القاعدة والتطبيق والنتيجة. */
export function IssueRuleAnalysis({
  issue,
  rule,
  application,
  conclusion,
}: {
  issue: ReactNode;
  rule: ReactNode;
  application: ReactNode;
  conclusion: ReactNode;
}) {
  const steps = [
    ['01', 'المسألة', issue],
    ['02', 'القاعدة', rule],
    ['03', 'التطبيق', application],
    ['04', 'النتيجة', conclusion],
  ] as const;
  return (
    <ol className="law-irac" aria-label="تحليل قانوني">
      {steps.map(([number, label, content], index) => (
        <li className="law-irac__step" key={label}>
          <span className="law-irac__number">{number}</span>
          <div><h3>{label}</h3><div>{content}</div></div>
          {index < steps.length - 1 && <ArrowLeft className="law-irac__arrow" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

/** قائمة مراجع عربية/لاتينية بسيطة؛ الحقول اختيارية وتدعم اختلاف أنماط التوثيق. */
export function LegalReferences({
  items,
  title = 'المراجع والمصادر',
}: {
  items: LegalReference[];
  title?: string;
}) {
  const icons = { legislation: FileText, case: Landmark, book: BookOpen, article: BookOpen, other: Scale };
  return (
    <section className="law-references" aria-label={title}>
      <h3>{title}</h3>
      <ol>
        {items.map((item, index) => {
          const Icon = icons[item.type ?? 'other'];
          return (
            <li key={`${item.title}-${index}`}>
              <span className="law-references__index">{String(index + 1).padStart(2, '0')}</span>
              <Icon aria-hidden="true" />
              <p>
                {item.author && <strong>{item.author}، </strong>}
                <cite>{item.title}</cite>
                {[item.publisher, item.year, item.locator].filter(Boolean).length > 0 && (
                  <span>، {[item.publisher, item.year, item.locator].filter(Boolean).join('، ')}</span>
                )}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function LawCell({ label, children, emphasized = false }: { label: string; children: ReactNode; emphasized?: boolean }) {
  return <div className={`law-case__cell${emphasized ? ' law-case__cell--emphasis' : ''}`}>
    <h4>{label}</h4><div>{children}</div>
  </div>;
}
