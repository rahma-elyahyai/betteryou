// WorkoutDetailModal.jsx
import React from "react";

const WorkoutDetailModal = ({ detail, onClose }) => {
  if (!detail) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="relative bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-lime-400 shadow-2xl shadow-lime-400/20">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-3xl text-[#D6F93D] hover:text-lime-300 hover:rotate-90 bg-transparent border-none cursor-pointer transition-all duration-300 font-bold"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Title with W icon */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#D6F93D] text-4xl font-black">W</span>
          <h2 className="text-[#D6F93D] text-3xl font-black uppercase tracking-wider">
            DETAIL
          </h2>
        </div>

        {/* Image */}
        <img
          src={detail.imageUrl}
          alt={detail.title}
          className="w-full rounded-xl mb-6 object-cover max-h-80 border-2 border-gray-700"
        />

        {/* Exercise Overview Section */}
        <div className="mb-8">
          <h4 className="text-[#D6F93D] text-2xl font-bold mb-3 uppercase tracking-wide">
            Exercise Overview
          </h4>
          <p className="text-gray-300 leading-relaxed text-base">
            {detail.overview}
          </p>
        </div>

        {/* Key Benefits Section */}
        <div className="mb-8">
          <h4 className="text-[#D6F93D] text-2xl font-bold mb-4 uppercase tracking-wide">
            Key Benefits
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detail.benefits?.map((b, i) => (
              <div
                key={i}
                className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-lime-400/50 transition-colors"
              >
                <p className="text-gray-200 text-sm leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Instructions Section */}
        <div>
          <h4 className="text-[#D6F93D] text-2xl font-bold mb-4 uppercase tracking-wide">
            Step-by-Step Instructions
          </h4>
          <div className="space-y-4">
            {detail.steps?.map((s, i) => (
              <div
                key={i}
                className="flex gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:border-lime-400/50 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-[#D6F93D] text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-gray-200 text-sm leading-relaxed flex-1">
                  {s}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailModal;