import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import AuthLayout from "@/layout/AuthLayout";
import StepProfile from "@/components/auth/steps/StepProfile";
import StepObjective from "@/components/auth/steps/StepObjective";
import StepPhysique from "@/components/auth/steps/StepPhysique";
import StepSummary from "@/components/auth/steps/StepSummary";
import { authApi } from "@/api/auth";

export default function RegisterWizard() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    email: "",
    password: "",
    gender: "female",
    goal: "LOSE_WEIGHT",
    heightCm: "",
    initialWeightKg: "",
    activityLevel: "SEDENTARY",
    fitnessLevel: "BEGINNER",
  });

  const steps = useMemo(
    () => [
      { key: "profile", label: "Profile", percent: 25, component: StepProfile },
      { key: "objective", label: "Objective", percent: 50, component: StepObjective },
      { key: "physique", label: "Physique", percent: 75, component: StepPhysique },
      { key: "summary", label: "Summary", percent: 100, component: StepSummary },
    ],
    []
  );

  const Current = steps[step].component;

  async function handleCreate() {
    try {
      setSubmitting(true);

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        birthDate: form.birthDate,
        email: form.email,
        password: form.password,
        gender: form.gender?.toUpperCase(),
        goal: form.goal,
        heightCm: Number(form.heightCm),
        initialWeightKg: Number(form.initialWeightKg),
        activityLevel: form.activityLevel,
        fitnessLevel: form.fitnessLevel,
      };

      // 1) Register
      await authApi.register(payload);

      // 2) Auto-login pour obtenir un token
      const loginRes = await authApi.login({
        email: form.email,
        password: form.password,
      });

      const token = loginRes.data?.token || loginRes.data?.accessToken;

      if (!token) {
        console.error("❌ No token returned from login:", loginRes.data);
        alert("Login succeeded but no token returned. Check backend response.");
        return;
      }

      // 3) Stocker token
      localStorage.setItem("token", token);

      // 4) Redirect
      nav("/welcome");
    } catch (err) {
      console.error("❌ Register/Login error:", err?.response?.data || err.message);
      alert(
        err?.response?.data?.message ||
          "Registration failed. Please check your information and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="BETTER YOU" subtitle="Create your account in a few steps">
      {/* Progress */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-white/60 mb-2">
          <span>{steps[step].label}</span>
          <span className="text-[#D6F93D] font-semibold">{steps[step].percent}%</span>
        </div>

        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-[#D6F93D] shadow-[0_0_18px_rgba(214,249,61,0.45)]"
            initial={{ width: "0%" }}
            animate={{ width: `${steps[step].percent}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>

        {/* Step dots */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {steps.map((s, idx) => (
            <div
              key={s.key}
              className={[
                "rounded-xl border px-3 py-2 text-center text-xs transition",
                idx === step
                  ? "border-[#D6F93D]/50 bg-[#D6F93D]/10 text-[#D6F93D] shadow-[0_0_20px_rgba(214,249,61,0.15)]"
                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20",
              ].join(" ")}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <Current form={form} setForm={setForm} />
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="flex-1 rounded-full border border-white/15 bg-white/5 py-3 text-white/80 hover:bg-white/10 transition disabled:opacity-40"
          disabled={step === 0 || submitting}
        >
          Back
        </button>

        <motion.button
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          type="button"
          onClick={() => {
            if (submitting) return;
            if (step < steps.length - 1) setStep((s) => s + 1);
            else handleCreate();
          }}
          disabled={submitting}
          className="flex-1 rounded-full bg-[#D6F93D] text-black font-bold py-3 shadow-[0_0_25px_rgba(214,249,61,0.25)] hover:shadow-[0_0_40px_rgba(214,249,61,0.45)] transition disabled:opacity-60"
        >
          {step < steps.length - 1 ? "NEXT →" : submitting ? "CREATING..." : "CREATE"}
        </motion.button>
      </div>

      <p className="text-center text-sm text-white/70 mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-[#D6F93D] font-semibold hover:brightness-110">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
