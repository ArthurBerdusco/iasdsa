// components/ui/Badge.tsx
import { ReactNode } from "react";

type Tone = "accent" | "primary" | "muted" | "success" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  accent: "bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
  primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  muted: "bg-[var(--color-background-alt)] text-[var(--color-text-muted)]",
  success: "bg-emerald-500/10 text-emerald-600",
  danger: "bg-red-500/10 text-red-600",
};

export default function Badge({
  children,
  tone = "primary",
  icon,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${TONE_CLASS[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
