// components/admin/ui/AdminPageHeader.tsx
// ─── Cabeçalho padrão de página no admin ────────────────────────────────────
// Usado por todas as telas de /admin/* para manter título, descrição e ações
// (botões "Novo", "Salvar", etc.) sempre no mesmo lugar e com o mesmo estilo.

import { ReactNode } from "react";

export default function AdminPageHeader({
  title,
  description,
  icon,
  actions,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
