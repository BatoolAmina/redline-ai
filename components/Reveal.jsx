"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({ children, className, delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34, scale: 0.985, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18, margin: "0px 0px -8% 0px" }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 82, damping: 19, delay }}
    >
      {children}
    </motion.div>
  );
}