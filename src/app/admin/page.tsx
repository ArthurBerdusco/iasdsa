"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Bell,
  Users,
  Eye,
  EyeOff,
  TrendingUp,
  Youtube,
  HandHeart,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutDashboard,
  Mic,
  Image,
  MessageSquare,
  ChevronRight,
  Sparkles,
} from "lucide-react";

// ── Tipos mínimos para simular dados reais ──────────────────
interface QuickStat {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: string;
  href: string;
  trend?: string;
}

interface RecentItem {
  type: "anuncio" | "culto" | "oracao";
  title: string;
  time: string;
  status: "novo" | "ativo" | "pendente";
}

interface ComponentVisibility {
  name: string;
  key: string;
  visible: boolean;
}

// ── Dados estáticos de exemplo (substitua por fetch real) ───
const STATS: QuickStat[] = [
  {
    label: "Próximo Culto",
    value: "Sáb, 14h",
    sub: "Pastor João Silva",
    icon: <Calendar className="w-5 h-5" />,
    color: "from-blue-500 to-blue-600",
    href: "/admin/cultos",
    trend: "Amanhã",
  },
  {
    label: "Anúncios Ativos",
    value: 3,
    sub: "2 novos esta semana",
    icon: <Bell className="w-5 h-5" />,
    color: "from-amber-500 to-orange-500",
    href: "/admin/anuncios",
    trend: "+2",
  },
  {
    label: "Pedidos de Oração",
    value: 7,
    sub: "3 novos hoje",
    icon: <HandHeart className="w-5 h-5" />,
    color: "from-rose-500 to-pink-500",
    href: "/admin/pedidos-oracao",
    trend: "+3",
  },
  {
    label: "Componentes Visíveis",
    value: "4/6",
    sub: "2 ocultos",
    icon: <Eye className="w-5 h-5" />,
    color: "from-emerald-500 to-teal-500",
    href: "/admin/configuracoes",
  },
];

const RECENT: RecentItem[] = [
  { type: "anuncio", title: "Retiro de Jovens — Inscrições abertas", time: "há 2h", status: "novo" },
  { type: "culto", title: "Culto de Sábado 14h — Adicionado", time: "há 5h", status: "ativo" },
  { type: "oracao", title: "Pedido de Oração — Maria Santos", time: "há 1d", status: "pendente" },
  { type: "anuncio", title: "Seminário Bíblico — 22 de Março", time: "há 1d", status: "ativo" },
  { type: "culto", title: "Culto especial — Semana Santa", time: "há 2d", status: "ativo" },
];

const COMPONENTS: ComponentVisibility[] = [
  { name: "Seção de Cultos", key: "cultos", visible: true },
  { name: "Mensagem Pastoral", key: "mensagem_pastoral", visible: false },
  { name: "Programação", key: "programacao_cultos", visible: true },
  { name: "Anúncios", key: "anuncios", visible: true },
  { name: "Pedido de Oração", key: "pedido_oracao", visible: true },
  { name: "Fotos da Semana", key: "fotos_semana", visible: false },
];

const QUICK_ACTIONS = [
  { label: "Novo Culto", icon: <Calendar className="w-4 h-4" />, href: "/admin/cultos/novo", color: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200" },
  { label: "Novo Anúncio", icon: <Bell className="w-4 h-4" />, href: "/admin/anuncios/novo", color: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200" },
  { label: "Upload Foto", icon: <Image className="w-4 h-4" />, href: "/admin/fotos", color: "bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200" },
  { label: "Mensagem", icon: <MessageSquare className="w-4 h-4" />, href: "/admin/mensagem-pastoral", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200" },
  { label: "Orador", icon: <Mic className="w-4 h-4" />, href: "/admin/oradores", color: "bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200" },
  { label: "Ver Cultos", icon: <Youtube className="w-4 h-4" />, href: "/admin/ultimos-cultos", color: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200" },
];

// ── Status badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: RecentItem["status"] }) {
  const map = {
    novo: "bg-blue-100 text-blue-700",
    ativo: "bg-emerald-100 text-emerald-700",
    pendente: "bg-amber-100 text-amber-700",
  };
  const labels = { novo: "Novo", ativo: "Ativo", pendente: "Pendente" };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

function typeIcon(type: RecentItem["type"]) {
  if (type === "anuncio") return <Bell className="w-3.5 h-3.5 text-amber-500" />;
  if (type === "culto") return <Calendar className="w-3.5 h-3.5 text-blue-500" />;
  return <HandHeart className="w-3.5 h-3.5 text-rose-500" />;
}

// ── Componente principal ─────────────────────────────────────
const AdminDisplay: React.FC = () => {
  const [components, setComponents] = useState<ComponentVisibility[]>(COMPONENTS);
  const [greeting, setGreeting] = useState("Bom dia");

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 18) setGreeting("Boa tarde");
    else if (h >= 18) setGreeting("Boa noite");
  }, []);

  const toggleComponent = (key: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
    );
  };

  const visibleCount = components.filter((c) => c.visible).length;

  return (
    <div
      className="min-h-screen p-6 lg:p-8"
      style={{ background: "var(--color-background, #f4f6fb)", fontFamily: "var(--font-body, 'Lato', sans-serif)" }}
    >
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium" style={{ color: "var(--color-text-muted, #6b7280)" }}>
            {greeting}, Administrador
          </span>
        </div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-heading, 'Playfair Display', serif)",
            color: "var(--color-text, #1a2540)",
          }}
        >
          Painel Administrativo
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted, #6b7280)" }}>
          Igreja Adventista — Santo Amaro
        </p>
      </div>

      {/* ── STATS CARDS ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat, i) => (
          <Link key={i} href={stat.href}>
            <div
              className="group relative rounded-2xl p-5 cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "var(--color-surface, #ffffff)",
                border: "1px solid var(--color-border, #e5e9f0)",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              {/* Gradient accent strip */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${stat.color} rounded-t-2xl`} />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted, #6b7280)" }}>
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold" style={{ color: "var(--color-text, #1a2540)", fontFamily: "var(--font-heading, serif)" }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-muted, #6b7280)" }}>
                    {stat.sub}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-sm`}>
                  {stat.icon}
                </div>
              </div>

              {stat.trend && (
                <div className="mt-3 pt-3 border-t flex items-center gap-1.5" style={{ borderColor: "var(--color-border, #e5e9f0)" }}>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600">{stat.trend}</span>
                </div>
              )}

              <ChevronRight className="absolute bottom-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" style={{ color: "var(--color-text-muted)" }} />
            </div>
          </Link>
        ))}
      </div>

      {/* ── GRID PRINCIPAL ────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── AÇÕES RÁPIDAS ── */}
        <div
          className="lg:col-span-1 rounded-2xl p-6"
          style={{
            background: "var(--color-surface, #ffffff)",
            border: "1px solid var(--color-border, #e5e9f0)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text, #1a2540)", fontFamily: "var(--font-heading, serif)" }}>
              Ações Rápidas
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((action, i) => (
              <Link key={i} href={action.href}>
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer ${action.color}`}>
                  {action.icon}
                  <span className="truncate text-xs">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── ATIVIDADE RECENTE ── */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{
            background: "var(--color-surface, #ffffff)",
            border: "1px solid var(--color-border, #e5e9f0)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text, #1a2540)", fontFamily: "var(--font-heading, serif)" }}>
              Atividade Recente
            </h2>
            <Link href="/admin/anuncios" className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: "var(--color-primary, #1e40af)" }}>
              Ver tudo <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-3">
            {RECENT.map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-gray-50"
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--color-background-alt, #f4f6fb)" }}>
                  {typeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-text, #1a2540)" }}>
                    {item.title}
                  </p>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--color-text-muted, #6b7280)" }}>
                    <Clock className="w-3 h-3" /> {item.time}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── CONTROLE DE VISIBILIDADE ──────────────────────── */}
      <div
        className="mt-6 rounded-2xl p-6"
        style={{
          background: "var(--color-surface, #ffffff)",
          border: "1px solid var(--color-border, #e5e9f0)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text, #1a2540)", fontFamily: "var(--font-heading, serif)" }}>
              Visibilidade dos Componentes
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted, #6b7280)" }}>
              {visibleCount} de {components.length} visíveis no site
            </p>
          </div>
          <Link
            href="/admin/configuracoes"
            className="text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
            style={{ color: "var(--color-primary, #1e40af)", borderColor: "var(--color-border, #e5e9f0)" }}
          >
            Gerenciar <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {components.map((comp) => (
            <div
              key={comp.key}
              className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-150"
              style={{
                borderColor: comp.visible ? "var(--color-primary, #1e40af)22" : "var(--color-border, #e5e9f0)",
                background: comp.visible ? "var(--color-primary, #1e40af)08" : "var(--color-background-alt, #f9fafb)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${comp.visible ? "bg-emerald-400" : "bg-gray-300"}`} />
                <span className="text-xs font-medium" style={{ color: "var(--color-text, #1a2540)" }}>
                  {comp.name}
                </span>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => toggleComponent(comp.key)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                  comp.visible ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Toggle ${comp.name}`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    comp.visible ? "translate-x-[18px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDisplay;