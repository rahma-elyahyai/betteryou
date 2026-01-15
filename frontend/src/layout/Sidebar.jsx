import React, { useState } from "react";
import { LayoutDashboard, Utensils, Dumbbell, User, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo2 from "@/assets/logo.png";

const ACCENT = "#D6F93D";

const Item = ({ active, id, Icon, label, onClick, isCollapsed }) => {
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
          "absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-full transition-all",
          isActive ? `bg-[${ACCENT}]` : "bg-transparent",
        ].join(" ")}
      />

      {/* Icon bubble */}
      <div
        className={[
          "h-10 w-10 rounded-2xl flex items-center justify-center border transition flex-shrink-0",
          isActive
            ? "bg-black/10 border-black/10"
            : `bg-black/30 border-white/10 group-hover:border-white/20`,
        ].join(" ")}
      >
        <Icon size={18} className={isActive ? "text-black" : `text-[${ACCENT}]`} />
      </div>

      {/* Label with transition */}
      <span 
        className={[
          "font-semibold tracking-wide transition-all duration-300",
          isActive ? "text-black" : "text-white",
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        ].join(" ")}
      >
        {label}
      </span>

      {/* Arrow indicator */}
      {!isCollapsed && (
        <span
          className={[
            "ml-auto text-xs opacity-0 translate-x-[-2px] transition-all duration-200",
            isActive ? "opacity-0" : "group-hover:opacity-70 group-hover:translate-x-0",
          ].join(" ")}
        >
          →
        </span>
      )}
    </button>
  );
};

export default function Sidebar({ active = "profile", onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const go = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    go("/");
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-900 border border-white/20 rounded-xl text-lime-400 hover:bg-lime-400 hover:text-gray-900 transition-all shadow-lg"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed lg:sticky top-0 h-screen flex flex-col text-white transition-all duration-300 ease-in-out z-40",
          // Desktop behavior
          "hidden lg:flex",
          isOpen ? "w-72" : "w-20",
          // Mobile behavior
          isMobileOpen ? "flex" : "",
          // Background and border
          "bg-gradient-to-b from-[#0B0B12] via-[#120A22] to-[#0A0A10]",
          "border-r border-white/15 shadow-[20px_0_60px_rgba(0,0,0,0.55)]",
          // Mobile animation
          isMobileOpen ? "animate-slide-in-left" : "lg:translate-x-0 -translate-x-full",
        ].join(" ")}
      >
        {/* Subtle accent glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(214,249,61,0.12),transparent_40%),radial-gradient(circle_at_60%_40%,rgba(139,92,246,0.18),transparent_45%)]" />

        {/* Desktop Toggle Button - Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={[
            "hidden lg:flex absolute top-6 z-50 flex-col gap-1 p-2 group",
            "transition-all duration-300",
            isOpen ? "right-4" : "right-2"
          ].join(" ")}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <span className={[
            "block h-0.5 bg-lime-400 transition-all duration-300",
            isOpen ? "w-5" : "w-4"
          ].join(" ")} />
          <span className={[
            "block h-0.5 bg-lime-400 transition-all duration-300",
            isOpen ? "w-5" : "w-4"
          ].join(" ")} />
          <span className={[
            "block h-0.5 bg-lime-400 transition-all duration-300",
            isOpen ? "w-5" : "w-4"
          ].join(" ")} />
        </button>

        {/* Logo */}
        <div className={[
          "flex justify-center pt-10 pb-8 relative transition-all duration-300",
          isOpen ? "px-4" : "px-2"
        ].join(" ")}>
          <div className="absolute inset-x-0 top-10 h-24 bg-[#D6F93D]/10 blur-3xl" />
          <img
            src={logo2}
            alt="BetterYou"
            className={[
              "relative object-contain transition-all duration-300",
              isOpen ? "h-16 w-auto" : "h-10 w-10"
            ].join(" ")}
          />
        </div>

        {/* Menu */}
        <nav className={[
          "relative flex-1 space-y-3 transition-all duration-300",
          isOpen ? "px-6" : "px-2"
        ].join(" ")}>
          <Item 
            active={active} 
            id="dashboard" 
            Icon={LayoutDashboard} 
            label="Dashboard" 
            onClick={() => go("/dashboard")}
            isCollapsed={!isOpen}
          />
          <Item 
            active={active} 
            id="nutrition" 
            Icon={Utensils} 
            label="Nutrition" 
            onClick={() => go("/nutrition")}
            isCollapsed={!isOpen}
          />
          <Item 
            active={active} 
            id="training" 
            Icon={Dumbbell} 
            label="Training" 
            onClick={() => go("/training")}
            isCollapsed={!isOpen}
          />
          <Item 
            active={active} 
            id="profile" 
            Icon={User} 
            label="Profile" 
            onClick={() => go("/profile")}
            isCollapsed={!isOpen}
          />
        </nav>

        {/* Logout */}
        <div className={[
          "relative pb-6 transition-all duration-300",
          isOpen ? "px-6" : "px-2"
        ].join(" ")}>
          <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <button
            onClick={handleLogout}
            className={[
              "group w-full flex items-center gap-3 px-4 py-3 rounded-2xl border",
              "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all",
            ].join(" ")}
          >
            <div className="h-10 w-10 rounded-2xl bg-black/30 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition flex-shrink-0">
              <LogOut size={18} className="text-white/80 group-hover:text-white" />
            </div>
            <span 
              className={[
                "font-semibold tracking-wide transition-all duration-300",
                isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              ].join(" ")}
            >
              Log out
            </span>
          </button>
        </div>
      </aside>

      {/* Add animations to global styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
      `}</style>
    </>
  );
}