'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import Image from 'next/image';
import { CalendarDays, Clock, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import SectionHeader from './SectionHeader';
import { Culto } from '@/types/cultos';
import { formatDateForDisplay } from '@/utils/formatoData';
import { generateGoogleFontsURL } from '@/lib/theme-repository';


import { useTheme } from "@/context/ThemeContext";


export default function CultosSwiper() {

  const theme = useTheme();                          // ← adicione esta linha
  const { colors, typography, layout, effects } = theme;  // ← e esta

  // ── Derivações do tema (mesmo padrão do ThemePreview) ──────────────────────

  const heroGradient =
    effects.heroStyle === 'gradient'
      ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      : effects.heroStyle === 'image-overlay'
        ? `linear-gradient(135deg, ${colors.primary}dd 0%, ${colors.secondary}99 100%)`
        : colors.primary;

  const btnRadius =
    effects.buttonStyle === 'pill'
      ? 50
      : effects.buttonStyle === 'rounded'
        ? layout.borderRadius
        : 2;

  const cardShadow =
    effects.cardShadow === 'soft'
      ? '0 4px 24px rgba(0,0,0,0.08)'
      : effects.cardShadow === 'hard'
        ? '4px 4px 0 rgba(0,0,0,0.2)'
        : 'none';

  const headerBg =
    layout.headerStyle === 'transparent'
      ? 'transparent'
      : layout.headerStyle === 'white'
        ? '#fff'
        : colors.primary;

  const headerColor =
    layout.headerStyle === 'white' ? colors.text : colors.textInverse;

  const fontsURL = generateGoogleFontsURL(theme);

  // ── Estado ─────────────────────────────────────────────────────────────────

  const [currentDate, setCurrentDate] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [cultos, setCultos] = useState<Culto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchCultos = async () => {
      try {
        const response = await fetch('/api/cultos');
        if (!response.ok) throw new Error('Failed to fetch cultos');
        const data = await response.json();
        const formattedCultos = data.map((culto: any) => ({
          id: culto.id,
          titulo: culto.titulo,
          diasemana: culto.diasemana,
          data: culto.data,
          hora: culto.hora,
          arte: culto.arte,
          corDestaque: culto.cordestaque,
          orador: { id: culto.orador.id, nome: culto.orador.nome, foto: culto.orador.foto },
        }));
        setCultos(formattedCultos);
      } catch (error) {
        console.error('Error fetching cultos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCultos();
  }, []);

  useEffect(() => {
    const today = new Date();
    setCurrentDate(
      today.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  // ── Estados de loading / vazio ─────────────────────────────────────────────

  const shellStyle: React.CSSProperties = {
    position: 'relative',
    maxWidth: 1152,
    margin: '0 auto',
    padding: '24px 16px',
    background: colors.background,
    fontFamily: typography.fontBody,
    color: colors.text,
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: typography.fontHeading,
    fontSize: typography.sizeH1 * 0.6,
    fontWeight: Number(typography.headingWeight),
    color: colors.textInverse,
  };

  const dateStyle: React.CSSProperties = {
    fontSize: 14,
    color: colors.textInverse,
    opacity: 0.8,
  };

  const dividerStyle: React.CSSProperties = {
    borderBottom: `1px solid ${colors.primary}4d`, // ~30% opacity
    marginBottom: 32,
    paddingBottom: 16,
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  };

  if (isLoading) {
    return (
      <section style={shellStyle}>
        <link rel="stylesheet" href={fontsURL} />
        <div style={dividerStyle}>
          <span style={sectionTitleStyle}>BOLETIM INFORMATIVO</span>
          <span style={dateStyle}>{currentDate}</span>
        </div>
        <SectionHeader title="PRÓXIMOS CULTOS" />
        <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: colors.textMuted }}>Carregando cultos...</span>
        </div>
      </section>
    );
  }

  if (cultos.length === 0) {
    return (
      <section style={shellStyle}>
        <link rel="stylesheet" href={fontsURL} />
        <div style={dividerStyle}>
          <span style={sectionTitleStyle}>BOLETIM INFORMATIVO</span>
          <span style={dateStyle}>{currentDate}</span>
        </div>
        <SectionHeader title="PRÓXIMOS CULTOS" />
        <div style={{ height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: colors.textMuted, textAlign: 'center' }}>Nenhum culto programado no momento.</p>
        </div>
      </section>
    );
  }

  // ── Render principal ───────────────────────────────────────────────────────

  return (
    <section style={shellStyle}>
      {/* Carrega as fontes do Google – mesmo padrão do ThemePreview */}
      <link rel="stylesheet" href={fontsURL} />

      {/* Fundo decorativo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 80,
            right: 80,
            width: 384,
            height: 384,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.primary}0d 0%, ${colors.secondary}0d 100%)`,
            filter: 'blur(64px)',
          }}
        />
      </div>

      {/* ── Cabeçalho da seção ─────────────────────────────────────────── */}
      <div style={dividerStyle}>
        <h1
          style={{
            fontFamily: typography.fontHeading,
            fontSize: isMobile ? 22 : 28,
            fontWeight: Number(typography.headingWeight),
            color: colors.primary,
            margin: 0,
          }}
        >
          BOLETIM INFORMATIVO
        </h1>
        <p style={dateStyle}>{currentDate}</p>
      </div>

      <SectionHeader title="PRÓXIMOS CULTOS" />

      {/* ── Swiper ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides
          loop
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={800}
          autoplay={{ delay: 10000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={false}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = navigationPrevRef.current;
              swiper.params.navigation.nextEl = navigationNextRef.current;
            }
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          style={{ borderRadius: layout.borderRadius, overflow: 'hidden', marginBottom: 16 }}
        >
          {cultos.map((culto) => (
            <SwiperSlide key={culto.id}>
              {/* ── Card do culto (hero dinâmico) ──────────────────── */}
              <div
                style={{
                  position: 'relative',
                  background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.backgroundAlt} 100%)`,
                  borderRadius: layout.borderRadius,
                  overflow: 'hidden',
                  border: `1px solid ${colors.primary}1a`,
                }}
              >
                {/* ── Topo do card: dia + título + data/hora ──────── */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 20,
                    background: heroGradient,
                    padding: isMobile ? '16px' : '24px',
                    borderBottom: `1px solid ${colors.primary}1a`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      gap: 12,
                    }}
                  >
                    {/* Dia + título */}
                    <div>
                      <span
                        style={{
                          fontFamily: typography.fontAccent,
                          fontSize: isMobile ? 20 : 24,
                          fontWeight: 900,
                          letterSpacing: '0.05em',
                          color: colors.accent,
                          display: 'block',
                        }}
                      >
                        {culto.diasemana}
                      </span>
                      <h3
                        style={{
                          fontFamily: typography.fontHeading,
                          fontSize: isMobile ? 14 : 17,
                          fontWeight: Number(typography.headingWeight),
                          color: colors.textInverse,
                          opacity: 0.9,
                          marginTop: 4,
                        }}
                      >
                        {culto.titulo}
                      </h3>
                    </div>

                    {/* Data e hora */}
                    <div style={{ display: 'flex', gap: isMobile ? 8 : 12 }}>
                      {/* Badge data */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: `${colors.accent}26`,
                          backdropFilter: 'blur(8px)',
                          padding: isMobile ? '6px 12px' : '8px 16px',
                          borderRadius: btnRadius,
                          border: `1px solid ${colors.accent}4d`,
                          gap: 6,
                        }}
                      >
                        <CalendarDays size={isMobile ? 14 : 16} style={{ color: colors.accent }} />
                        <span
                          style={{
                            fontFamily: typography.fontBody,
                            fontSize: isMobile ? 12 : 14,
                            fontWeight: 600,
                            color: colors.textInverse,
                          }}
                        >
                          {formatDateForDisplay(culto.data)}
                        </span>
                      </div>

                      {/* Badge hora */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: `${colors.accent}26`,
                          backdropFilter: 'blur(8px)',
                          padding: isMobile ? '6px 12px' : '8px 16px',
                          borderRadius: btnRadius,
                          border: `1px solid ${colors.accent}4d`,
                          gap: 6,
                        }}
                      >
                        <Clock size={isMobile ? 14 : 16} style={{ color: colors.accent }} />
                        <span
                          style={{
                            fontFamily: typography.fontBody,
                            fontSize: isMobile ? 12 : 14,
                            fontWeight: 600,
                            color: colors.textInverse,
                          }}
                        >
                          {culto.hora}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Imagem de arte do culto ─────────────────────── */}
                <div
                  style={{
                    position: 'relative',
                    height: isMobile ? '35vh' : '40vh',
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src={culto.arte}
                    alt={culto.titulo}
                    fill
                    priority
                    style={{ objectFit: 'contain', objectPosition: 'center', transition: 'transform 700ms' }}
                  />
                  {/* Gradiente overlay no rodapé da imagem */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(to top, ${colors.surface}99 0%, transparent 50%)`,
                    }}
                  />
                </div>

                {/* ── Orador ─────────────────────────────────────── */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 20,
                    background: `linear-gradient(to top, ${colors.surface} 0%, ${colors.backgroundAlt}cc 100%)`,
                    backdropFilter: 'blur(8px)',
                    borderTop: `1px solid ${colors.primary}1a`,
                    padding: isMobile ? '16px' : '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'flex-start' : 'center',
                    gap: 12,
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      position: 'relative',
                      width: isMobile ? 48 : 64,
                      height: isMobile ? 48 : 64,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `2px solid ${colors.primary}`,
                      boxShadow: cardShadow,
                      flexShrink: 0,
                    }}
                  >
                    <Image src={culto.orador.foto} alt={culto.orador.nome} fill style={{ objectFit: 'cover' }} />
                  </div>

                  {/* Info */}
                  <div style={{ marginLeft: isMobile ? 0 : 8 }}>
                    <p
                      style={{
                        fontFamily: typography.fontBody,
                        fontSize: isMobile ? 11 : 13,
                        color: colors.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <User size={isMobile ? 13 : 15} style={{ color: colors.primary }} />
                      Orador
                    </p>
                    <p
                      style={{
                        fontFamily: typography.fontHeading,
                        fontSize: isMobile ? 15 : 20,
                        fontWeight: Number(typography.headingWeight),
                        color: colors.text,
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

        {/* ── Botões de navegação (somente desktop) ─────────────────── */}
        {!isMobile && (
          <div
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              top: '40%',
              transform: 'translateY(-50%)',
              zIndex: 30,
              display: 'flex',
              justifyContent: 'space-between',
              pointerEvents: 'none',
            }}
          >
            {[navigationPrevRef, navigationNextRef].map((ref, i) => (
              <button
                key={i}
                ref={ref}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: `${colors.surface}cc`,
                  color: colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${colors.primary}33`,
                  boxShadow: cardShadow,
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                  outline: 'none',
                  transition: 'background 300ms',
                }}
                aria-label={i === 0 ? 'Anterior' : 'Próximo'}
              >
                {i === 0 ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
            ))}
          </div>
        )}

        {/* ── Dots de paginação ─────────────────────────────────────── */}
        {cultos.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {cultos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => swiperRef.current?.slideToLoop(index)}
                  aria-label={`Ir para slide ${index + 1}`}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: index === activeIndex ? colors.primary : `${colors.primary}66`,
                    transform: index === activeIndex ? 'scale(1.25)' : 'scale(1)',
                    transition: 'all 300ms',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}