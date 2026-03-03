'use client';

import 'swiper/css';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import { CalendarDays, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { Culto } from '@/types/cultos';
import { formatDateForDisplay } from '@/utils/formatoData';
import { generateGoogleFontsURL } from '@/lib/theme-repository';
import { useTheme } from '@/context/ThemeContext';
import SectionHeader from './SectionHeader';

export default function CultosSwiper() {
  const theme = useTheme();
  const { colors, typography, layout, effects } = theme;

  // ── Derivações do tema ─────────────────────────────────────────────────────

  const heroGradient =
    effects.heroStyle === 'gradient'
      ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      : effects.heroStyle === 'image-overlay'
      ? `linear-gradient(135deg, ${colors.primary}dd 0%, ${colors.secondary}99 100%)`
      : colors.primary; // solid

  const btnRadius =
    effects.buttonStyle === 'pill' ? 50
    : effects.buttonStyle === 'rounded' ? layout.borderRadius
    : 2; // square

  const cardShadow =
    effects.cardShadow === 'soft' ? '0 4px 24px rgba(0,0,0,0.08)'
    : effects.cardShadow === 'hard' ? '4px 4px 0 rgba(0,0,0,0.2)'
    : 'none';

  const fontsURL = generateGoogleFontsURL(theme);

  // ── Estado ─────────────────────────────────────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0);
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const fetchCultos = async () => {
      try {
        const res = await fetch('/api/cultos');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCultos(
          data.map((c: any) => ({
            id: c.id,
            titulo: c.titulo,
            diasemana: c.diasemana,
            data: c.data,
            hora: c.hora,
            arte: c.arte,
            corDestaque: c.cordestaque,
            orador: { id: c.orador.id, nome: c.orador.nome, foto: c.orador.foto },
          }))
        );
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCultos();
  }, []);

  // ── Shell (compartilhado entre todos os estados) ───────────────────────────
  const shell: React.CSSProperties = {
    maxWidth: layout.containerWidth,
    margin: '0 auto',
    padding: `${layout.sectionPadding}px 16px`,
    fontFamily: typography.fontBody,
    fontSize: typography.sizeBase,
    lineHeight: typography.lineHeight,
    color: colors.text,
    background: colors.backgroundAlt,
  };

  const feedbackText: React.CSSProperties = {
    textAlign: 'center',
    color: colors.textMuted,
    fontFamily: typography.fontBody,
    fontSize: typography.sizeBase,
    padding: `${layout.sectionPadding}px 0`,
  };

  if (isLoading) {
    return (
      <section style={shell}>
        <link rel="stylesheet" href={fontsURL} />
        <p style={feedbackText}>Carregando cultos...</p>
      </section>
    );
  }

  if (!cultos.length) {
    return (
      <section style={shell}>
        <link rel="stylesheet" href={fontsURL} />
        <p style={feedbackText}>Nenhum culto programado no momento.</p>
      </section>
    );
  }

  // ── Render principal ───────────────────────────────────────────────────────
  return (
    <section>
      <link rel="stylesheet" href={fontsURL} />

      {/* Título da seção */}
      <SectionHeader title='PRÓXIMOS CULTOS'/>

      {/* Wrapper relativo para os botões flutuantes */}
      <div style={{ position: 'relative' }}>
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
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
          style={{ borderRadius: layout.borderRadius, overflow: 'hidden' }}
        >
          {cultos.map((culto) => (
            <SwiperSlide key={culto.id}>
              <div
                style={{
                  background: colors.surface,
                  borderRadius: layout.borderRadius,
                  overflow: 'hidden',
                  boxShadow: cardShadow,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* ── Cabeçalho ── */}
                <div
                  style={{
                    background: heroGradient,
                    padding: `${layout.sectionPadding * 0.4}px ${layout.sectionPadding * 0.6}px`,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: layout.borderRadius,
                  }}
                >
                  {/* Dia + título */}
                  <div>
                    <span
                      style={{
                        fontFamily: typography.fontAccent,
                        fontSize: typography.sizeH2 * 0.6,
                        fontWeight: Number(typography.headingWeight),
                        color: colors.accent,
                        display: 'block',
                        lineHeight: 1,
                      }}
                    >
                      {culto.diasemana}
                    </span>
                    <span
                      style={{
                        fontFamily: typography.fontHeading,
                        fontSize: typography.sizeBase,
                        fontWeight: Number(typography.headingWeight),
                        color: colors.textInverse,
                        opacity: 0.85,
                        marginTop: 4,
                        display: 'block',
                      }}
                    >
                      {culto.titulo}
                    </span>
                  </div>

                  {/* Badges data + hora */}
                  <div style={{ display: 'flex', gap: layout.borderRadius * 0.5, flexWrap: 'wrap' }}>
                    {[
                      { icon: <CalendarDays size={typography.sizeBase * 0.85} />, label: formatDateForDisplay(culto.data) },
                      { icon: <Clock size={typography.sizeBase * 0.85} />, label: culto.hora },
                    ].map(({ icon, label }) => (
                      <div
                        key={label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: `${colors.accent}22`,
                          border: `1px solid ${colors.accent}44`,
                          borderRadius: btnRadius,
                          padding: `6px ${layout.borderRadius}px`,
                          color: colors.textInverse,
                          fontSize: typography.sizeBase * 0.85,
                          fontWeight: 600,
                          fontFamily: typography.fontBody,
                          lineHeight: 1,
                        }}
                      >
                        <span style={{ color: colors.accent }}>{icon}</span>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Imagem ── */}
                <div
                  style={{
                    position: 'relative',
                    height: layout.sectionPadding * 5,
                    background: colors.backgroundAlt,
                  }}
                >
                  <Image
                    src={culto.arte}
                    alt={culto.titulo}
                    fill
                    priority
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                  {/* Overlay de integração com cores do tema */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to top, ${colors.surface}88 0%, transparent 55%)`,
                    }}
                  />
                </div>

                {/* ── Orador ── */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: layout.borderRadius,
                    padding: `${layout.sectionPadding * 0.3}px ${layout.sectionPadding * 0.6}px`,
                    borderTop: `1px solid ${colors.border}`,
                    background: colors.surface,
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: typography.sizeH1 * 0.9,
                      height: typography.sizeH1 * 0.9,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `2px solid ${colors.primary}`,
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <Image
                      src={culto.orador.foto}
                      alt={culto.orador.nome}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div>
                    <p
                      style={{
                        fontSize: typography.sizeBase * 0.7,
                        fontWeight: 600,
                        fontFamily: typography.fontBody,
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: typography.letterSpacing,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        marginBottom: 2,
                      }}
                    >
                      <User size={typography.sizeBase * 0.75} /> Orador
                    </p>
                    <p
                      style={{
                        fontFamily: typography.fontHeading,
                        fontSize: typography.sizeH3 * 0.75,
                        fontWeight: Number(typography.headingWeight),
                        color: colors.text,
                        lineHeight: typography.lineHeight,
                      }}
                    >
                      {culto.orador.nome}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ── Botões de navegação ── */}
        {cultos.length > 1 && (
          <>
            {[
              { ref: prevRef, side: 'left' as const, icon: <ChevronLeft size={typography.sizeBase} />, label: 'Anterior' },
              { ref: nextRef, side: 'right' as const, icon: <ChevronRight size={typography.sizeBase} />, label: 'Próximo' },
            ].map(({ ref, side, icon, label }) => (
              <button
                key={side}
                ref={ref}
                aria-label={label}
                style={{
                  position: 'absolute',
                  top: '42%',
                  [side]: -(layout.borderRadius * 1.2),
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  width: layout.borderRadius * 2.5,
                  height: layout.borderRadius * 2.5,
                  borderRadius: '50%',
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: cardShadow,
                  outline: 'none',
                  padding: 0,
                }}
              >
                {icon}
              </button>
            ))}
          </>
        )}

        {/* ── Dots de paginação ── */}
        {cultos.length > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: layout.borderRadius * 0.4,
              marginTop: layout.borderRadius,
            }}
          >
            {cultos.map((_, i) => (
              <button
                key={i}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === activeIndex ? layout.borderRadius * 1.5 : layout.borderRadius * 0.55,
                  height: layout.borderRadius * 0.55,
                  borderRadius: layout.borderRadius,
                  background: i === activeIndex ? colors.primary : `${colors.primary}44`,
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 300ms ease',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}