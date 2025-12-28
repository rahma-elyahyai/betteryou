// TrainingLayout.jsx
import React, { useState } from "react";
import WorkoutCatalog from "./WorkoutCatalog";
import MyProgramsSection from "./MyProgramsSection";

export default function TrainingLayout() {
  const [activeTab, setActiveTab] = useState("training");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Tabs */}
      <div className="flex justify-center gap-4 px-6 pt-8">
        <button
          className={`px-8 py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-200 ${
            activeTab === "training"
              ? "bg-[#D6F93D] text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => setActiveTab("training")}
        >
          Training
        </button>
        <button
          className={`px-8 py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-200 ${
            activeTab === "programs"
              ? "bg-[#D6F93D] text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => setActiveTab("programs")}
        >
          My Programs
        </button>
      </div>

      {/* Content */}
      {activeTab === "training" ? (
        <WorkoutCatalog />
      ) : (
        <MyProgramsSection userId={1} />
      )}
    </div>
  );
}