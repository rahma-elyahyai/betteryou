import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";

/* =========================
   PROGRESS BAR
========================= */
function ProgressBar() {
  const [width, setWidth] = useState("0%");

  React.useEffect(() => {
    const t = setTimeout(() => setWidth("100%"), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#d4ff00] rounded-full transition-all ease-linear duration-[2400ms]"
        style={{ width }}
      />
    </div>
  );
}

/* =========================
   SUCCESS TOAST
========================= */
function SuccessToast() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900/95 rounded-2xl">
      <div className="flex flex-col items-center gap-5 px-8 py-6 w-full">

        {/* Icône avec ping */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#d4ff00]/10 border-2 border-[#d4ff00] flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[#d4ff00]" strokeWidth={2} />
          </div>
          <span className="absolute w-20 h-20 rounded-full border-2 border-[#d4ff00] opacity-30 animate-ping" />
        </div>

        {/* Texte */}
        <div className="text-center space-y-1">
          <p className="text-[#d4ff00] font-bold text-2xl">Programme Créé !</p>
          <p className="text-gray-400 text-sm">
            Votre programme a été sauvegardé avec succès 🏋️
          </p>
        </div>

        {/* Barre de progression */}
        <ProgressBar />
      </div>
    </div>
  );
}

/* =========================
   MODAL
========================= */
export default function GenerateProgramModal({ open, onClose, onGenerate }) {
  const [userNotes, setUserNotes] = useState("");
  const [constraints, setConstraints] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await onGenerate({ userNotes, constraints });

      // Affiche le toast de succès
      setSuccess(true);

      // Ferme le modal après 2.5s
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
        setUserNotes("");
        setConstraints("");
        onClose();
      }, 2500);
    } catch (err) {
      console.error("❌ Generation failed:", err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-zinc-900 border border-white/10 p-6 shadow-2xl overflow-hidden">

        {/* Toast superposé sur le contenu du modal */}
        {success && <SuccessToast />}

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Générer un programme (1 semaine)
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white transition-all"
            disabled={loading}
          >
            <X />
          </button>
        </div>

        <p className="mt-2 text-sm text-white/70">
          Tu peux ajouter des informations (optionnel). Sinon l'IA décidera, mais
          en respectant ton objectif.
        </p>

        {/* Champs */}
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-white/80">Infos (optionnel)</label>
            <textarea
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-[#d4ff00] transition-all"
              rows={4}
              placeholder="Ex: je veux 3 jours muscu, 2 cardio, pas de squat, je suis débutante..."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Contraintes (optionnel)</label>
            <input
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-[#d4ff00] transition-all"
              placeholder="Ex: matériel: haltères; temps max: 45min; douleurs genou..."
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Boutons */}
        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/90 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[#d4ff00] hover:bg-[#c2ed00] disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Génération...
              </>
            ) : (
              "Générer"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}