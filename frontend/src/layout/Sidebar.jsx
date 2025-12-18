import React from "react";
import { LayoutDashboard, Utensils, Dumbbell, User, LogOut } from "lucide-react";
import logo2 from "@/assets/logo2.png";

const Item = ({ active, id, Icon, label }) => {
  const isActive = active === id;

  return (
    <button
      className={[
        "group relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl border",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-[#f7ff00]/30",
        isActive
          ? [
              "bg-[#f7ff00]/90 text-black border-[#f7ff00]/80",
              "shadow-[0_0_24px_rgba(247,255,0,0.25)]",
            ].join(" ")
          : [
              "bg-white/0 border-white/10 text-white",
              "hover:bg-white/6 hover:border-[#f7ff00]/25",
              "hover:shadow-[0_0_18px_rgba(247,255,0,0.10)]",
              "hover:-translate-y-[1px]",
            ].join(" "),
      ].join(" ")}
    >
      {/* left neon indicator */}
      <span
        className={[
          "absolute left-0 top-1/2 -translate-y-1/2 h-10 w-[3px] rounded-full",
          "transition-all duration-200",
          isActive ? "bg-[#f7ff00] shadow-[0_0_12px_rgba(247,255,0,0.55)]" : "bg-transparent",
        ].join(" ")}
      />

      {/* icon bubble */}
      <div
        className={[
          "relative h-10 w-10 rounded-2xl flex items-center justify-center",
          "transition-all duration-200",
          isActive
            ? "bg-black/10"
            : "bg-white/5 group-hover:bg-white/8 group-hover:shadow-[0_0_14px_rgba(247,255,0,0.12)]",
        ].join(" ")}
      >
        {/* tiny glow dot */}
        <span
          className={[
            "absolute -top-1 -right-1 h-2 w-2 rounded-full",
            isActive ? "bg-black/30" : "bg-[#f7ff00]/70",
            !isActive ? "shadow-[0_0_10px_rgba(247,255,0,0.6)]" : "",
          ].join(" ")}
        />
        <Icon size={18} className={isActive ? "text-black" : "text-[#f7ff00]"} />
      </div>

      <span className={["font-semibold tracking-wide", isActive ? "text-black" : "text-white"].join(" ")}>
        {label}
      </span>

      {/* subtle right arrow on hover */}
      <span
        className={[
          "ml-auto text-xs opacity-0 translate-x-[-2px]",
          "transition-all duration-200",
          isActive ? "opacity-0" : "group-hover:opacity-70 group-hover:translate-x-0",
        ].join(" ")}
      >
        →
      </span>
    </button>
  );
};

export default function Sidebar({ active = "dashboard" }) {
  return (
    <aside className="h-screen w-72 text-white flex flex-col border-r border-white/10
                      bg-gradient-to-b from-[#160320] via-[#14031f] to-[#0e0216]">

      {/* LOGO */}
      <div className="flex justify-center items-center ">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#f7ff00]/25 blur-3xl" />
          <img
            src={logo2}
            alt="BetterYou logo"
            className="relative h-56 w-auto object-contain"
          />
        </div>
      </div>

    

      {/* MENU */}
      <nav className="flex-1 px-6 space-y-3">
        <Item active={active} id="dashboard" Icon={LayoutDashboard} label="Dashboard" />
        <Item active={active} id="nutrition" Icon={Utensils} label="Nutrition" />
        <Item active={active} id="training" Icon={Dumbbell} label="Training" />
        <Item active={active} id="profile" Icon={User} label="Profile" />
      </nav>

      {/* DIVIDER */}
      <div className="my-5 mx-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* LOGOUT */}
      <div className="px-6 pb-6">
        <button
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10
                     bg-white/0 hover:bg-white/6 hover:border-[#f7ff00]/20
                     transition-all duration-200 hover:-translate-y-[1px]
                     hover:shadow-[0_0_18px_rgba(247,255,0,0.08)]"
        >
          <div className="h-10 w-10 rounded-2xl bg-white/5 flex items-center justify-center
                          group-hover:bg-white/8 transition-all">
            <LogOut size={18} className="text-white/80 group-hover:text-white" />
          </div>
          <span className="font-semibold tracking-wide">Log out</span>
        </button>
      </div>
    </aside>
  );
}
