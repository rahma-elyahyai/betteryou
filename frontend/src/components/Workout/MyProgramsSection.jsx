// MyProgramsSection.jsx
import React, { useEffect, useState } from "react";
import { fetchUserPrograms } from "../../api/Workout/programApi";
import SessionDetailModal from "./SessionDetailModal";
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

  if (loading) return <p className="text-white text-center text-xl py-12">Loading programs...</p>;

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

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="mx-auto w-full max-w-[1400px] px-6 2xl:px-0">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            <span className="text-[#D6F93D]">MY</span> PROGRAMS
          </h1>
          <p className="text-gray-400 text-lg">
            Track your progress and manage your workout programs.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              Active Programs
            </div>
            <div className="text-3xl font-bold text-[#D6F93D]">{activePrograms}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              Completed Sessions
            </div>
            <div className="text-3xl font-bold text-[#D6F93D]">{completedSessions}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              Total Hours
            </div>
            <div className="text-3xl font-bold text-[#D6F93D]">{totalHours.toFixed(1)}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
              Avg Progress
            </div>
            <div className="text-3xl font-bold text-[#D6F93D]">{avgProgress}%</div>
          </div>
        </div>

        {/* Programs List */}
        <div className="space-y-6">
          {list.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
          {list.length === 0 && (
            <p className="text-white text-center mt-8">
              No programs yet for this user.
            </p>
          )}
        </div>
      </div>
    </section>
  );


function ProgramCard({ program }) {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-[#D6F93D] transition-all duration-300">
        {/* Header, progress, infos ... (garde ton code) */}
        <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{program.name}</h2>
          <p className="text-sm text-gray-400">
            {program.goal} · {program.generationType} · {program.status}
          </p>
        </div>
        <span className="px-4 py-1 bg-[#D6F93D] text-gray-900 rounded-full text-sm font-semibold">
          {program.status}
        </span>
      </div>

      <p className="text-gray-300 mb-6">{program.description}</p>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Overall Progress</span>
          <span className="text-[#D6F93D] font-semibold">
            {Math.round(program.progressPercent || 0)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-[#D6F93D] h-3 rounded-full transition-all duration-300"
            style={{ width: `${program.progressPercent || 0}%` }}
          />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Goal
          </div>
          <div className="text-sm text-gray-200">{program.goal}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Sessions Completed
          </div>
          <div className="text-sm text-gray-200">
            {program.completedSessions} / {program.totalSessions}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Next Session
          </div>
          <div className="text-sm text-gray-200">
            {program.nextSessionDate || "—"}
          </div>
        </div>
      </div>

        {/* Recent Sessions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Recent Sessions
          </h3>
          <ul className="space-y-2">
            {program.recentSessions?.length ? (
              program.recentSessions.map((s) => {
                const sid = s.id ?? s.sessionId ?? s.id_session ?? s.workoutSessionId;

                return (
                  <li
                    key={sid ?? `${s.date}-${s.title}`}
                    onClick={() => {
                      console.log("clicked session =", s);
                      console.log("sid =", sid);
                      if (!sid) return; // évite setSelectedSessionId(undefined)
                      setSelectedSessionId(sid);
                    }}
                    className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg cursor-pointer hover:bg-gray-700/50 border border-transparent hover:border-lime-400/40 transition-all"
                  >
                    <span className="text-sm text-gray-400">{s.date}</span>
                    <span className="text-sm text-gray-200 flex-1 mx-4">{s.title}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#D6F93D] text-gray-900">
                      View →
                    </span>
                  </li>
                );
              })

            ) : (
              <li className="text-sm text-gray-400 p-3">No sessions yet.</li>
            )}
          </ul>
        </div>

        {/* footer boutons ... garde ton code */}
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
}

