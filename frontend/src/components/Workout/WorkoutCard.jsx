// WorkoutCard.jsx
import React from "react";

const WorkoutCard = ({ workout, onMoreClick }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-lime-400 transition-all duration-300 hover:shadow-xl hover:shadow-lime-400/20 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-gray-700">
        <img
          src={workout.imageUrl}
          alt={workout.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-bold text-white mb-4">{workout.title}</h2>

        <div className="space-y-3 mb-5">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Target Muscles
            </div>
            <div className="text-sm text-gray-200">{workout.targetMuscles}</div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Duration
              </div>
              <div className="text-sm text-gray-200">{workout.duration}</div>
            </div>

            <div className="flex-1">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Level
              </div>
              <div className="text-sm text-gray-200">{workout.level}</div>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-[#D6F93D] hover:bg-lime-500 text-gray-900 font-bold py-2.5 rounded-lg transition-colors duration-200"
          onClick={() => {
            console.log("More clicked for id =", workout.id);
            onMoreClick && onMoreClick(workout.id);
          }}
        >
          More
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;

