// components/ui/SectionHeader.tsx
"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function SectionHeader({
  title,
  eyebrow,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div className={`mb-10 ${isCenter ? "mx-auto max-w-3xl text-center" : "text-left"}`}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-2 text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: "var(--color-accent)" }}
        >
          {eyebrow}
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-3xl font-extrabold text-[var(--color-text)] md:text-4xl"
      >
        {title}
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
        className={`mt-4 h-1 w-24 origin-left rounded-full bg-[var(--color-primary)] ${
          isCenter ? "mx-auto" : ""
        }`}
      />

      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="mt-4 text-sm text-[var(--color-text-muted)] md:text-base"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
