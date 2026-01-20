// MyProgramsSection.jsx - VERSION AVEC TON CODE + NOUVEAU STYLE
import React, { useEffect, useState }

// ========================================
// CreateProgramWizard.jsx - VERSION REDESIGNÉE
// ========================================

import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, Dumbbell } from 'lucide-react';
import {
  fetchSessionTypes,
  fetchEquipmentOptions,
  fetchMuscles,
  searchExercises,
} from "../../api/Workout/programWizardApi";
import { createProgram } from "../../api/Workout/programApi";
import Sidebar from "../../../layout/Sidebar";

/* Step 1 - Configuration */
function Step1_Configuration({ programData, setProgramData, setCurrentStep, days }) {
  const toggleDay = (day) => {
    setProgramData((p) => {
      const selected = new Set(p.trainingDays);
      if (selected.has(day)) selected.delete(day);
      else selected.add(day);

      const trainingDays = Array.from(selected);
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-lime-400 mb-6">Program Configuration</h2>

      <div>
        <label className="text-gray-300 text-sm font-medium block mb-2">
          Program Name *
        </label>
        <input
          type="text"
          value={programData.programName}
          onChange={(e) => setProgramData((p) => ({ ...p, programName: e.target.value }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border-2 border-gray-700 focus:border-lime-400 outline-none transition-all"
          placeholder="Full Body Builder"
        />
      </div>

      <div>
        <label className="text-gray-300 text-sm font-medium block mb-2">
          Description
        </label>
        <textarea
          value={programData.description}
          onChange={(e) => setProgramData((p) => ({ ...p, description: e.target.value }))}
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border-2 border-gray-700 focus:border-lime-400 outline-none transition-all resize-none"
          placeholder="Describe your program goals..."
          rows={3}
        />
      </div>

      <div>
        <label className="text-gray-300 text-sm font-medium block mb-2">
          Program Goal *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "LOSE_WEIGHT", label: "Lose Weight", icon: "🔥" },
            { id: "MAINTAIN", label: "Maintain", icon: "⚖️" },
            { id: "GAIN_MASS", label: "Gain Mass", icon: "💪" },
          ].map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => setProgramData((p) => ({ ...p, goal: goal.id }))}
              className={`py-4 rounded-xl font-bold transition-all border-2 ${
                programData.goal === goal.id
                  ? "bg-lime-400 text-gray-900 border-lime-400 shadow-lg shadow-lime-400/50"
                  : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="text-3xl mb-2">{goal.icon}</div>
              <div className="text-sm">{goal.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-sm font-medium block mb-2">
          Session Duration
        </label>
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
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
        />
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">30 min</span>
          <span className="text-lime-400 font-bold text-lg">{programData.sessionDuration} min</span>
          <span className="text-gray-500">120 min</span>
        </div>
      </div>

      <div>
        <label className="text-gray-300 text-sm font-medium block mb-3">
          Training Days *
        </label>

        <div className="grid grid-cols-4 gap-3 mb-2">
          {days.slice(0, 4).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-3 rounded-xl font-bold transition-all ${
                programData.trainingDays.includes(day)
                  ? "bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 border-2 border-gray-700"
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
              className={`py-3 rounded-xl font-bold transition-all ${
                programData.trainingDays.includes(day)
                  ? "bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 border-2 border-gray-700"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-sm mt-3">
          {programData.trainingDays.length} day(s) selected
        </p>
      </div>

      <button
        type="button"
        onClick={() => setCurrentStep(2)}
        disabled={!programData.programName || programData.trainingDays.length === 0 || !programData.goal}
        className="w-full bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 text-gray-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        Continue <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

/* Step 2 - Preferences */
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-lime-400 mb-4">Session Preferences</h2>

      {loadingMeta && (
        <div className="flex items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-lime-400 rounded-full animate-spin"></div>
        </div>
      )}
      {error && <p className="text-red-400 bg-red-900/20 border border-red-500/50 rounded-lg p-3">{error}</p>}

      <div>
        <h3 className="text-white text-lg font-semibold mb-3">Session Type</h3>
        <div className="grid grid-cols-3 gap-4">
          {sessionTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setProgramData((p) => ({ ...p, sessionType: type.id }))}
              className={`p-6 rounded-xl transition-all border-2 ${
                programData.sessionType === type.id
                  ? "bg-lime-400/10 border-lime-400 shadow-lg shadow-lime-400/20"
                  : "bg-gray-800 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="text-4xl mb-2">{type.icon}</div>
              <div className="text-white font-bold text-sm">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white text-lg font-semibold mb-3">Equipment Available</h3>
        <div className="grid grid-cols-3 gap-4">
          {equipmentOptions.map((equip) => (
            <button
              key={equip.id}
              type="button"
              onClick={() => setProgramData((p) => ({ ...p, equipment: equip.id }))}
              className={`p-6 rounded-xl transition-all border-2 ${
                programData.equipment === equip.id
                  ? "bg-lime-400/10 border-lime-400 shadow-lg shadow-lime-400/20"
                  : "bg-gray-800 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="text-4xl mb-2">{equip.icon}</div>
              <div className="text-white font-bold text-sm">{equip.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          disabled={!programData.sessionType || !programData.equipment}
          className="flex-1 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Continue <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* Step 3 - Target Muscles */
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-lime-400">{activeDay}</h2>
        <p className="text-gray-400 text-sm">Select target muscles for this day</p>
      </div>

      {/* Day Switcher */}
      <div className="flex gap-2 flex-wrap">
        {programData.trainingDays.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeDay === d 
                ? "bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/50" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loadingMeta && (
        <div className="flex items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-lime-400 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {muscles.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => toggleMuscle(m)}
            className={`py-4 rounded-xl font-semibold transition-all ${
              selectedMuscles.includes(m)
                ? "bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/50"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border-2 border-gray-700"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          disabled={selectedMuscles.length === 0}
          className="flex-1 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Choose Exercises <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* Step 4 - Select Exercises */
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-lime-400">Select Exercises</h2>
        <p className="text-gray-400 text-sm">
          {selectedMuscles.join(", ")} • {programData.sessionType} • {programData.equipment} • {activeDay}
        </p>
      </div>

      {/* Day Switcher */}
      <div className="flex gap-2 flex-wrap">
        {programData.trainingDays.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActiveDay(d)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeDay === d 
                ? "bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/50" 
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loadingExercises && (
        <div className="flex items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-lime-400 rounded-full animate-spin"></div>
        </div>
      )}
      {error && <p className="text-red-400 bg-red-900/20 border border-red-500/50 rounded-lg p-3">{error}</p>}

      {/* Edit Panel */}
      {editingExercise && (
        <div className="bg-gray-800 p-4 rounded-xl border-2 border-lime-400 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold">{editingExercise.exerciseName}</h3>
            <button 
              type="button" 
              onClick={() => setEditingId(null)} 
              className="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-all"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Sets</label>
              <input
                type="number"
                value={editingExercise.sets}
                onChange={(e) => updateEditing({ sets: Number(e.target.value) })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-lime-400 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Reps</label>
              <input
                type="number"
                value={editingExercise.reps}
                onChange={(e) => updateEditing({ reps: Number(e.target.value) })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-lime-400 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Rest (s)</label>
              <input
                type="number"
                value={editingExercise.restSeconds}
                onChange={(e) => updateEditing({ restSeconds: Number(e.target.value) })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-lime-400 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <div>
        <h3 className="text-white font-semibold mb-3">Available Exercises</h3>
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
                className={`text-left px-4 py-3 rounded-xl transition-all ${
                  selected
                    ? "bg-lime-400/10 text-white border-2 border-lime-400"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 border-2 border-gray-700"
                }`}
              >
                {selected ? "✓ " : "+ "}
                {ex.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(5)}
          disabled={selectedExercises.length === 0}
          className="flex-1 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Save Session <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

/* Step 5 - Summary */
function Step5_Summary({ programData, setCurrentStep, saving, onSave }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-lime-400 mb-6">Program Summary</h2>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h3 className="text-white font-bold text-xl mb-2">{programData.programName}</h3>
        <p className="text-gray-400 text-sm mb-3">{programData.description}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="text-gray-500 text-xs uppercase mb-1">Goal</div>
            <div className="text-white font-semibold">{programData.goal}</div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded-lg">
            <div className="text-gray-500 text-xs uppercase mb-1">Duration</div>
            <div className="text-white font-semibold">{programData.sessionDuration} min/session</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-gray-500 text-xs uppercase mb-1">Training Days</div>
          <div className="flex gap-2 flex-wrap">
            {programData.trainingDays.map(day => (
              <span key={day} className="px-3 py-1 bg-lime-400/20 text-lime-400 rounded-full text-sm font-semibold">
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Edit
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex-1 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Dumbbell className="w-5 h-5" />
              Save Program
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* Main Wizard */
const CreateProgramWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionTypes, setSessionTypes] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [exerciseCatalog, setExerciseCatalog] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [programData, setProgramData] = useState({
    programName: "",
    description: "",
    goal: "",
    generationType: "MANUAL",
    sessionDuration: 60,
    trainingDays: [],
    sessionType: "",
    equipment: "",
    sessions: {},
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [activeDay, setActiveDay] = useState("Mon");

  useEffect(() => {
    if (programData.trainingDays?.length) {
      setActiveDay(programData.trainingDays[0]);
    }
  }, [programData.trainingDays]);

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

  const handleSaveProgram = async () => {
    const userId = 1;

    try {
      setSaving(true);

      const payload = {
        programName: programData.programName,
        description: programData.description,
        goal: programData.goal,
        generationType: programData.generationType,
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
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("❌ Save failed: " + err.message);
     from "react";
import { Calendar, Dumbbell, Plus } from 'lucide-react';
import { fetchUserPrograms } from "../../api/Workout/programApi";
import SessionDetailModal from "./SessionDetailModal";
import Sidebar from "../../../layout/Sidebar";

export default function MyProgramsSection({ userId = 1 }) {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUserPrograms(userId);
        console.log("API programs data =", data);
        setPrograms(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Erreur chargement programmes", e);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const list = Array.isArray(programs) ? programs : [];

  const activePrograms = list.filter((p) => p.status === "ONGOING").length;
  const completedSessions = list.reduce(
    (sum, p) => sum + (p.completedSessions || 0),
    0
  );
  const totalHours = list.reduce((sum, p) => sum + (p.totalHours || 0), 0);
  const avgProgress =
    list.length === 0
      ? 0
      : Math.round(
          list.reduce((s, p) => s + (p.progressPercent || 0), 0) / list.length
        );

  // ✅ Empty State (nouveau)
  const EmptyState = () => (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a]">
      <Sidebar active="workout" />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-lime-400/10 rounded-full flex items-center justify-center">
            <Dumbbell className="w-16 h-16 text-lime-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">No Programs Yet</h2>
          <p className="text-gray-400 mb-8 max-w-md">
            Start your fitness journey by creating your first personalized workout program
          </p>
          <button 
            className="px-8 py-3 bg-lime-400 hover:bg-lime-500 text-gray-900 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
            onClick={() => window.location.href = '/create-workout'}
          >
            <Plus className="w-5 h-5" />
            Create New Program
          </button>
        </div>
      </div>
    </div>
  );

  // ✅ Loading State (nouveau)
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a]">
        <Sidebar active="workout" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 border-4 border-gray-800 border-t-lime-400 rounded-full animate-spin"></div>
            <p className="text-gray-400 text-base mt-6 font-medium">Loading your programs...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Empty check (nouveau)
  if (list.length === 0) {
    return <EmptyState />;
  }

  // ✅ CHANGEMENT ICI : Nouveau layout avec Sidebar
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B0B12] via-[#1a1625] to-[#0f0f1a]">
      <Sidebar active="workout" />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* ✅ CHANGEMENT : Nouveau Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-lime-400">My Workout Programs</h1>
              <button
                onClick={() => window.location.href = '/workout'}
                className="px-6 py-3 bg-gray-800 hover:bg-lime-400 text-lime-400 hover:text-gray-900 font-semibold rounded-xl border-2 border-gray-700 hover:border-lime-400 transition-all flex items-center gap-2"
              >
                <Dumbbell className="w-5 h-5" />
                Workout Catalog
              </button>
            </div>
          </div>

          {/* ✅ CHANGEMENT : Stats Grid avec nouveau style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 uppercase mb-1">Active Programs</div>
              <div className="text-3xl font-bold text-lime-400">{activePrograms}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 uppercase mb-1">Completed Sessions</div>
              <div className="text-3xl font-bold text-lime-400">{completedSessions}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 uppercase mb-1">Total Hours</div>
              <div className="text-3xl font-bold text-lime-400">{totalHours.toFixed(1)}</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <div className="text-xs text-gray-500 uppercase mb-1">Avg Progress</div>
              <div className="text-3xl font-bold text-lime-400">{avgProgress}%</div>
            </div>
          </div>

          {/* ✅ CHANGEMENT : Programs List avec espace réduit */}
          <div className="space-y-4">
            {list.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgramCard({ program }) {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  return (
    <>
      {/* ✅ CHANGEMENT : Nouveau style de card */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-700 hover:border-lime-400/50 transition-all">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{program.name}</h2>
            <p className="text-sm text-gray-400">
              {program.goal} · {program.generationType}
            </p>
          </div>
          {/* ✅ CHANGEMENT : Badge status avec lime-400 */}
          <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
            program.status === 'ONGOING' 
              ? 'bg-lime-400 text-gray-900' 
              : 'bg-gray-700 text-gray-300'
          }`}>
            {program.status}
          </span>
        </div>

        {program.description && (
          <p className="text-gray-400 text-sm mb-4">{program.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Overall Progress</span>
            {/* ✅ CHANGEMENT : lime-400 au lieu de [#D6F93D] */}
            <span className="text-lime-400 font-semibold">
              {Math.round(program.progressPercent || 0)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            {/* ✅ CHANGEMENT : lime-400 + shadow */}
            <div
              className="bg-lime-400 h-3 rounded-full transition-all duration-300 shadow-lg shadow-lime-400/50"
              style={{ width: `${program.progressPercent || 0}%` }}
            />
          </div>
        </div>

        {/* ✅ CHANGEMENT : Info Grid avec nouveau style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-500 uppercase mb-1">Goal</div>
            <div className="text-sm text-gray-200">{program.goal}</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-500 uppercase mb-1">Sessions Completed</div>
            <div className="text-sm text-gray-200">
              {program.completedSessions} / {program.totalSessions}
            </div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <div className="text-xs text-gray-500 uppercase mb-1">Next Session</div>
            <div className="text-sm text-gray-200">
              {program.nextSessionDate || "—"}
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-3">Recent Sessions</h3>
          {/* ✅ CHANGEMENT : ul → div avec space-y-2 */}
          <div className="space-y-2">
            {program.recentSessions?.length ? (
              program.recentSessions.map((s) => {
                const sid = s.id ?? s.sessionId ?? s.id_session ?? s.workoutSessionId;

                return (
                  <div
                    key={sid ?? `${s.date}-${s.title}`}
                    onClick={() => {
                      console.log("clicked session =", s);
                      console.log("sid =", sid);
                      if (!sid) return;
                      setSelectedSessionId(sid);
                    }}
                    {/* ✅ CHANGEMENT : Nouveau style hover avec lime-400 */}
                    className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 border border-transparent hover:border-lime-400/40 transition-all group"
                  >
                    <span className="text-sm text-gray-500">{s.date}</span>
                    <span className="text-sm text-gray-200 flex-1 mx-4 font-medium">{s.title}</span>
                    {/* ✅ CHANGEMENT : Badge avec hover lime */}
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700 group-hover:bg-lime-400 text-gray-300 group-hover:text-gray-900 transition-all">
                      View →
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-400 p-4 text-center bg-gray-800/30 rounded-lg">
                No sessions yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de détails de session */}
      {selectedSessionId && (
        <SessionDetailModal
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </>
  );
}