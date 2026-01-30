import React from "react";
import { useNavigate } from "react-router-dom";

export default function GenerateProgramPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] text-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-white"
        >
          ← Back
        </button>

        <h1 className="mt-8 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500">
          Generate Program
        </h1>

        <p className="mt-3 text-gray-400">
          This is the generate page. (AI + optional infos)
        </p>
      </div>
    </div>
  );
}
