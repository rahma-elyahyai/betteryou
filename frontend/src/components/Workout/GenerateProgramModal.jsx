import React, { useState } from "react";
import { X } from "lucide-react";

export default function GenerateProgramModal({ open, onClose, onGenerate }) {
  const [userNotes, setUserNotes] = useState("");
  const [constraints, setConstraints] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-zinc-900 border border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            Générer un programme (1 semaine)
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white"
          >
            <X />
          </button>
        </div>

        <p className="mt-2 text-sm text-white/70">
          Tu peux ajouter des informations (optionnel). Sinon l’IA décidera, mais
          en respectant ton objectif.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm text-white/80">Infos (optionnel)</label>
            <textarea
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white"
              rows={4}
              placeholder="Ex: je veux 3 jours muscu, 2 cardio, pas de squat, je suis débutante..."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-white/80">
              Contraintes (optionnel)
            </label>
            <input
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white"
              placeholder="Ex: matériel: haltères; temps max: 45min; douleurs genou..."
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/90 hover:bg-white/10"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={() => onGenerate({ userNotes, constraints })}
            className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:opacity-90"
          >
            Générer
          </button>
        </div>
      </div>
    </div>
  );
}