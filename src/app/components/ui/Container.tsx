// components/ui/Container.tsx
// ─── Container padrão ───────────────────────────────────────────────────────
// Centraliza a largura máxima e o padding horizontal usados em toda a home.
// Evita repetição de "mx-auto max-w-6xl px-4" espalhada em cada componente.

import { HTMLAttributes } from "react";

type ContainerSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export default function Container({
  size = "lg",
  className = "",
  children,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${SIZES[size]} px-4 sm:px-6 lg:px-8 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
