import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import { authApi } from "@/api/auth";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function ResetPassword() {
  const nav = useNavigate();
  const query = useQuery();
  const token = query.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const passwordsMatch = newPassword && confirm && newPassword === confirm;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Missing token. Please use the link sent to your email.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword });
      setDone(true);
      // petit délai puis redirect
      setTimeout(() => nav("/login"), 900);
    } catch (err) {
      setError("Invalid or expired token. Please request a new reset link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="BETTER YOU" subtitle="Choose a new password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!token ? (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-200">
            Missing token. Please open the link from your email.
          </div>
        ) : null}

        <NeonPasswordInput
          label="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          show={show1}
          toggle={() => setShow1((v) => !v)}
        />

        <NeonPasswordInput
          label="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          show={show2}
          toggle={() => setShow2((v) => !v)}
        />

        {confirm ? (
          <div className={`text-xs ${passwordsMatch ? "text-emerald-300" : "text-red-200"}`}>
            {passwordsMatch ? "Passwords match ✅" : "Passwords do not match ❌"}
          </div>
        ) : null}

        {done ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            Password updated! Redirecting to login...
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
          disabled={loading || !token}
          className="w-full rounded-full bg-[#D6F93D] text-black font-bold py-3 shadow-[0_0_25px_rgba(214,249,61,0.25)] hover:shadow-[0_0_40px_rgba(214,249,61,0.45)] transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update password"}
        </motion.button>

        <p className="text-center text-sm text-white/70 pt-2">
          <Link to="/login" className="text-[#D6F93D] font-semibold hover:brightness-110">
            Back to Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function NeonPasswordInput({ label, show, toggle, ...props }) {
  return (
    <label className="block relative">
      <span className="text-sm text-white/70">{label}</span>

      <input
        {...props}
        type={show ? "text" : "password"}
        className="mt-2 w-full rounded-xl bg-white/10 border border-white/10
                   px-4 py-3 pr-12 text-white placeholder:text-white/40
                   outline-none transition
                   focus:border-[#D6F93D]/60 focus:ring-2 focus:ring-[#D6F93D]/25
                   hover:border-white/20"
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-[42px] text-white/50 hover:text-[#D6F93D] transition"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </label>
  );
}
