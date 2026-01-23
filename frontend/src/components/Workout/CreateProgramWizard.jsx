import React, { useEffect, useMemo, useState } from "react";
import {
  fetchSessionTypes,
  fetchEquipmentOptions,
  fetchMuscles,
  searchExercises,
} from "../../api/Workout/programWizardApi";

import { createProgram } from "../../api/Workout/programApi";

  //muscles: selectedMuscles,


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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Program Configuration</h2>

      <div>
        <label className="text-white text-sm font-medium block mb-2">
          Program Name *
        </label>
        <input
          type="text"
          value={programData.programName}
          onChange={(e) => setProgramData((p) => ({ ...p, programName: e.target.value }))}
          className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border-2 border-gray-600 focus:border-lime-400 outline-none"
          placeholder="Full Body Builder"
        />
      </div>

      <div>
        <label className="text-white text-sm font-medium block mb-2">
          Description
        </label>
        <textarea
          value={programData.description}
          onChange={(e) => setProgramData((p) => ({ ...p, description: e.target.value }))}
          className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border-2 border-gray-600 focus:border-lime-400 outline-none"
          placeholder="Describe your program goals..."
          rows={3}
        />
      </div>

      <div>
        <label className="text-white text-sm font-medium block mb-2">
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
              className={`py-3 rounded-lg font-bold transition-all ${
                programData.goal === goal.id
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              <div className="text-2xl mb-1">{goal.icon}</div>
              <div className="text-sm">{goal.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-white text-sm font-medium block mb-2">
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
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400 select-none"
        />
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-400">30 min</span>
          <span className="text-lime-400 font-bold">{programData.sessionDuration} min</span>
          <span className="text-gray-400">120 min</span>
        </div>
      </div>

      <div>
        <label className="text-white text-sm font-medium block mb-3">
          Training Days *
        </label>

        <div className="grid grid-cols-4 gap-3 mb-2">
          {days.slice(0, 4).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`py-3 rounded-lg font-bold transition-all ${
                programData.trainingDays.includes(day)
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
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
              className={`py-3 rounded-lg font-bold transition-all ${
                programData.trainingDays.includes(day)
                  ? "bg-yellow-400 text-gray-900"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <p className="text-gray-400 text-sm mt-2">
          {programData.trainingDays.length} day(s) selected
        </p>
      </div>

      <button
        type="button"
        onClick={() => setCurrentStep(2)}
        disabled={!programData.programName || programData.trainingDays.length === 0 || !programData.goal}
        className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-lg transition-all"
      >
        Continue →
      </button>
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
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-4">Session Type</h2>

      {loadingMeta && <p className="text-lime-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-3 gap-4">
        {sessionTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setProgramData((p) => ({ ...p, sessionType: type.id }))}
            className={`p-6 rounded-xl transition-all border-2 ${
              programData.sessionType === type.id
                ? "bg-yellow-400/20 border-yellow-400"
                : "bg-gray-800 border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="text-4xl mb-2">{type.icon}</div>
            <div className="text-white font-bold">{type.label}</div>
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-4 mt-8">Equipment Available</h2>

      <div className="grid grid-cols-3 gap-4">
        {equipmentOptions.map((equip) => (
          <button
            key={equip.id}
            type="button"
            onClick={() => setProgramData((p) => ({ ...p, equipment: equip.id }))}
            className={`p-6 rounded-xl transition-all border-2 ${
              programData.equipment === equip.id
                ? "bg-yellow-400/20 border-yellow-400"
                : "bg-gray-800 border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="text-4xl mb-2">{equip.icon}</div>
            <div className="text-white font-bold">{equip.label}</div>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCurrentStep(3)}
        disabled={!programData.sessionType || !programData.equipment}
        className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-lg transition-all"
      >
        Continue →
      </button>

      <button
        type="button"
        onClick={() => setCurrentStep(1)}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-all"
      >
        ← Back
      </button>
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">{activeDay}</h2>
        <p className="text-gray-400 text-sm">Select target muscles</p>
      </div>

      {/* ✅ day switcher */}
      <div className="flex gap-2 flex-wrap">
        {programData.trainingDays.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActiveDay(d)}
            className={`px-3 py-2 rounded-lg font-bold ${
              activeDay === d ? "bg-yellow-400 text-gray-900" : "bg-gray-700 text-gray-300"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loadingMeta && <p className="text-lime-400">Loading muscles...</p>}

      <div className="grid grid-cols-2 gap-4">
        {muscles.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => toggleMuscle(m)}
            className={`py-4 rounded-lg font-bold transition-all ${
              selectedMuscles.includes(m)
                ? "bg-yellow-400 text-gray-900"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCurrentStep(4)}
        disabled={selectedMuscles.length === 0}
        className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-lg transition-all"
      >
        Choose Exercises →
      </button>

      <button
        type="button"
        onClick={() => setCurrentStep(2)}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-all"
      >
        ← Back
      </button>
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Exercises</h2>
        <p className="text-gray-400 text-sm">
          {selectedMuscles.join(", ")} • {programData.sessionType} • {programData.equipment} • {activeDay}
        </p>
      </div>

      {/* ✅ day switcher */}
      <div className="flex gap-2 flex-wrap">
        {programData.trainingDays.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActiveDay(d)}
            className={`px-3 py-2 rounded-lg font-bold ${
              activeDay === d ? "bg-yellow-400 text-gray-900" : "bg-gray-700 text-gray-300"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loadingExercises && <p className="text-lime-400">Loading exercises...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {editingExercise && (
        <div className="bg-gray-800 p-4 rounded-lg border-2 border-lime-400 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold">{editingExercise.exerciseName}</h3>
            <button type="button" onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">
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
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Reps</label>
              <input
                type="number"
                value={editingExercise.reps}
                onChange={(e) => updateEditing({ reps: Number(e.target.value) })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Rest (s)</label>
              <input
                type="number"
                value={editingExercise.restSeconds}
                onChange={(e) => updateEditing({ restSeconds: Number(e.target.value) })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-white font-semibold mb-3">Add Exercises</h3>

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
                className={`text-left px-4 py-3 rounded-lg transition-all ${
                  selected
                    ? "bg-gray-700 text-white border-2 border-lime-400"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {selected ? "✓ " : "+ "}
                {ex.name}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCurrentStep(5)}
        disabled={selectedExercises.length === 0}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all"
      >
        ✓ Save Session
      </button>

      <button
        type="button"
        onClick={() => setCurrentStep(3)}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-all"
      >
        ← Back
      </button>
    </div>
  );
}

/* =========================
   STEP 5
========================= */
function Step5_Summary({ programData, setCurrentStep, saving, onSave }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Summary</h2>

      <div className="bg-gray-800 p-5 rounded-lg">
        <h3 className="text-white font-bold text-lg mb-2">{programData.programName}</h3>
        <p className="text-gray-400 text-sm mb-1">{programData.description}</p>
        <p className="text-gray-400 text-sm">
          Goal: {programData.goal} • {programData.sessionDuration} min/session
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Days: {programData.trainingDays.join(", ")}
        </p>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold py-4 rounded-lg transition-all"
      >
        {saving ? "Saving..." : "🏋️ SAVE PROGRAM"}
      </button>

      <button
        type="button"
        onClick={() => setCurrentStep(4)}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-lg transition-all"
      >
        ← Edit
      </button>
    </div>
  );
}

/* =========================
   MAIN
========================= */
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
    sessions: {}, // { Mon: { muscles:[], exercises:[] }, Tue: ... }
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ✅ active day (fixes "only first day edited" issue)
  const [activeDay, setActiveDay] = useState("Mon");

  useEffect(() => {
    if (programData.trainingDays?.length) {
      setActiveDay(programData.trainingDays[0]);
    }
  }, [programData.trainingDays]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">🏆</span>
            <h1 className="text-3xl font-black text-white">Create a Program</h1>
          </div>

          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-1 w-12 rounded-full transition-all ${
                  step < currentStep ? "bg-green-500" : step === currentStep ? "bg-yellow-400" : "bg-gray-700"
                }`}
              />
            ))}
          </div>

          <p className="text-gray-400 text-sm">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
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
      </div>
    </div>
  );
};

export default CreateProgramWizard;
