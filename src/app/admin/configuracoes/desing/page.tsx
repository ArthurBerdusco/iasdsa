// ============================================================
// app/admin/configuracoes/design/page.tsx
// Server Component — busca o tema no banco e passa pro editor
// ============================================================

import { getTheme } from "@/lib/theme-repository";
import { ThemeEditorPage } from "@/app/components/admin/theme/ThemeEditorPage";

// Impede que o Next.js faça cache da página
export const dynamic = "force-dynamic";

export default async function DesignPage() {
  // Busca o tema diretamente no Neon (server-side, sem custo de rede extra)
  const initialTheme = await getTheme();

  return <ThemeEditorPage initialTheme={initialTheme} />;
}
