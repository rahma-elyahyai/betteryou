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

  // ✅ FIX: remplacer le faux "setSession" par une fonction qui met à jour fetchState.data
  const setSession = (updater) => {
    setFetchState((prev) => {
      if (prev.id !== sessionId) return prev; // sécurité
      const nextData = typeof updater === "function" ? updater(prev.data) : updater;
      return { ...prev, data: nextData };
    });
  };

  const [editingNote, setEditingNote] = useState(false);
  const [noteDrafts, setNoteDrafts] = useState({});

  const [showPerformance, setShowPerformance] = useState(false);
  const [performanceData, setPerformanceData] = useState({ weight: "", reps: "", sets: "" });

  // ✅ loading dérivé
  const loading = !!sessionId && fetchState.id !== sessionId;

  const session = fetchState.id === sessionId ? fetchState.data : null;
  const error = fetchState.id === sessionId ? fetchState.error : null;
  const handleCompleteSession = async () => {
    try {
      const updated = await completeSession(sessionId);

      // si tu utilises fetchState comme dans ton code:
      setFetchState((prev) => ({ ...prev, data: updated }));

      // ou si tu utilises setSession direct:
      // setSession(updated);
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

  // ✅ note text (draft par exercice)
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

          // support 2 noms: performanceHistory (camel) ou performance_history (snake)
          const historyCamel = Array.isArray(ex.performanceHistory) ? ex.performanceHistory : null;
          const historySnake = Array.isArray(ex.performance_history) ? ex.performance_history : null;

          if (historyCamel) return { ...ex, performanceHistory: [saved, ...historyCamel] };
          if (historySnake) return { ...ex, performance_history: [saved, ...historySnake] };

          // sinon on crée camel par défaut
          return { ...ex, performanceHistory: [saved] };
        }),
      };
    });

    setShowPerformance(false);
    setPerformanceData({ weight: "", reps: "", sets: "" });
  };

  if (!sessionId) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border-2 border-lime-400 shadow-2xl shadow-lime-400/30">
        {/* ✅ Header sticky (ajouté) */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 border-b-2 border-lime-400/30 p-6 z-10">
          <button
            className="absolute top-6 right-6 text-3xl text-[#D6F93D] hover:border-[#D6F93D] hover:rotate-90 transition-all duration-300 font-bold"
            onClick={onClose}
          >
            ✕
          </button>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-[#D6F93D] text-5xl">💪</span>
            <div>
              <h2 className="text-3xl font-black text-[#D6F93D] uppercase tracking-wider">
                Session Workout
              </h2>
              <p className="text-gray-400 text-sm">
                {session?.programName ?? session?.program_name ?? "-"}
              </p>
            </div>
          </div>

          {loading && <p className="text-[#D6F93D] font-bold animate-pulse">Loading session...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && session && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-400 uppercase">Date</div>
                <div className="text-[#D6F93D] font-bold">
                  {session.sessionDate ?? session.session_date ?? "-"}
                </div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-400 uppercase">Duration</div>
                <div className="text-[#D6F93D] font-bold">
                  {session.durationMinutes ?? session.duration_minutes ?? "-"} min
                </div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-400 uppercase">Exercises</div>
                <div className="text-[#D6F93D] font-bold">{exercises.length}</div>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <div className="text-xs text-gray-400 uppercase">Calories</div>
                <div className="text-[#D6F93D] font-bold">{totalCalories} kcal</div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Content */}
        {!loading && session && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(95vh-220px)]">
            {/* Liste exercices */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xl font-bold text-[#D6F93D] mb-4 uppercase tracking-wide">
                Exercise List
              </h3>
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
                          ? "bg-[#D6F93D] text-gray-900 shadow-lg shadow-lime-400/50 scale-[1.02]"
                          : "bg-gray-800/50 text-white hover:bg-gray-700/50 border border-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            activeExerciseIndex === idx
                              ? "bg-gray-900 text-[#D6F93D]"
                              : "bg-[#D6F93D] text-gray-900"
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
        )}

        {/* ✅ Footer sticky (ajouté) */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-gray-800 border-t-2 border-lime-400/30 p-6 flex gap-4">
          <button className="flex-1 bg-[#D6F93D] hover:bg-lime-500 text-gray-900 font-bold py-3 rounded-lg transition-all duration-200 uppercase tracking-wider">
            Start Session
          </button>
          <button
            onClick={handleCompleteSession}
            disabled={!session || (session.sessionStatus ?? session.session_status) === "DONE"}
            className="flex-1 bg-transparent border-2 border-lime-400 text-[#D6F93D] hover:bg-[#D6F93D] hover:text-gray-900 font-bold py-3 rounded-lg transition-all duration-200 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Session
          </button>

        </div>
      </div>
    </div>
  );
}

// ✅ composant détails (reprend les features + timer + notes + perf)
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

  const history =
    exercise.performanceHistory ??
    exercise.performance_history ??
    [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-lime-400/50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-black text-white">{name}</h3>
          {videoUrl && (
            <button
              onClick={() => setShowVideo((v) => !v)}
              className="px-4 py-2 bg-[#D6F93D] hover:bg-lime-500 text-gray-900 font-bold rounded-lg transition-all"
            >
              🎥 {showVideo ? "Hide" : "Watch"} Video
            </button>
          )}
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{desc}</p>
      </div>

      {showVideo && videoUrl && (
        <div className="bg-gray-900 p-4 rounded-xl border-2 border-lime-400">
          <video controls className="w-full rounded-lg" src={videoUrl}>
            Your browser does not support video.
          </video>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-xl border border-lime-400/30">
          <div className="text-xs text-gray-400 uppercase mb-1">Sets × Reps</div>
          <div className="text-2xl font-bold text-[#D6F93D]">
            {sets} × {reps}
          </div>
        </div>

        <div className="bg-gradient-to-br from-lime-400/20 to-lime-400/5 p-4 rounded-xl border-2 border-lime-400/50">
          <div className="text-xs text-gray-400 uppercase mb-1">Rest Timer</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-[#D6F93D]">
              {Math.floor(timer.seconds / 60)}:{String(timer.seconds % 60).padStart(2, "0")}
            </div>
            <div className="flex gap-2">
              {!timer.isRunning ? (
                <button onClick={timer.start} className="px-3 py-1 bg-[#D6F93D] text-gray-900 font-bold rounded text-sm">
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

        <div className="bg-gray-800/50 p-4 rounded-xl border border-lime-400/30">
          <div className="text-xs text-gray-400 uppercase mb-1">Difficulty</div>
          <div className="text-lg font-bold text-[#D6F93D]">{difficulty}</div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl border border-lime-400/30">
          <div className="text-xs text-gray-400 uppercase mb-1">Calories</div>
          <div className="text-2xl font-bold text-[#D6F93D]">{calories} kcal</div>
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Target Muscles</div>
        <div className="flex flex-wrap gap-2">
          {String(target)
            .split(",")
            .filter(Boolean)
            .map((m, i) => (
              <span key={i} className="px-3 py-1 bg-[#D6F93D] text-gray-900 rounded-full text-sm font-semibold">
                {m.trim()}
              </span>
            ))}
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
        <div className="text-sm text-gray-400 uppercase tracking-wider mb-2">Equipment Needed</div>
        <div className="flex flex-wrap gap-2">
          {String(equip)
            .split(",")
            .filter(Boolean)
            .map((e, i) => (
              <span key={i} className="px-3 py-1 bg-gray-700 text-gray-200 rounded-lg text-sm border border-lime-400/30">
                🏋️ {e.trim()}
              </span>
            ))}
        </div>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-xl border border-lime-400/30">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-400 uppercase tracking-wider">📝 Personal Notes</div>
          {!editingNote && (
            <button
              onClick={() => setEditingNote(true)}
              className="px-3 py-1 bg-[#D6F93D] hover:bg-lime-500 text-gray-900 font-bold rounded text-sm"
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
              <button onClick={handleSaveNote} className="px-4 py-2 bg-[#D6F93D] text-gray-900 font-bold rounded">
                Save
              </button>
              <button onClick={() => setEditingNote(false)} className="px-4 py-2 bg-gray-600 text-white font-bold rounded">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 text-sm">{exercise.note || "No notes yet. Click Edit to add notes."}</p>
        )}
      </div>

      <div className="bg-gradient-to-br from-lime-400/10 to-transparent p-4 rounded-xl border-2 border-lime-400/30">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm  uppercase tracking-wider font-bold">📊 Performance History</div>
          <button
            onClick={() => setShowPerformance((v) => !v)}
            className="px-3 py-1 bg-[#D6F93D] hover:bg-lime-500 text-gray-900 font-bold rounded text-sm"
          >
            {showPerformance ? "Cancel" : "+ Log Performance"}
          </button>
        </div>

        {showPerformance && (
          <div className="mb-4 p-4 bg-gray-900/50 rounded-lg">
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
            <button onClick={handleSavePerformance} className="w-full px-4 py-2 bg-[#D6F93D] text-gray-900 font-bold rounded">
              Save Performance
            </button>
          </div>
        )}

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {history && history.length > 0 ? (
            history.map((perf, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                <span className="text-sm text-gray-400">{perf.date}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-[#D6F93D] font-semibold">{perf.weight ?? "-"} kg</span>
                  <span className="text-gray-300">
                    {perf.sets ?? "-"} × {perf.reps ?? "-"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No performance logged yet. Start tracking your progress!</p>
          )}
        </div>
      </div>
    </div>
  );
}
