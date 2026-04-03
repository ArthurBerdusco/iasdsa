"use client"

import { motion } from "framer-motion";

export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-4 text-3xl font-extrabold text-[var(--color-text)] md:text-4xl"
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto h-1 w-24 origin-left rounded-full bg-[var(--color-primary)]"
        />

      </div>
    </div>
  );
}