
// WorkoutDetailModal.jsx
import React from "react";

const WorkoutDetailModal = ({ detail, onClose }) => {
  if (!detail) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Container avec padding pour l'espace */}
      <div className="min-h-screen flex items-center justify-center p-4">
        
        <div className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl my-8">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="sticky top-6 left-full -ml-6 z-10 bg-lime-400 hover:bg-lime-500 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-lime-400 text-4xl font-bold mb-2">DETAIL</h2>
            </div>

            {/* Image */}
            <div className="relative h-80 rounded-xl overflow-hidden mb-8">
              <img
                src={detail.imageUrl}
                alt={detail.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>

            {/* Exercise Overview */}
            <div className="mb-8">
              <h3 className="text-lime-400 text-2xl font-bold mb-4">Exercise Overview</h3>
              <h4 className="text-white text-xl font-semibold mb-3">{detail.title}</h4>
              <p className="text-gray-400 leading-relaxed">
                {detail.overview}
              </p>
            </div>

            {/* Key Benefits */}
            {detail.benefits && detail.benefits.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lime-400 text-2xl font-bold mb-4">Key Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detail.benefits.map((benefit, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-4">
                      <p className="text-gray-300 leading-relaxed">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-Step Instructions */}
            {detail.steps && detail.steps.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lime-400 text-2xl font-bold mb-4">Step-by-Step Instructions</h3>
                <div className="space-y-4">
                  {detail.steps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-lime-400 text-gray-900 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-gray-800/30 rounded-lg p-4">
                        <p className="text-gray-300 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailModal;
