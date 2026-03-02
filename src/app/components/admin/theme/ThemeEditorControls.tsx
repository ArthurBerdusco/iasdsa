// ============================================================
// components/admin/theme/ThemeEditorControls.tsx
// Componentes de UI reutilizáveis para o editor de tema
// ============================================================

"use client";

import { useState } from "react";

// ── ColorSwatch ─────────────────────────────────────────────
interface ColorSwatchProps {
  label: string;
  color: string;
  onChange: (value: string) => void;
}

export function ColorSwatch({ label, color, onChange }: ColorSwatchProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
        <div className="relative shrink-0">
          <div
            className="w-7 h-7 rounded-md border-2 border-black/10 cursor-pointer shadow-sm"
            style={{ background: color }}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </div>
        <input
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border-none bg-transparent text-[13px] font-mono text-slate-700 outline-none min-w-0"
        />
      </div>
    </div>
  );
}

// ── SliderField ─────────────────────────────────────────────
interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}

export function SliderField({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  unit = "px",
}: SliderFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </label>
        <span className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600 cursor-pointer"
      />
    </div>
  );
}

// ── SelectField ─────────────────────────────────────────────
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 bg-slate-50 cursor-pointer outline-none focus:border-blue-400"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── ToggleField ─────────────────────────────────────────────
interface ToggleFieldProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ToggleField({
  label,
  description,
  value,
  onChange,
}: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-[13px] font-semibold text-slate-800">{label}</p>
        {description && (
          <p className="text-[12px] text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative w-11 h-6 rounded-full border-none cursor-pointer transition-colors duration-200"
        style={{ background: value ? "#1a56db" : "#cbd5e1" }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200"
          style={{ left: value ? "calc(100% - 20px)" : "4px" }}
        />
      </button>
    </div>
  );
}

// ── CollapsibleSection ──────────────────────────────────────
interface CollapsibleSectionProps {
  title: string;
  icon: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3.5 border-none cursor-pointer font-bold text-[14px] transition-colors"
        style={{
          background: open ? "#f0f7ff" : "#fff",
          color: "#1e3a5f",
        }}
      >
        <span className="flex items-center gap-2">
          {icon} {title}
        </span>
        <span
          className="text-lg transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "none" }}
        >
          ›
        </span>
      </button>
      {open && (
        <div className="p-4 flex flex-col gap-3.5 border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
}
