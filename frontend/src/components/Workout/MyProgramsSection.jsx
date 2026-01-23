// MyProgramsSection.jsx - VERSION AVEC TON CODE + NOUVEAU STYLE
import React, { useEffect, useState } from "react";
import { Calendar, Dumbbell, Plus } from 'lucide-react';
import { fetchUserPrograms } from "../../api/Workout/programApi";
import SessionDetailModal from "./SessionDetailModal";
import Sidebar from "../../Layout/Sidebar";
import WorkoutCatalog from "./WorkoutCatalog";

export default function MyProgramsSection({ userId = 1, onGoCatalog  }) {
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
                onClick={() => onGoCatalog?.()}
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
                   
                    className="flex justify-between items-center bg-gray-800/50 p-4 rounded-lg cursor-pointer hover:bg-gray-700/50 border border-transparent hover:border-lime-400/40 transition-all group"
                  >
                    <span className="text-sm text-gray-500">{s.date}</span>
                    <span className="text-sm text-gray-200 flex-1 mx-4 font-medium">{s.title}</span>
                    
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