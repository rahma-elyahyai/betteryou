import React from "react";
import PersonalInfoSection from "../components/profile/PersonalInfoSection.jsx";
import Sidebar from "@/layout/Sidebar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,249,61,0.10),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(214,249,61,0.10),transparent_40%)]" />
      <div className="absolute inset-0 opacity-20 bg-[url('/src/assets/noise.png')] bg-repeat" />

      {/* Sidebar */}
      <Sidebar 
        active="profile"
        onLogout={() => {
          localStorage.removeItem("token");
          console.log("logout");
        }}
      />

      {/* Main content */}
      <div className="relative flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-6 md:py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <PersonalInfoSection />
        </div>
      </div>
    </div>
  );
}