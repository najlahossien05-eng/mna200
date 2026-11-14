import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import {
  MotqanCategories,
  linkUrl,
  optionValue,
} from '../../../app/components/home/MotqanCategories';

vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({
    to,
    children,
    className,
    'aria-label': ariaLabel,
  }: {
    to: string;
    children?: React.ReactNode;
    className?: string;
    'aria-label'?: string;
  }) => (
    <a href={to} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ t: (_k: string, fb?: string) => fb ?? _k }),
}));

const categories = [
  { name: 'الإدارة المدرسية', desc: 'سجلات', icon: [{ value: 'school' }], badge: 'جديد', link: '/a' },
  { name: 'التوجيه الطلابي', icon: 'users', link: { url: '/b' } },
  { name: '', link: '/hidden' },
];

describe('MotqanCategories', () => {
  it('renders one card per named category with its link', () => {
    const { container } = render(<MotqanCategories data={{ categories }} />);
    const cards = container.querySelectorAll<HTMLAnchorElement>('.mq-cats__card');
    expect(cards).toHaveLength(2);
    expect(cards[0].getAttribute('href')).toBe('/a');
    expect(cards[1].getAttribute('href')).toBe('/b');
    expect(container.querySelector('.mq-cats__badge')?.textContent).toBe('جديد');
  });

  it('renders nothing without categories', () => {
    const { container } = render(<MotqanCategories data={{ categories: [] }} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies theme, layout and custom colours from the settings', () => {
    const { container } = render(
      <MotqanCategories
        data={{
          categories,
          title: 'العنوان',
          theme: [{ value: 'night' }],
          mobile_layout: 'grid',
          columns_desktop: 4,
          use_custom_colors: true,
          glow_color: '#ff0000',
        }}
      />
    );
    const root = container.querySelector<HTMLElement>('.mq-cats')!;
    expect(root.dataset.theme).toBe('night');
    expect(root.dataset.mobile).toBe('grid');
    expect(root.style.getPropertyValue('--mq-cols')).toBe('4');
    expect(root.style.getPropertyValue('--mq-glow')).toBe('#ff0000');
    expect(container.querySelector('.mq-cats__title')?.textContent).toBe('العنوان');
  });

  it('ignores custom colours while the switch is off and falls back to the default CTA', () => {
    const { container } = render(
      <MotqanCategories data={{ categories, glow_color: '#ff0000', theme: 'bogus' }} />
    );
    const root = container.querySelector<HTMLElement>('.mq-cats')!;
    expect(root.dataset.theme).toBe('petrol');
    expect(root.style.getPropertyValue('--mq-glow')).toBe('');
    expect(container.querySelector('.mq-cats__cta')?.textContent).toContain('تصفّح القسم');
  });
});

describe('helpers', () => {
  it('reads option and link values in their stored shapes', () => {
    expect(optionValue([{ value: 'trophy' }])).toBe('trophy');
    expect(optionValue('award')).toBe('award');
    expect(linkUrl({ url: '/x' })).toBe('/x');
    expect(linkUrl(null)).toBe('');
  });
});
