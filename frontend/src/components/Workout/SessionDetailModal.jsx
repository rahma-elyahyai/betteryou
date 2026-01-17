// MyProgramsSection.jsx

import React, { useEffect, useMemo, useState } from "react";
import { fetchSessionDetail, saveExerciseNote, savePerformance, completeSession } from "../../api/Workout/sessionApi";
import useRestTimer from "../../hooks/Workout/useRestTimer";

export default function SessionDetailModal({ sessionId, onClose }) {
  const [fetchState, setFetchState] = useState({
    id: null,
    data: null,
    error: null,
  });

  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const setSession = (updater) => {
    setFetchState((prev) => {
      if (prev.id !== sessionId) return prev;
      const nextData = typeof updater === "function" ? updater(prev.data) : updater;
      return { ...prev, data: nextData };
    });
  };

  const [editingNote, setEditingNote] = useState(false);
  const [noteDrafts, setNoteDrafts] = useState({});

  const [showPerformance, setShowPerformance] = useState(false);
  const [performanceData, setPerformanceData] = useState({ weight: "", reps: "", sets: "" });

  const loading = !!sessionId && fetchState.id !== sessionId;

  const session = fetchState.id === sessionId ? fetchState.data : null;
  const error = fetchState.id === sessionId ? fetchState.error : null;

  const handleCompleteSession = async () => {
    try {
      const updated = await completeSession(sessionId);
      setFetchState((prev) => ({ ...prev, data: updated }));
    } catch (e) {
      console.error(e);
      alert("Failed to complete session");
    }
  };

  useEffect(() => {
    if (!sessionId) return;

    let ignore = false;
    const controller = new AbortController();

    fetchSessionDetail(sessionId, { signal: controller.signal })
      .then((data) => {
        if (ignore) return;

        setFetchState({ id: sessionId, data, error: null });

        setActiveExerciseIndex(0);
        setShowVideo(false);
        setEditingNote(false);
        setShowPerformance(false);
        setPerformanceData({ weight: "", reps: "", sets: "" });

        const drafts = {};
        (data.exercises || []).forEach((ex) => {
          const exId = ex.idExercise ?? ex.id_exercise;
          drafts[exId] = ex.note || "";
        });
        setNoteDrafts(drafts);
      })
      .catch((err) => {
        if (ignore) return;
        if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") return;

        console.error(err);
        setFetchState({ id: sessionId, data: null, error: "Failed to load session details." });
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [sessionId]);

  const exercises = session?.exercises || [];

  const activeExercise = useMemo(() => exercises[activeExerciseIndex] || null, [exercises, activeExerciseIndex]);

  const timer = useRestTimer(activeExercise?.restSeconds ?? activeExercise?.rest_seconds ?? 0);

  const totalCalories =
    exercises.reduce((sum, ex) => sum + (ex.caloriesBurned ?? ex.calories_burned ?? 0), 0) || 0;

  const onSelectExercise = (index) => {
    setActiveExerciseIndex(index);
    setShowVideo(false);
    setEditingNote(false);
    setShowPerformance(false);
    setPerformanceData({ weight: "", reps: "", sets: "" });

    const rest = exercises[index]?.restSeconds ?? exercises[index]?.rest_seconds ?? 0;
    timer.resetTo(rest);
  };

  const activeId = activeExercise ? (activeExercise.idExercise ?? activeExercise.id_exercise) : null;
  const noteText = activeId ? (noteDrafts[activeId] ?? activeExercise?.note ?? "") : "";

  const handleSaveNote = async () => {
    if (!activeExercise) return;

    const exerciseId = activeExercise.idExercise ?? activeExercise.id_exercise;
    const note = noteDrafts[exerciseId] ?? "";

    const updated = await saveExerciseNote(sessionId, exerciseId, note);

    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: (prev.exercises || []).map((ex) => {
          const exId = ex.idExercise ?? ex.id_exercise;
          return exId === exerciseId ? { ...ex, note: updated.note ?? note } : ex;
        }),
      };
    });

    setEditingNote(false);
  };

  const handleSavePerformance = async () => {
    if (!activeExercise) return;

    const exerciseId = activeExercise.idExercise ?? activeExercise.id_exercise;

    const perf = {
      date: new Date().toISOString().slice(0, 10),
      weight: performanceData.weight === "" ? null : Number(performanceData.weight),
      reps: performanceData.reps === "" ? null : Number(performanceData.reps),
      sets: performanceData.sets === "" ? null : Number(performanceData.sets),
    };

    const saved = await savePerformance(sessionId, exerciseId, perf);

    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        exercises: (prev.exercises || []).map((ex) => {
          const exId = ex.idExercise ?? ex.id_exercise;
          if (exId !== exerciseId) return ex;

          const historyCamel = Array.isArray(ex.performanceHistory) ? ex.performanceHistory : null;
          const historySnake = Array.isArray(ex.performance_history) ? ex.performance_history : null;

          if (historyCamel) return { ...ex, performanceHistory: [saved, ...historyCamel] };
          if (historySnake) return { ...ex, performance_history: [saved, ...historySnake] };

          return { ...ex, performanceHistory: [saved] };
        }),
      };
    });

    setShowPerformance(false);
    setPerformanceData({ weight: "", reps: "", sets: "" });
  };

  if (!sessionId) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
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
              <h2 className="text-lime-400 text-4xl font-bold mb-2">SESSION DETAIL</h2>
              <p className="text-gray-400 text-sm">
                {session?.programName ?? session?.program_name ?? "Workout Program"}
              </p>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-20 h-20 border-4 border-gray-800 border-t-lime-400 rounded-full animate-spin"></div>
                <p className="text-gray-400 text-base mt-6 font-medium">Loading session...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border-2 border-red-500/50 rounded-2xl p-8 text-center">
                <p className="text-red-400 text-lg font-semibold">{error}</p>
              </div>
            )}

            {!loading && session && (
              <>
                {/* Session Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="text-gray-500 text-xs uppercase mb-1">Date</div>
                    <div className="text-white font-semibold">
                      {session.sessionDate ?? session.session_date ?? "-"}
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="text-gray-500 text-xs uppercase mb-1">Duration</div>
                    <div className="text-white font-semibold">
                      {session.durationMinutes ?? session.duration_minutes ?? "-"} min
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="text-gray-500 text-xs uppercase mb-1">Exercises</div>
                    <div className="text-lime-400 font-bold text-xl">{exercises.length}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <div className="text-gray-500 text-xs uppercase mb-1">Calories</div>
                    <div className="text-lime-400 font-bold text-xl">{totalCalories}</div>
                  </div>
                </div>

                {/* Exercise List + Detail */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {/* Liste exercices */}
                  <div className="lg:col-span-1">
                    <h3 className="text-lime-400 text-xl font-bold mb-4 uppercase">Exercises</h3>
                    <div className="space-y-2">
                      {exercises.map((ex, idx) => {
                        const exId = ex.idExercise ?? ex.id_exercise;
                        const name = ex.exerciseName ?? ex.exercise_name;
                        const sets = ex.sets ?? 0;
                        const reps = ex.reps ?? 0;

                        return (
                          <button
                            key={exId ?? idx}
                            onClick={() => onSelectExercise(idx)}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                              activeExerciseIndex === idx
                                ? "bg-lime-400 text-gray-900 shadow-lg shadow-lime-400/50"
                                : "bg-gray-800/50 text-white hover:bg-gray-700/50 border border-gray-700"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  activeExerciseIndex === idx
                                    ? "bg-gray-900 text-lime-400"
                                    : "bg-lime-400 text-gray-900"
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold truncate">{name}</div>
                                <div className={`text-sm ${activeExerciseIndex === idx ? "text-gray-800" : "text-gray-400"}`}>
                                  {sets} sets × {reps} reps
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Détails exercice */}
                  <div className="lg:col-span-2">
                    {activeExercise && (
                      <ExerciseDetailView
                        exercise={activeExercise}
                        showVideo={showVideo}
                        setShowVideo={setShowVideo}
                        editingNote={editingNote}
                        setEditingNote={setEditingNote}
                        noteText={noteText}
                        onChangeNote={(val) =>
                          setNoteDrafts((prev) => ({
                            ...prev,
                            [activeId]: val,
                          }))
                        }
                        handleSaveNote={handleSaveNote}
                        showPerformance={showPerformance}
                        setShowPerformance={setShowPerformance}
                        performanceData={performanceData}
                        setPerformanceData={setPerformanceData}
                        handleSavePerformance={handleSavePerformance}
                        timer={timer}
                      />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 py-3 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold rounded-xl transition-all uppercase tracking-wide">
                    Start Session
                  </button>
                  <button
                    onClick={handleCompleteSession}
                    disabled={!session || (session.sessionStatus ?? session.session_status) === "DONE"}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all uppercase tracking-wide"
                  >
                    Complete Session
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExerciseDetailView({
  exercise,
  showVideo,
  setShowVideo,
  editingNote,
  setEditingNote,
  noteText,
  onChangeNote,
  handleSaveNote,
  showPerformance,
  setShowPerformance,
  performanceData,
  setPerformanceData,
  handleSavePerformance,
  timer,
}) {
  const name = exercise.exerciseName ?? exercise.exercise_name;
  const desc = exercise.description ?? "";
  const videoUrl = exercise.videoUrl ?? exercise.video_url;

  const sets = exercise.sets ?? 0;
  const reps = exercise.reps ?? 0;
  const calories = exercise.caloriesBurned ?? exercise.calories_burned ?? 0;
  const difficulty = exercise.difficultyLevel ?? exercise.difficulty_level ?? "-";

  const target = exercise.targetMuscle ?? exercise.target_muscle ?? "";
  const equip = exercise.equipmentsNeeded ?? exercise.equipment_needed ?? exercise.equipments_needed ?? "";

  const history = exercise.performanceHistory ?? exercise.performance_history ?? [];

  return (
    <div className="space-y-6">
      {/* Title + Video Button */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          {videoUrl && (
            <button
              onClick={() => setShowVideo((v) => !v)}
              className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold rounded-lg text-sm transition-all"
            >
              🎥 {showVideo ? "Hide" : "Watch"}
            </button>
          )}
        </div>
        {desc && <p className="text-gray-400 text-sm">{desc}</p>}
      </div>

      {/* Video */}
      {showVideo && videoUrl && (
        <div className="bg-gray-900 p-4 rounded-xl border border-lime-400">
          <video controls className="w-full rounded-lg" src={videoUrl}>
            Your browser does not support video.
          </video>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-4">
          <div className="text-gray-500 text-xs uppercase mb-1">Sets × Reps</div>
          <div className="text-2xl font-bold text-lime-400">
            {sets} × {reps}
          </div>
        </div>

        <div className="bg-gradient-to-br from-lime-900/30 to-lime-800/30 border border-lime-500/30 rounded-xl p-4">
          <div className="text-gray-500 text-xs uppercase mb-1">Rest Timer</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-lime-400">
              {Math.floor(timer.seconds / 60)}:{String(timer.seconds % 60).padStart(2, "0")}
            </div>
            <div className="flex gap-2">
              {!timer.isRunning ? (
                <button onClick={timer.start} className="px-3 py-1 bg-lime-400 text-gray-900 font-bold rounded text-sm">
                  ▶
                </button>
              ) : (
                <button onClick={timer.pause} className="px-3 py-1 bg-yellow-400 text-gray-900 font-bold rounded text-sm">
                  ⏸
                </button>
              )}
              <button onClick={timer.reset} className="px-3 py-1 bg-gray-600 text-white font-bold rounded text-sm">
                ↻
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-500 text-xs uppercase mb-1">Difficulty</div>
          <div className="text-lg font-bold text-lime-400">{difficulty}</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="text-gray-500 text-xs uppercase mb-1">Calories</div>
          <div className="text-2xl font-bold text-lime-400">{calories}</div>
        </div>
      </div>

      {/* Target Muscles */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <div className="text-gray-500 text-xs uppercase tracking-wide mb-2">Target Muscles</div>
        <div className="flex flex-wrap gap-2">
          {String(target)
            .split(",")
            .filter(Boolean)
            .map((m, i) => (
              <span key={i} className="px-3 py-1 bg-lime-400/20 text-lime-400 border border-lime-400/30 rounded-full text-sm font-semibold">
                {m.trim()}
              </span>
            ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <div className="text-gray-500 text-xs uppercase tracking-wide mb-2">Equipment Needed</div>
        <div className="flex flex-wrap gap-2">
          {String(equip)
            .split(",")
            .filter(Boolean)
            .map((e, i) => (
              <span key={i} className="px-3 py-1 bg-gray-700 text-gray-200 rounded-lg text-sm border border-gray-600">
                🏋️ {e.trim()}
              </span>
            ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-500 text-xs uppercase tracking-wide">Personal Notes</div>
          {!editingNote && (
            <button
              onClick={() => setEditingNote(true)}
              className="px-3 py-1 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold rounded text-sm"
            >
              Edit
            </button>
          )}
        </div>

        {editingNote ? (
          <div>
            <textarea
              value={noteText}
              onChange={(e) => onChangeNote(e.target.value)}
              className="w-full bg-gray-900 text-white p-3 rounded-lg border border-gray-700 focus:border-lime-400 outline-none resize-none"
              rows="3"
              placeholder="Add your notes here..."
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleSaveNote} className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold rounded-lg">
                Save
              </button>
              <button onClick={() => setEditingNote(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm">{exercise.note || "No notes yet. Click Edit to add notes."}</p>
        )}
      </div>

      {/* Performance History */}
      <div className="bg-gray-800/50 p-4 rounded-xl border border-lime-400/30">
        <div className="flex justify-between items-center mb-3">
          <div className="text-gray-500 text-xs uppercase tracking-wide font-bold">Performance History</div>
          <button
            onClick={() => setShowPerformance((v) => !v)}
            className="px-3 py-1 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold rounded text-sm"
          >
            {showPerformance ? "Cancel" : "+ Log"}
          </button>
        </div>

        {showPerformance && (
          <div className="mb-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="grid grid-cols-3 gap-3 mb-3">
              <input
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-lime-400 outline-none"
                placeholder="Weight (kg)"
                type="number"
                value={performanceData.weight}
                onChange={(e) => setPerformanceData((p) => ({ ...p, weight: e.target.value }))}
              />
              <input
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-lime-400 outline-none"
                placeholder="Reps"
                type="number"
                value={performanceData.reps}
                onChange={(e) => setPerformanceData((p) => ({ ...p, reps: e.target.value }))}
              />
              <input
                className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 focus:border-lime-400 outline-none"
                placeholder="Sets"
                type="number"
                value={performanceData.sets}
                onChange={(e) => setPerformanceData((p) => ({ ...p, sets: e.target.value }))}
              />
            </div>
            <button onClick={handleSavePerformance} className="w-full px-4 py-2 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold rounded-lg">
              Save Performance
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history && history.length > 0 ? (
            history.map((perf, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-500">{perf.date}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-lime-400 font-semibold">{perf.weight ?? "-"} kg</span>
                  <span className="text-gray-300">
                    {perf.sets ?? "-"} × {perf.reps ?? "-"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No performance logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
} 