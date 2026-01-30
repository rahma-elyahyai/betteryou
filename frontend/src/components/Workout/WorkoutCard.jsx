
// WorkoutCard.jsx
import React from "react";

const WorkoutCard = ({ workout, onMoreClick }) => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-lime-500/20 transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={workout.imageUrl}
          alt={workout.title}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-80" />
        
        {/* Level Badge */}
        {workout.level && (
          <div className="absolute top-4 right-4 bg-lime-400 text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            {workout.level}
          </div>
        )}

        {/* Duration Badge */}
        {workout.duration && (
          <div className="absolute top-4 left-4 bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
            {workout.duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white font-bold text-xl mb-3 group-hover:text-lime-400 transition-colors duration-300">
          {workout.title}
        </h3>
        
        <div className="mb-4">
          <div className="text-gray-500 text-xs uppercase tracking-wide mb-1">Target Muscles</div>
          <p className="text-gray-400 text-sm">
            {workout.targetMuscles}
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => {
            console.log("More clicked for id =", workout.id);
            onMoreClick && onMoreClick(workout.id);
          }}
          className="mt-4 w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-lime-500/50 transform hover:scale-105"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;