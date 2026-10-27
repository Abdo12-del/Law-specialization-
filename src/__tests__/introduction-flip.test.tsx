// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { IntroductionFlipCard } from '@/components/IntroductionFlipCard';

describe('بطاقة مقدمة الدراسة', () => {
  it('تعرض تمهيداً تقريرياً أولاً، وتقلب لإظهار السؤال القانوني ثم تعود', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    act(() => root.render(<IntroductionFlipCard />));
    const button = container.querySelector('button');
    expect(button).not.toBeNull();
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(button?.children[0]?.textContent).toContain('التفرقة بين الخطبة والزواج');
    expect(button?.children[0]?.textContent).not.toContain('؟');

    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(button?.getAttribute('aria-pressed')).toBe('true');
    expect(button?.getAttribute('aria-label')).toBe('العودة إلى مقدمة الموضوع');
    expect(button?.children[1]?.textContent).toContain('هل يُعدّ اقتران الخطبة بالفاتحة');

    act(() => button?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
    expect(button?.getAttribute('aria-pressed')).toBe('false');

    act(() => root.unmount());
    container.remove();
  });
});
