import React, { useState } from "react";
import { X, Sparkles, Zap } from "lucide-react";

export default function GenerateProgramModal({ open, onClose, onGenerate }) {
  const [userNotes, setUserNotes] = useState("");
  const [constraints, setConstraints] = useState("");
  const [selectedObjective, setSelectedObjective] = useState("");

  if (!open) return null;

  const objectives = [
    {
      id: "weight-reduction",
      title: "Weight Reduction",
      description: "Optimize fat loss through caloric precision",
      icon: "⚖️",
    },
    {
      id: "muscle-growth",
      title: "Muscle Growth",
      description: "Maximize hypertrophy with nutrient density",
      icon: "💪",
    },
    {
      id: "maintenance",
      title: "Maintenance",
      description: "Sustain body composition & energy levels",
      icon: "⚡",
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl rounded-3xl bg-gradient-to-br from-[#0f1419] via-[#1a1f2e] to-[#0f1419] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#1a1f2e] to-[#0f1419] p-8 border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c4ff00] to-[#a8e000] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                AI Program <span className="text-[#c4ff00]">Generator</span>
              </h2>
              <p className="text-white/60 text-sm italic max-w-xl">
                Empowering your fitness journey with precision-engineered, seven-day training strategies.
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 p-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-[#c4ff00] rounded-full"></div>
                <h3 className="text-xl font-bold text-white">Configuration</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">
                    Infos (optionnel)
                  </label>
                  <textarea
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#c4ff00]/50 focus:outline-none transition-all resize-none"
                    rows={4}
                    placeholder="Ex: je veux 3 jours muscu, 2 cardio, pas de squat, je suis débutante..."
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2 uppercase tracking-wider">
                    Contraintes (optionnel)
                  </label>
                  <input
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:border-[#c4ff00]/50 focus:outline-none transition-all"
                    placeholder="Ex: matériel: haltères; temps max: 45min; douleurs genou..."
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 transition-all"
                  >
                    Annuler
                  </button>

                  <button
                    type="button"
                    onClick={() => onGenerate({ userNotes, constraints, objective: selectedObjective })}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#c4ff00] to-[#a8e000] text-black font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c4ff00]/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    Générer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Objectives */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-white/40 rounded-full"></div>
                <h3 className="text-xl font-bold text-white">Strategic Objective</h3>
              </div>

              <div className="space-y-3">
                {objectives.map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => setSelectedObjective(obj.id)}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                      selectedObjective === obj.id
                        ? "bg-gradient-to-br from-[#c4ff00]/20 to-transparent border-[#c4ff00] shadow-lg shadow-[#c4ff00]/20"
                        : "bg-gradient-to-br from-white/5 to-transparent border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        selectedObjective === obj.id ? 'bg-white/10' : 'bg-white/5'
                      }`}>
                        {obj.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-1">{obj.title}</h4>
                        <p className="text-white/50 text-sm italic">{obj.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedObjective === obj.id 
                          ? 'border-[#c4ff00] bg-[#c4ff00]' 
                          : 'border-white/20'
                      }`}>
                        {selectedObjective === obj.id && (
                          <div className="w-2 h-2 rounded-full bg-black"></div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* System Intelligence */}
            <div className="bg-gradient-to-br from-[#c4ff00]/10 to-transparent border-2 border-[#c4ff00]/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-[#c4ff00] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-[#c4ff00] font-bold text-lg mb-2">System Intelligence</h4>
                  <p className="text-white/70 text-sm leading-relaxed italic">
                    Our algorithm processes your biometric constraints to generate a bio-available 
                    program structure that ensures progressive stability across the full seven-day cycle.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}