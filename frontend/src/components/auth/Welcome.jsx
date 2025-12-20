import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthLayout from "@/layout/AuthLayout";

export default function Welcome() {
  const nav = useNavigate();

  return (
    <AuthLayout title="WELCOME !" subtitle="">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[#D6F93D] text-xl font-extrabold drop-shadow-[0_0_18px_rgba(214,249,61,0.35)]"
        >
          Start Your New Journey!
        </motion.h2>

        <p className="text-white/70 text-sm mt-3">
          Congratulations on signing up. You’re about to begin a wonderful transformation!
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav("/login")}
          className="mt-6 w-44 rounded-full bg-[#D6F93D] text-black font-bold py-3
                     shadow-[0_0_25px_rgba(214,249,61,0.25)] hover:shadow-[0_0_40px_rgba(214,249,61,0.45)] transition"
        >
          NEXT
        </motion.button>
      </div>
    </AuthLayout>
  );
}