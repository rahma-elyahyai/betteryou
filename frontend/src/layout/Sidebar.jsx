import React from "react";
import { User, Home, Apple, Dumbbell, LogOut } from "lucide-react";
import logo from "../assets/betteryou-logo.svg";

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  // classes pour les boutons du menu à gauche
  const navButtonClasses = (page) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#D6F93D] transition-colors ${
      activePage === page
        ? "bg-[#D6F93D] text-black"
        : "text-white hover:bg-[#D6F93D] hover:text-black"
    }`;

  return (
    <div className="w-64 bg-[#2C0E4E] p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-1 flex items-center justify-center">
        <img src={logo} alt="BetterYou" className="w-90 h-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => onNavigate("dashboard")}
          className={navButtonClasses("dashboard")}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate("nutrition")}
          className={navButtonClasses("nutrition")}
        >
          <Apple className="w-5 h-5" />
          <span className="font-medium">Nutrition</span>
        </button>

        <button
          onClick={() => onNavigate("training")}
          className={navButtonClasses("training")}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="font-medium">Training</span>
        </button>

        <button
          onClick={() => onNavigate("profile")}
          className={navButtonClasses("profile")}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </button>
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white border border-[#D6F93D] transition-colors mt-auto hover:bg-red-600"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Log out</span>
      </button>
    </div>
  );
}
