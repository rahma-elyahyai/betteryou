import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  fetchSessionTypes,
  fetchEquipmentOptions,
  fetchMuscles,
  searchExercises,
} from "../../api/Workout/programWizardApi";

import { createProgram } from "../../api/Workout/programApi";
import GenerateProgramModal from "./GenerateProgramModal";

/* =========================
   STEP 1
========================= */
function Step1_Configuration({ programData, setProgramData, setCurrentStep, days }) {
  const toggleDay = (day) => {
    setProgramData((p) => {
      const selected = new Set(p.trainingDays);
      if (selected.has(day)) selected.delete(day);
      else selected.add(day);

      const trainingDays = Array.from(selected);

      // keep sessions map synced with selected days
      const nextSessions = { ...(p.sessions || {}) };

      trainingDays.forEach((d) => {
        if (!nextSessions[d]) nextSessions[d] = { muscles: [], exercises: [] };
      });
      Object.keys(nextSessions).forEach((d) => {
        if (!trainingDays.includes(d)) delete nextSessions[d];
      });

      return { ...p, trainingDays, sessions: nextSessions };
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#d4ff00] mb-2 flex items-center gap-2">
          <span>📋</span> Program Information
        </h2>
        <p className="text-gray-400 text-sm">Define your program basics</p>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">
          Program Name *
        </label>
        <input
          type="text"
          value={programData.programName}
          onChange={(e) => setProgramData((p) => ({ ...p, programName: e.target.value }))}
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-[#d4ff00] outline-none transition-all"
          placeholder="e.g., Summer Shred 2025"
        />
        <p className="text-gray-500 text-xs mt-1">
          {programData.programName.length}/100 characters
        </p>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">
          Description
        </label>
        <textarea
          value={programData.description}
          onChange={(e) => setProgramData((p) => ({ ...p, description: e.target.value }))}
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-[#d4ff00] outline-none transition-all resize-none"
          placeholder="Describe your program goals and approach..."
          rows={4}
        />
        <p className="text-gray-500 text-xs mt-1">
          {programData.description.length}/255 characters
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#d4ff00] mb-4 flex items-center gap-2">
          <span>🎯</span> Main Objective *
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "LOSE_WEIGHT", label: "Lose Weight", icon: "🔥", desc: "Reduce body fat" },
            { id: "MAINTAIN", label: "Maintain", icon: "⚖️", desc: "Maintain current weight" },
            { id: "GAIN_MASS", label: "Gain Mass", icon: "💪", desc: "Build lean muscle mass" },
          ].map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => setProgramData((p) => ({ ...p, goal: goal.id }))}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                programData.goal === goal.id
                  ? "bg-[#d4ff00]/20 border-[#d4ff00] shadow-lg shadow-[#d4ff00]/20"
                  : "bg-gray-900 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="text-2xl mb-2">{goal.icon}</div>
              <div className="font-bold text-white mb-1">{goal.label}</div>
              <div className="text-sm text-gray-400">{goal.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#d4ff00] mb-4 flex items-center gap-2">
          <span>📅</span> Program Duration *
        </h2>
        
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            Start Date *
          </label>
          <input
            type="date"
            value={programData.startDate || ""}
            onChange={(e) =>
              setProgramData((p) => ({ ...p, startDate: e.target.value }))
            }
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-[#d4ff00] outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">
            Session Duration
          </label>
          <input
            type="number"
            value={programData.sessionDuration}
            onChange={(e) =>
              setProgramData((p) => ({
                ...p,
                sessionDuration: Number(e.target.value),
              }))
            }
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-[#d4ff00] outline-none transition-all"
          />
          <input
            type="range"
            min="30"
            max="120"
            value={programData.sessionDuration}
            onChange={(e) =>
              setProgramData((p) => ({
                ...p,
                sessionDuration: Number(e.target.value),
              }))
            }
            className="w-full mt-3 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#d4ff00]"
          />
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
            <span>30 min</span>
            <span className="text-[#d4ff00] font-bold text-lg">{programData.sessionDuration} min/session</span>
            <span>120 min</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#d4ff00] mb-4 flex items-center gap-2">
          <span>📆</span> Training Days *
        </h2>

        <div className="grid grid-cols-4 gap-3 mb-2">
          {days.slice(0, 4).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-3 rounded-xl font-bold transition-all border-2 ${
                programData.trainingDays.includes(day)
                  ? "bg-[#d4ff00]/20 border-[#d4ff00] text-[#d4ff00] shadow-lg shadow-[#d4ff00]/20"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {days.slice(4).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-3 rounded-xl font-bold transition-all border-2 ${
                programData.trainingDays.includes(day)
                  ? "bg-[#d4ff00]/20 border-[#d4ff00] text-[#d4ff00] shadow-lg shadow-[#d4ff00]/20"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <p className="text-gray-400 text-sm mt-3">
          {programData.trainingDays.length} day(s) selected
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          disabled={!programData.programName || programData.trainingDays.length === 0 || !programData.goal}
          className="flex-1 bg-[#d4ff00] hover:bg-[#c2ed00] disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:transform-none shadow-lg shadow-[#d4ff00]/30"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

/* =========================
   STEP 2
========================= */
function Step2_Preferences({
  sessionTypes,
  equipmentOptions,
  loadingMeta,
  error,
  programData,
  setProgramData,
  setCurrentStep,
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#d4ff00] mb-2 flex items-center gap-2">
          <span>🏋️</span> Session Type *
        </h2>
        <p className="text-gray-400 text-sm">Choose your training style</p>
      </div>

      {loadingMeta && <p className="text-[#d4ff00]">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-3 gap-4">
        {sessionTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setProgramData((p) => ({ ...p, sessionType: type.id }))}
            className={`p-6 rounded-xl transition-all border-2 ${
              programData.sessionType === type.id
                ? "bg-[#d4ff00]/20 border-[#d4ff00] shadow-lg shadow-[#d4ff00]/20"
                : "bg-gray-900 border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="text-4xl mb-2">{type.icon}</div>
            <div className="text-white font-bold">{type.label}</div>
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#d4ff00] mb-2 flex items-center gap-2">
          <span>💼</span> Equipment Available *
        </h2>
        <p className="text-gray-400 text-sm">Select what you have access to</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {equipmentOptions.map((equip) => (
          <button
            key={equip.id}
            type="button"
            onClick={() => setProgramData((p) => ({ ...p, equipment: equip.id }))}
            className={`p-6 rounded-xl transition-all border-2 ${
              programData.equipment === equip.id
                ? "bg-[#d4ff00]/20 border-[#d4ff00] shadow-lg shadow-[#d4ff00]/20"
                : "bg-gray-900 border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="text-4xl mb-2">{equip.icon}</div>
            <div className="text-white font-bold">{equip.label}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          disabled={!programData.sessionType || !programData.equipment}
          className="flex-1 bg-[#d4ff00] hover:bg-[#c2ed00] disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:transform-none shadow-lg shadow-[#d4ff00]/30"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

/* =========================
   STEP 3
========================= */
function Step3_TargetMuscles({
  muscles,
  loadingMeta,
  programData,
  setProgramData,
  setCurrentStep,
  activeDay,
  setActiveDay,
}) {
  const selectedMuscles = programData.sessions?.[activeDay]?.muscles || [];

  const toggleMuscle = (muscle) => {
    const next = selectedMuscles.includes(muscle)
      ? selectedMuscles.filter((m) => m !== muscle)
      : [...selectedMuscles, muscle];

    setProgramData((p) => ({
      ...p,
      sessions: {
        ...p.sessions,
        [activeDay]: {
          ...(p.sessions?.[activeDay] || { muscles: [], exercises: [] }),
          muscles: next,
        },
      },
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#d4ff00] mb-2 flex items-center gap-2">
          <span>💪</span> Target Muscles - {activeDay}
        </h2>
        <p className="text-gray-400 text-sm">Select muscles to focus on this day</p>
      </div>

      {/* ✅ day switcher */}
      <div className="flex gap-2 flex-wrap">
        {programData.trainingDays.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeDay === d 
                ? "bg-[#d4ff00] text-gray-900 shadow-lg" 
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loadingMeta && <p className="text-[#d4ff00]">Loading muscles...</p>}

      <div className="grid grid-cols-2 gap-4">
        {muscles.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => toggleMuscle(m)}
            className={`py-4 px-4 rounded-xl font-bold transition-all border-2 ${
              selectedMuscles.includes(m)
                ? "bg-[#d4ff00]/20 border-[#d4ff00] text-[#d4ff00] shadow-lg shadow-[#d4ff00]/20"
                : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          disabled={selectedMuscles.length === 0}
          className="flex-1 bg-[#d4ff00] hover:bg-[#c2ed00] disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:transform-none shadow-lg shadow-[#d4ff00]/30"
        >
          Choose Exercises →
        </button>
      </div>
    </div>
  );
}

/* =========================
   STEP 4
========================= */
function Step4_SelectExercises({
  programData,
  setProgramData,
  setCurrentStep,
  activeDay,
  setActiveDay,
  exerciseCatalog,
  loadingExercises,
  error,
}) {
  const selectedMuscles = programData.sessions?.[activeDay]?.muscles || [];
  const selectedExercises = programData.sessions?.[activeDay]?.exercises || [];

  const isSelected = (id) => selectedExercises.some((x) => x.idExercise === id);

  const toggleExercise = (ex) => {
    setProgramData((p) => {
      const dayData = p.sessions?.[activeDay] || { muscles: [], exercises: [] };
      const current = dayData.exercises || [];

      const already = current.some((x) => x.idExercise === ex.id);
      const next = already
        ? current.filter((x) => x.idExercise !== ex.id)
        : [
            ...current,
            {
              idExercise: ex.id,
              exerciseName: ex.name,
              sets: 3,
              reps: 12,
              restSeconds: 60,
              orderInSession: current.length + 1,
            },
          ];

      return {
        ...p,
        sessions: {
          ...p.sessions,
          [activeDay]: {
            ...dayData,
            exercises: next,
          },
        },
      };
    });
  };

  const [editingId, setEditingId] = useState(null);
  const editingExercise = selectedExercises.find((x) => x.idExercise === editingId) || null;

  const updateEditing = (patch) => {
    setProgramData((p) => {
      const dayData = p.sessions?.[activeDay] || { muscles: [], exercises: [] };
      const current = dayData.exercises || [];
      const next = current.map((x) => (x.idExercise === editingId ? { ...x, ...patch } : x));

      return {
        ...p,
        sessions: {
          ...p.sessions,
          [activeDay]: {
            ...dayData,
            exercises: next,
          },
        },
      };
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#d4ff00] mb-2 flex items-center gap-2">
          <span>🏃</span> Select Exercises - {activeDay}
        </h2>
        <p className="text-gray-400 text-sm">
          {selectedMuscles.join(", ")} • {programData.sessionType} • {programData.equipment}
        </p>
      </div>

      {/* ✅ day switcher */}
      <div className="flex gap-2 flex-wrap">
        {programData.trainingDays.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeDay === d 
                ? "bg-[#d4ff00] text-gray-900 shadow-lg" 
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loadingExercises && <p className="text-[#d4ff00]">Loading exercises...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {editingExercise && (
        <div className="bg-gray-900 p-5 rounded-xl border-2 border-[#d4ff00] space-y-4 shadow-lg shadow-[#d4ff00]/20">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">{editingExercise.exerciseName}</h3>
            <button 
              type="button" 
              onClick={() => setEditingId(null)} 
              className="text-gray-400 hover:text-white transition-all"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-2">Sets</label>
              <input
                type="number"
                value={editingExercise.sets}
                onChange={(e) => updateEditing({ sets: Number(e.target.value) })}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-[#d4ff00] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-2">Reps</label>
              <input
                type="number"
                value={editingExercise.reps}
                onChange={(e) => updateEditing({ reps: Number(e.target.value) })}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-[#d4ff00] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-2">Rest (s)</label>
              <input
                type="number"
                value={editingExercise.restSeconds}
                onChange={(e) => updateEditing({ restSeconds: Number(e.target.value) })}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-[#d4ff00] outline-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-white font-semibold mb-4 text-lg">Add Exercises</h3>

        <div className="grid grid-cols-2 gap-3">
          {exerciseCatalog.map((ex) => {
            const selected = isSelected(ex.id);

            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => {
                  if (selected) setEditingId(ex.id);
                  else toggleExercise(ex);
                }}
                className={`text-left px-4 py-4 rounded-xl transition-all font-semibold border-2 ${
                  selected
                    ? "bg-[#d4ff00]/20 border-[#d4ff00] text-[#d4ff00] shadow-lg shadow-[#d4ff00]/20"
                    : "bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                {selected ? "✓ " : "+ "}
                {ex.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(5)}
          disabled={selectedExercises.length === 0}
          className="flex-1 bg-[#d4ff00] hover:bg-[#c2ed00] disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:transform-none shadow-lg shadow-[#d4ff00]/30"
        >
          ✓ Save Session
        </button>
      </div>
    </div>
  );
}

/* =========================
   STEP 5
========================= */
function Step5_Summary({ programData, setCurrentStep, saving, onSave }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#d4ff00] mb-2 flex items-center gap-2">
          <span>📊</span> Program Summary
        </h2>
        <p className="text-gray-400 text-sm">Review your program before saving</p>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
        <h3 className="text-white font-bold text-xl mb-3">{programData.programName}</h3>
        <p className="text-gray-400 text-sm mb-4">{programData.description}</p>
        
        <div className="space-y-2 text-sm">
          <p className="text-gray-400">
            <span className="text-[#d4ff00] font-semibold">Goal:</span> {programData.goal}
          </p>
          <p className="text-gray-400">
            <span className="text-[#d4ff00] font-semibold">Duration:</span> {programData.sessionDuration} min/session
          </p>
          <p className="text-gray-400">
            <span className="text-[#d4ff00] font-semibold">Training Days:</span> {programData.trainingDays.join(", ")}
          </p>
          <p className="text-gray-400">
            <span className="text-[#d4ff00] font-semibold">Session Type:</span> {programData.sessionType}
          </p>
          <p className="text-gray-400">
            <span className="text-[#d4ff00] font-semibold">Equipment:</span> {programData.equipment}
          </p>
        </div>
      </div>

      <div className="bg-[#d4ff00]/10 border border-[#d4ff00]/30 rounded-xl p-4">
        <p className="text-[#d4ff00] text-sm font-semibold">
          💡 Next Step: After saving, you can start tracking your progress and modify your program as needed.
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all"
        >
          ← Edit
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex-1 bg-[#d4ff00] hover:bg-[#c2ed00] disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:transform-none shadow-lg shadow-[#d4ff00]/30"
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            "🏋️ Save Program"
          )}
        </button>
      </div>

      <p className="text-gray-500 text-sm text-center">
        * All fields have been completed
      </p>
    </div>
  );
}

/* =========================
   MAIN
========================= */
const CreateProgramWizard = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [sessionTypes, setSessionTypes] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [exerciseCatalog, setExerciseCatalog] = useState([]);

  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [openGenerate, setOpenGenerate] = useState(false);

  const [programData, setProgramData] = useState({
    programName: "",
    description: "",
    goal: "",
    generationType: "MANUAL",
    sessionDuration: 60,
    trainingDays: [],
    sessionType: "",
    equipment: "",
    sessions: {}, // { Mon: { muscles:[], exercises:[] }, Tue: ... }
    startDate: null,
    endDate: null,
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ✅ active day (fixes "only first day edited" issue)
  const [activeDay, setActiveDay] = useState("Mon");

  useEffect(() => {
    if (programData.trainingDays?.length) {
      setActiveDay(programData.trainingDays[0]);
    }
  }, [programData.trainingDays]);

  useEffect(() => {
    if (!programData.startDate) return;

    const start = new Date(programData.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    setProgramData((p) => ({
      ...p,
      endDate: end.toISOString().split("T")[0],
    }));
  }, [programData.startDate]);

  // ✅ load metadata once
  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoadingMeta(true);
        setError(null);

        const [types, equip, mus] = await Promise.all([
          fetchSessionTypes(),
          fetchEquipmentOptions(),
          fetchMuscles(),
        ]);

        if (ignore) return;
        setSessionTypes(types || []);
        setEquipmentOptions(equip || []);
        setMuscles(mus || []);
      } catch (err) {
        if (!ignore) setError("Failed to load metadata.");
        console.error(err);
      } finally {
        if (!ignore) setLoadingMeta(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const selectedMusclesKey = useMemo(() => {
    const mus = programData.sessions?.[activeDay]?.muscles || [];
    return mus.slice().sort().join("|");
  }, [programData.sessions, activeDay]);

  // ✅ load exercises when step 4 + filters
  useEffect(() => {
    if (currentStep !== 4) return;
    if (!programData.sessionType) return;

    const selectedMuscles = programData.sessions?.[activeDay]?.muscles || [];

    let ignore = false;

    (async () => {
      try {
        setLoadingExercises(true);
        setError(null);

        const list = await searchExercises({
          category: programData.sessionType,
          equipment: programData.equipment,
          muscles: selectedMuscles,
        });

        if (!ignore) setExerciseCatalog(Array.isArray(list) ? list : []);
      } catch (err) {
        if (!ignore) setError("Failed to load exercises.");
        console.error(err);
      } finally {
        if (!ignore) setLoadingExercises(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [currentStep, programData.sessionType, programData.equipment, activeDay, selectedMusclesKey]);

  // ✅ Save program -> POST /api/programs?userId=1
  const handleSaveProgram = async () => {
    const userId = 1; // TODO: replace with real logged user id

    try {
      setSaving(true);

      // ✅ payload matches ExercisePickDto expected by backend
      const payload = {
        programName: programData.programName,
        description: programData.description,
        goal: programData.goal,
        generationType: programData.generationType,
        startDate: programData.startDate,
        endDate: programData.endDate,
        sessions: programData.trainingDays.map((day) => {
          const sessionData = programData.sessions?.[day] || { muscles: [], exercises: [] };

          return {
            sessionType: programData.sessionType,
            durationMinutes: programData.sessionDuration,
            dayLabel: day,
            targetMuscles: sessionData.muscles || [],
            exercises: (sessionData.exercises || []).map((ex) => ({
              idExercise: ex.idExercise,
              sets: ex.sets,
              reps: ex.reps,
              restSeconds: ex.restSeconds,
              orderInSession: ex.orderInSession,
            })),
          };
        }),
      };

      console.log("📤 Sending:", payload);

      const res = await createProgram(payload, userId);
      console.log("✅ Created:", res);

      alert(`✅ Program created! id=${res?.programId}`);
      // optional reset:
      // setCurrentStep(1);
      // setProgramData({ ...initialState });
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("❌ Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const totalSteps = 5;

  const stepTitles = [
    "Configuration",
    "Preferences",
    "Target Muscles",
    "Select Exercises",
    "Summary"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-all"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🏆</span>
            <h1 className="text-4xl font-bold text-[#d4ff00]">Create Program</h1>
          </div>
          <p className="text-gray-400">Design your personalized workout program</p>

          <div className="flex justify-center gap-2 mt-6 mb-3">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-1.5 w-16 rounded-full transition-all ${
                  step < currentStep 
                    ? "bg-green-500" 
                    : step === currentStep 
                      ? "bg-[#d4ff00]" 
                      : "bg-gray-700"
                }`}
              />
            ))}
          </div>

          <p className="text-gray-400 text-sm">
            Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}
          </p>
        </div>

        {/* Quick Actions Banner */}
        {currentStep === 1 && (
          <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="text-white font-semibold">Want AI to do it for you?</p>
                <p className="text-gray-400 text-sm">Generate a program based on your profile</p>
              </div>
            </div>
            <button
              //onClick={() => alert("Auto-generate feature coming soon!")}
              onClick={() => {
              console.log("hi rahma");
              setOpenGenerate(true);
            }}
              className="px-6 py-2 bg-[#d4ff00] hover:bg-[#c2ed00] text-gray-900 font-semibold rounded-lg transition-all"
            >
              Auto-Generate
            </button>
            <GenerateProgramModal
              open={openGenerate}
              onClose={() => setOpenGenerate(false)}
            />
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-xl">
          {currentStep === 1 && (
            <Step1_Configuration
              programData={programData}
              setProgramData={setProgramData}
              setCurrentStep={setCurrentStep}
              days={days}
            />
          )}

          {currentStep === 2 && (
            <Step2_Preferences
              sessionTypes={sessionTypes}
              equipmentOptions={equipmentOptions}
              loadingMeta={loadingMeta}
              error={error}
              programData={programData}
              setProgramData={setProgramData}
              setCurrentStep={setCurrentStep}
            />
          )}

          {currentStep === 3 && (
            <Step3_TargetMuscles
              muscles={muscles}
              loadingMeta={loadingMeta}
              programData={programData}
              setProgramData={setProgramData}
              setCurrentStep={setCurrentStep}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
            />
          )}

          {currentStep === 4 && (
            <Step4_SelectExercises
              programData={programData}
              setProgramData={setProgramData}
              setCurrentStep={setCurrentStep}
              activeDay={activeDay}
              setActiveDay={setActiveDay}
              exerciseCatalog={exerciseCatalog}
              loadingExercises={loadingExercises}
              error={error}
            />
          )}

          {currentStep === 5 && (
            <Step5_Summary
              programData={programData}
              setCurrentStep={setCurrentStep}
              saving={saving}
              onSave={handleSaveProgram}
            />
          )}
        </div>

        {/* Info Box at bottom */}
        {currentStep === 5 && (
          <div className="mt-6 bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <p className="text-gray-400 text-sm">
              <span className="text-[#d4ff00] font-semibold">💡 Tip:</span> Once saved, 
              you can track your progress and modify exercises as you progress through your program.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProgramWizard;