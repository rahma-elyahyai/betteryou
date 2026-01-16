import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "@/layout/AuthLayout";
import { authApi } from "@/api/auth";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });

      const token = res.data?.token || res.data?.accessToken;
      if (!token) {
        setError("Token manquant dans la réponse du backend.");
        return;
      }

      localStorage.setItem("token", token);
      nav("/profile");
    } catch (err) {
      setError("Email ou mot de passe invalide.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="BETTER YOU" subtitle="Log in to access your BetterYou account">
      <form onSubmit={handleLogin} className="space-y-4">
        <NeonInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <NeonPasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          show={showPassword}
          toggle={() => setShowPassword((v) => !v)}
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-white/50">
            Min 8 chars + numbers/symbols recommended.
          </span>
          <Link to="/forgot-password" className="text-sm text-[#D6F93D] hover:brightness-110">
            Forgot Password?
          </Link>

        </div>

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
          {loading ? "Logging in..." : "LOGIN"}
        </motion.button>

        <p className="text-center text-sm text-white/70 pt-2">
          New here?{" "}
          <Link to="/register" className="text-[#D6F93D] font-semibold hover:brightness-110">
            Create an account
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
