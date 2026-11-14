import { memo, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

/* أيقونات Lucide (رخصة ISC) — المفتاح هو قيمة الخيار في twilight.json. */
const ICONS: Record<string, string> = {
  school:
    '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10"/><path d="M18 5v17"/><path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>',
  'heart-handshake':
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/>',
  trophy:
    '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  award:
    '<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  'clipboard-check':
    '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  'book-open':
    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'file-text':
    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  'graduation-cap':
    '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  calendar:
    '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  'shield-check':
    '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  presentation:
    '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
};

type Option = string | { value?: unknown; key?: unknown; url?: unknown } | null | undefined;

interface CategoryItem {
  name?: string;
  desc?: string;
  icon?: Option | Option[];
  image?: string;
  badge?: string;
  count?: string;
  link?: unknown;
  url?: unknown;
}

export interface MotqanCategoriesProps {
  data: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    cta?: string;
    categories?: CategoryItem[];
    theme?: Option | Option[];
    use_custom_colors?: boolean;
    glow_color?: string;
    accent_color?: string;
    card_from?: string;
    card_to?: string;
    title_color?: string;
    bg_color?: string;
    glow_strength?: number;
    border_radius?: number;
    columns_desktop?: number;
    columns_tablet?: number;
    columns_mobile?: number;
    mobile_layout?: Option | Option[];
    padding_top?: number;
    padding_bottom?: number;
    motion?: Option | Option[];
    tilt?: boolean;
    position?: number;
    [key: string]: unknown;
  };
}

/** قيمة خيار القائمة المنسدلة/الراديو: سلسلة نصية، أو `{value}`، أو مصفوفة منهما. */
export const optionValue = (v: unknown): string => {
  if (Array.isArray(v)) return optionValue(v[0]);
  if (v && typeof v === 'object') {
    const o = v as { value?: unknown; key?: unknown };
    return optionValue(o.value ?? o.key);
  }
  return v === null || v === undefined ? '' : String(v);
};

/** رابط حقل `variable-list`: سلسلة جاهزة، أو كائن يحمل `url`/`value`. */
export const linkUrl = (v: unknown): string => {
  if (Array.isArray(v)) return linkUrl(v[0]);
  if (v && typeof v === 'object') {
    const o = v as { url?: unknown; value?: unknown };
    return linkUrl(o.url ?? o.value);
  }
  return typeof v === 'string' ? v : '';
};

const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => {
  const s = optionValue(v) as T;
  return allowed.includes(s) ? s : fallback;
};

const num = (v: unknown, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && v !== '' && v !== null ? n : fallback;
};

const THEMES = ['petrol', 'brand', 'night', 'cream'] as const;
const MOTIONS = ['full', 'soft', 'none'] as const;
const MOBILE = ['scroll', 'grid'] as const;

function Icon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      // eslint-disable-next-line react/no-danger -- ثابت من القائمة أعلاه، لا مدخلات مستخدم.
      dangerouslySetInnerHTML={{ __html: ICONS[name] ?? ICONS['file-text'] }}
    />
  );
}

function onCardMove(e: PointerEvent<HTMLDivElement>, tilt: boolean) {
  if (e.pointerType !== 'mouse') return;
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
  card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
  if (tilt) {
    card.style.setProperty('--rx', `${((0.5 - y) * 12).toFixed(2)}deg`);
    card.style.setProperty('--ry', `${((x - 0.5) * 14).toFixed(2)}deg`);
  }
}

function onCardLeave(e: PointerEvent<HTMLDivElement>) {
  e.currentTarget.style.removeProperty('--rx');
  e.currentTarget.style.removeProperty('--ry');
}

/**
 * `motqan-categories` — شبكة أقسام متوهجة: ظهور متتابع، هالة وإطار دوّار عند
 * التمرير، إمالة ثلاثية الأبعاد، وعلى الجوال تتوهج البطاقة التي في منتصف الشاشة.
 */
export const MotqanCategories = memo(function MotqanCategories({ data }: MotqanCategoriesProps) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<ReadonlySet<number>>(() => new Set());
  const [reduced, setReduced] = useState(false);

  const categories = (data.categories ?? []).filter((c) => c?.name);
  const theme = pick(data.theme, THEMES, 'petrol');
  const motionSetting = pick(data.motion, MOTIONS, 'full');
  const motion = reduced ? 'none' : motionSetting;
  const mobile = pick(data.mobile_layout, MOBILE, 'scroll');
  const tilt = data.tilt !== false && motion === 'full';
  const cta = data.cta || t('blocks.home.motqan_categories.cta', 'تصفّح القسم');

  useEffect(() => {
    const q = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(!!q?.matches);
    sync();
    q?.addEventListener?.('change', sync);
    return () => q?.removeEventListener?.('change', sync);
  }, []);

  // ظهور متتابع عند وصول الزائر للقسم.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // اللمس: البطاقة الظاهرة بالكامل تتوهج (لا يوجد ماوس).
  useEffect(() => {
    const grid = gridRef.current;
    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    if (!grid || fine || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        setActive((prev) => {
          const next = new Set(prev);
          entries.forEach((en) => {
            const i = Number((en.target as HTMLElement).dataset.index);
            if (en.intersectionRatio > 0.85) next.add(i);
            else next.delete(i);
          });
          return next;
        });
      },
      { root: mobile === 'scroll' ? grid : null, threshold: [0, 0.85, 1] }
    );
    grid.querySelectorAll('.mq-cats__item').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [mobile, categories.length]);

  if (!categories.length) return null;

  const style: Record<string, string | number> = {
    '--mq-cols': num(data.columns_desktop, 5),
    '--mq-cols-tab': num(data.columns_tablet, 3),
    '--mq-cols-mob': num(data.columns_mobile, 2),
    '--mq-radius': `${num(data.border_radius, 22)}px`,
    '--mq-glow-strength': num(data.glow_strength, 85) / 100,
    '--mq-pt': `${num(data.padding_top, 56)}px`,
    '--mq-pb': `${num(data.padding_bottom, 64)}px`,
  };
  if (data.use_custom_colors) {
    const custom: [string, unknown][] = [
      ['--mq-glow', data.glow_color],
      ['--mq-accent', data.accent_color],
      ['--mq-card-from', data.card_from],
      ['--mq-card-to', data.card_to],
      ['--mq-title', data.title_color],
      ['--mq-section-bg', data.bg_color],
    ];
    custom.forEach(([k, v]) => {
      if (typeof v === 'string' && v) style[k] = v;
    });
  }

  const hasHead = Boolean(data.eyebrow || data.title || data.subtitle);

  return (
    <section
      ref={rootRef}
      className="mq-cats"
      data-theme={theme}
      data-motion={motion}
      data-mobile={mobile}
      aria-label={data.title || t('blocks.home.motqan_categories.label', 'أقسام المتجر')}
      style={style as CSSProperties}
    >
      {hasHead && (
        <header className={`mq-cats__head${inView ? ' is-in' : ''}`}>
          {data.eyebrow && <span className="mq-cats__eyebrow">{data.eyebrow}</span>}
          {data.title && <h2 className="mq-cats__title">{data.title}</h2>}
          <span className="mq-cats__ornament" aria-hidden="true">
            <i />
            <b />
            <i />
          </span>
          {data.subtitle && <p className="mq-cats__sub">{data.subtitle}</p>}
        </header>
      )}
      <div ref={gridRef} className="mq-cats__grid">
        {categories.map((c, i) => {
          const url = linkUrl(c.link ?? c.url) || '#';
          return (
            <div
              // قائمة إعدادات ثابتة بلا معرّف.
              // react-doctor-disable-next-line react-doctor/no-array-index-as-key
              key={i}
              data-index={i}
              className={`mq-cats__item${inView ? ' is-in' : ''}${active.has(i) ? ' is-active' : ''}`}
              style={{ '--i': i } as CSSProperties}
              // على الغلاف لا على Link: المتغيرات تُورَّث للبطاقة.
              onPointerMove={(e: PointerEvent<HTMLDivElement>) => onCardMove(e, tilt)}
              onPointerLeave={onCardLeave}
            >
              <Link
                to={url}
                className="mq-cats__card"
                aria-label={c.name}
              >
                <span className="mq-cats__bg" aria-hidden="true">
                  <span className="mq-cats__aurora" />
                  <span className="mq-cats__dots" />
                  <span className="mq-cats__ring" />
                  <span className="mq-cats__spot" />
                  <span className="mq-cats__shine" />
                </span>
                {c.badge && <span className="mq-cats__badge">{c.badge}</span>}
                <span className="mq-cats__icon">
                  {c.image ? (
                    <img src={c.image} alt="" loading="lazy" decoding="async" width="64" height="64" />
                  ) : (
                    <Icon name={optionValue(c.icon)} />
                  )}
                </span>
                <h3 className="mq-cats__name">{c.name}</h3>
                {c.desc && <p className="mq-cats__desc">{c.desc}</p>}
                {c.count && <span className="mq-cats__count">{c.count}</span>}
                <span className="mq-cats__foot">
                  <span className="mq-cats__line" />
                  <span className="mq-cats__cta">
                    {cta}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m12 19-7-7 7-7" />
                      <path d="M19 12H5" />
                    </svg>
                  </span>
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
});
