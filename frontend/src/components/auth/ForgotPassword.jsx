import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import { authApi } from "@/api/auth";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSent(false);
    setLoading(true);

    try {
      await authApi.forgotPassword({ email });
      // Même si l'email n'existe pas, le backend renvoie un message neutre.
      setSent(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="BETTER YOU" subtitle="Reset your password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <NeonInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        {sent ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            If the email exists, a reset link has been sent. Check your inbox.
          </div>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className="w-full rounded-full bg-[#D6F93D] text-black font-bold py-3 shadow-[0_0_25px_rgba(214,249,61,0.25)] hover:shadow-[0_0_40px_rgba(214,249,61,0.45)] transition disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset link"}
        </motion.button>

        <p className="text-center text-sm text-white/70 pt-2">
          Back to{" "}
          <Link to="/login" className="text-[#D6F93D] font-semibold hover:brightness-110">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function NeonInput({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-white/70">{label}</span>
      <input
        {...props}
        className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder:text-white/40
                   outline-none transition
                   focus:border-[#D6F93D]/60 focus:ring-2 focus:ring-[#D6F93D]/25
                   hover:border-white/20"
      />
    </label>
  );
}
