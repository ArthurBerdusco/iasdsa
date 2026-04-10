'use client';

import 'swiper/css';
import 'swiper/css/effect-fade';

import Image from 'next/image';
import { CalendarDays, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { Culto } from '@/types/cultos';
import { formatDateForDisplay } from '@/utils/formatoData';
import SectionHeader from './SectionHeader';

type Props = {
  cultos: Culto[];
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Badge = { icon: React.ReactNode; label: string };

// ─── Sub-components ───────────────────────────────────────────────────────────

function CultoBadge({ icon, label }: Badge) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text)] backdrop-blur-sm">
      <span style={{ color: 'var(--color-accent)' }}>{icon}</span>
      {label}
    </span>
  );
}

function OradorFooter({ orador }: { orador: Culto['orador'] }) {
  return (
    <div className="flex items-center gap-3 border-t border-[var(--color-border)] bg-[var(--color-background-alt)] px-5 py-3">
      <div className="relative size-15 shrink-0 overflow-hidden rounded-full"
        style={{ outline: '2px solid var(--color-accent)' }}>
        <Image unoptimized src={orador.foto} alt={orador.nome} fill className="object-cover" />
      </div>
      <div>
        <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--color-accent)' }}>
          <User size={10} /> Orador
        </p>
        <p className="text-sm font-semibold text-[var(--color-text)]">{orador.nome}</p>
      </div>
    </div>
  );
}

function NavButton({
  side,
  btnRef,
  label,
}: {
  side: 'left' | 'right';
  btnRef: React.RefObject<HTMLButtonElement | null>;
  label: string;
}) {
  const posClass = side === 'left' ? '-left-4 sm:-left-5' : '-right-4 sm:-right-5';
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
 
    <button
      ref={btnRef}
      aria-label={label}
      className={`absolute top-[42%] z-10 ${posClass} -translate-y-1/2 flex size-8 sm:size-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] backdrop-blur-sm transition hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverse)]`}
    >
      <Icon size={16} />
      </button>
    
  );
}

function PaginationDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  if (count <= 1) return null;
  return (
    <div className="mt-4 flex justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          aria-label={`Slide ${i + 1}`}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === active ? '1.5rem' : '0.375rem',
            backgroundColor: i === active ? 'var(--color-accent)' : 'var(--color-border)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Slide Card ───────────────────────────────────────────────────────────────

function CultoCard({ culto }: { culto: Culto }) {
  const badges: Badge[] = [
    { icon: <CalendarDays size={12} />, label: formatDateForDisplay(culto.data) },
    { icon: <Clock size={12} />, label: culto.hora },
  ];

  return (
    <div className="overflow-hidden rounded-[var(--border-radius)] border border-[var(--color-border)] ">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--color-background-alt)] px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--color-accent)' }}>
            {culto.diasemana}
          </p>
          <h3 className="text-base font-bold text-[var(--color-text)] sm:text-lg">
            {culto.titulo}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <CultoBadge key={b.label} {...b} />
          ))}
        </div>
      </div>

      {/* Art Image */}
      <div className="relative aspect-video w-full bg-[var(--color-background)]">
        <Image  
          src={culto.arte}
          alt={culto.titulo}
          fill
          priority
          unoptimized
          className="object-contain object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-surface)] to-transparent" />
      </div>

      {/* Footer */}
      <OradorFooter orador={culto.orador} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CultosSwiper = ({ cultos }: Props) => {
  
  const [activeIndex, setActiveIndex] = useState(0);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const hasMany = cultos.length > 1;

  return (
    <section className='mx-auto max-w-6xl px-4 py-12'>
      <SectionHeader title="PRÓXIMOS CULTOS" />

      <div className="relative h-fit">
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          slidesPerView={1}
          loop
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={600}
          autoplay={{ delay: 8000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
            const nav = swiper.params.navigation;
            if (nav && typeof nav !== 'boolean') {
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
            }
          }}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
        >
          {cultos.map((culto) => (
            <SwiperSlide key={culto.id}>
              <CultoCard culto={culto} />
            </SwiperSlide>
          ))}
        </Swiper>

        {hasMany && (
          <>
            <NavButton side="left" btnRef={prevRef} label="Anterior" />
            <NavButton side="right" btnRef={nextRef} label="Próximo" />
          </>
        )}
      </div>

      {hasMany && (
        <PaginationDots
          count={cultos.length}
          active={activeIndex}
          onSelect={(i) => swiperRef.current?.slideToLoop(i)}
        />
      )}
    </section>
  );
}

export default CultosSwiper