import React from "react";
import { LayoutDashboard, Utensils, Dumbbell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo2 from "@/assets/logo.png";

const ACCENT = "#D6F93D";

const Item = ({ active, id, Icon, label, onClick }) => {
  const isActive = active === id;

  return (
    <button
      onClick={onClick}
      className={[
        "group relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl border",
        "transition-all duration-200 ease-out",
        `focus:outline-none focus:ring-4 focus:ring-[${ACCENT}]/20`,
        isActive
          ? [
              `bg-[${ACCENT}] text-black border-[${ACCENT}]`,
              "shadow-[0_18px_60px_rgba(214,249,61,0.20)]",
            ].join(" ")
          : [
              "bg-white/5 border-white/10 text-white/90",
              "hover:bg-white/10 hover:border-white/20",
              "hover:-translate-y-[1px]",
            ].join(" "),
      ].join(" ")}
    >
      {/* Active indicator */}
      <span
        className={[
          "absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-full",
          isActive ? `bg-[${ACCENT}]` : "bg-transparent",
        ].join(" ")}
      />

      {/* Icon bubble */}
      <div
        className={[
          "h-10 w-10 rounded-2xl flex items-center justify-center border transition",
          isActive
            ? "bg-black/10 border-black/10"
            : `bg-black/30 border-white/10 group-hover:border-white/20`,
        ].join(" ")}
      >
        <Icon size={18} className={isActive ? "text-black" : `text-[${ACCENT}]`} />
      </div>

      <span className={["font-semibold tracking-wide", isActive ? "text-black" : "text-white"].join(" ")}>
        {label}
      </span>

      <span
        className={[
          "ml-auto text-xs opacity-0 translate-x-[-2px] transition-all duration-200",
          isActive ? "opacity-0" : "group-hover:opacity-70 group-hover:translate-x-0",
        ].join(" ")}
      >
        →
      </span>
    </button>
  );
};

export default function Sidebar({ active = "profile", onLogout }) {
  const navigate = useNavigate();
  const go = (path) => navigate(path);

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    go("/login");
  };

  return (
    <aside
      className={[
        "relative h-screen w-72 flex flex-col text-white",
        // ✅ SOLID background so it looks like a real sidebar
        "bg-gradient-to-b from-[#0B0B12] via-[#120A22] to-[#0A0A10]",
        // ✅ Strong separation
        "border-r border-white/15 shadow-[20px_0_60px_rgba(0,0,0,0.55)]",
      ].join(" ")}
    >
      {/* subtle accent glow inside sidebar */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(214,249,61,0.12),transparent_40%),radial-gradient(circle_at_60%_40%,rgba(139,92,246,0.18),transparent_45%)]" />

      {/* Logo */}
      <div className="flex justify-center pt-10 pb-8 relative">
        <div className="absolute inset-x-0 top-10 h-24 bg-[#D6F93D]/10 blur-3xl" />
        <img
          src={logo2}
          alt="BetterYou"
          className="relative h-16 w-auto object-contain"
        />
      </div>

      {/* Menu */}
      <nav className="relative flex-1 px-6 space-y-3">
        <Item active={active} id="dashboard" Icon={LayoutDashboard} label="Dashboard" onClick={() => go("/dashboard")} />
        <Item active={active} id="nutrition" Icon={Utensils} label="Nutrition" onClick={() => go("/nutrition")} />
        <Item active={active} id="training" Icon={Dumbbell} label="Training" onClick={() => go("/training")} />
        <Item active={active} id="profile" Icon={User} label="Profile" onClick={() => go("/profile")} />
      </nav>

      {/* Logout */}
      <div className="relative px-6 pb-6">
        <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <button
          onClick={handleLogout}
          className={[
            "group w-full flex items-center gap-3 px-4 py-3 rounded-2xl border",
            "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition",
          ].join(" ")}
        >
          <div className="h-10 w-10 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition">
            <LogOut size={18} className="text-white/80 group-hover:text-white" />
          </div>
          <span className="font-semibold tracking-wide">Log out</span>
        </button>
      </div>
    </aside>
  );
}
