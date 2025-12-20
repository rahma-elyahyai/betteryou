import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditPlanModal = ({ program, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nutritionName: program.nutritionName,
    objective: program.objective,
    description: program.description,
    caloriesPerDay: program.caloriesPerDay,
    startDate: program.startDate,
    endDate: program.endDate
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-lime-400">Edit Nutrition Plan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              value={formData.nutritionName}
              onChange={(e) => setFormData({...formData, nutritionName: e.target.value})}
              className="w-full p-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-lime-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Objective
            </label>
            <input
              type="text"
              value={formData.objective}
              onChange={(e) => setFormData({...formData, objective: e.target.value})}
              className="w-full p-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-lime-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-lime-400 focus:outline-none"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Daily Calories Target
            </label>
            <input
              type="number"
              value={formData.caloriesPerDay}
              onChange={(e) => setFormData({...formData, caloriesPerDay: e.target.value})}
              className="w-full p-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-lime-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-lime-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-lime-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanModal;