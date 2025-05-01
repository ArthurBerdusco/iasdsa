import React from "react";
import { motion } from "framer-motion";

export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-white mb-4"
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="h-1 w-24 mx-auto bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 origin-left rounded-full"
        />
      </div>
    </div>
  );
}
