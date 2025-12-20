import React from "react";
import { motion } from "framer-motion";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Background texture + gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,249,61,0.10),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(214,249,61,0.10),transparent_40%)]" />
      <div className="absolute inset-0 opacity-20 bg-[url('/src/assets/noise.png')] bg-repeat" />

      {/* Floating glow blobs */}
      <motion.div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#D6F93D]/20 blur-3xl"
        animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-24 -right-24 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-center mb-6"
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-[#D6F93D] drop-shadow-[0_0_18px_rgba(214,249,61,0.35)]">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 text-white/70">{subtitle}</p>
            ) : null}
          </motion.div>

          {/* Card with neon border */}
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-[linear-gradient(120deg,rgba(214,249,61,0.55),rgba(139,92,246,0.55),rgba(214,249,61,0.55))] blur-sm opacity-70" />
            <div className="relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.60)] p-6">
              {children}
            </div>
          </div>

          {/* Footer hint */}
          <p className="text-center text-xs text-white/50 mt-6">
            BetterYou • Secure Access • Neon UI
          </p>
        </motion.div>
      </div>
    </div>
  );
}
