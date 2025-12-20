import React from "react";

const label = "text-[12px] font-medium tracking-wide text-white/70 mb-1 ml-1";
const field =
  "w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white " +
  "placeholder:text-white/40 outline-none transition " +
  "hover:border-white/30 hover:bg-white/15 " +
  "focus:border-[#D6F93D]/70 focus:ring-4 focus:ring-[#D6F93D]/15";

export default function StepPhysique({ form, setForm }) {
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="text-left">
      <div className="text-center mb-5">
        <h2 className="text-[#D6F93D] text-xl font-extrabold tracking-tight">
          Your physique
        </h2>
        <p className="text-white/60 text-sm mt-1">
          Used to estimate calories and training intensity.
        </p>
      </div>

      <div className="mt-2">
        <div className={label}>Weight</div>
        <div className="relative">
          <input
            className={field + " pr-12"}
            placeholder="50"
            inputMode="numeric"
            value={form.initialWeightKg}
            onChange={(e) => set({ initialWeightKg: e.target.value })}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">
            kg
          </span>
        </div>
      </div>

      <div className="mt-3">
        <div className={label}>Height</div>
        <div className="relative">
          <input
            className={field + " pr-12"}
            placeholder="160"
            inputMode="numeric"
            value={form.heightCm}
            onChange={(e) => set({ heightCm: e.target.value })}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">
            cm
          </span>
        </div>
      </div>

      <div className="mt-3">
        <div className={label}>Activity level</div>
        <select
  className="
    w-full rounded-2xl
    bg-white/10
    border border-white/20
    px-4 py-3
    text-white
    focus:text-white
    focus:border-[#D6F93D]
    focus:ring-4 focus:ring-[#D6F93D]/20
  "
  value={form.activityLevel}
  onChange={(e)=>setForm(f=>({...f, activityLevel:e.target.value}))}
>
  <option className="text-black" value="SEDENTARY">Sedentary</option>
  <option className="text-black" value="MODERATE">Moderate</option>
  <option className="text-black" value="ACTIVE">Active</option>
</select>

      </div>

      <div className="mt-3">
        <div className={label}>Fitness level</div>
        <select
  className="
    w-full rounded-2xl
    bg-white/10
    border border-white/20
    px-4 py-3
    text-white
    outline-none transition
    hover:border-white/30 hover:bg-white/15
    focus:border-[#D6F93D] focus:ring-4 focus:ring-[#D6F93D]/20
  "
  value={form.fitnessLevel}
  onChange={(e)=>setForm(f=>({...f, fitnessLevel:e.target.value}))}
>
  <option className="text-black bg-white" value="BEGINNER">Beginner</option>
  <option className="text-black bg-white" value="INTERMEDIATE">Intermediate</option>
  <option className="text-black bg-white" value="ADVANCED">Advanced</option>
</select>

      </div>
    </div>
  );
}
