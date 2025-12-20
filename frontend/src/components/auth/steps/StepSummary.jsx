import React from "react";

const card =
  "rounded-2xl border border-white/12 bg-white/8 p-5 " +
  "shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md";
const title = "text-white font-extrabold text-lg tracking-tight";
const row = "grid grid-cols-[110px_1fr] gap-3 text-sm leading-6";
const k = "text-white/60";
const v = "text-white font-medium";

export default function StepSummary({ form }) {
  return (
    <div>
      <div className="text-center mb-5">
        <h2 className="text-[#D6F93D] text-xl font-extrabold tracking-tight">
          Summary
        </h2>
        <p className="text-white/60 text-sm mt-1">
          Check your info before creating the account.
        </p>
      </div>

      <div className="space-y-4 text-left">
        <div className={card}>
          <div className={title}>Personal Information</div>
          <div className="mt-3 space-y-2">
            <div className={row}>
              <div className={k}>Name</div>
              <div className={v}>
                {form.firstName || "-"} {form.lastName || "-"}
              </div>
            </div>
            <div className={row}>
              <div className={k}>Birth date</div>
              <div className={v}>{form.birthDate || "-"}</div>
            </div>
            <div className={row}>
              <div className={k}>Gender</div>
              <div className={v}>{form.gender || "-"}</div>
            </div>
          </div>
        </div>

        <div className={card}>
          <div className={title}>Physical data</div>
          <div className="mt-3 space-y-2">
            <div className={row}>
              <div className={k}>Weight</div>
              <div className={v}>{form.initialWeightKg || "-"} kg</div>
            </div>
            <div className={row}>
              <div className={k}>Height</div>
              <div className={v}>{form.heightCm || "-"} cm</div>
            </div>
            <div className={row}>
              <div className={k}>Activity</div>
              <div className={v}>{form.activityLevel || "-"}</div>
            </div>
            <div className={row}>
              <div className={k}>Fitness</div>
              <div className={v}>{form.fitnessLevel || "-"}</div>
            </div>
          </div>
        </div>

        <div className={card + " ring-2 ring-[#D6F93D]/60"}>
          <div className={title}>Objective</div>
          <div className="mt-3 text-white font-semibold">
            {form.goal || "-"}
          </div>
          <div className="text-white/55 text-sm mt-1">
            You can change this later in settings.
          </div>
        </div>
      </div>
    </div>
  );
}
