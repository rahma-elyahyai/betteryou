import React from "react";

const cardOptionBase =
  "w-full text-left rounded-2xl p-4 border transition " +
  "bg-white/8 border-white/12 hover:bg-white/12 hover:border-white/25 " +
  "hover:-translate-y-[1px] active:translate-y-0";
const cardOptionActive =
  "border-[#D6F93D]/70 bg-[#D6F93D]/10 ring-4 ring-[#D6F93D]/10";

const options = [
  {
    key: "LOSE_WEIGHT",
    title: "Lose weight",
    desc: "Reduce body fat while preserving muscle mass.",
    badge: "Cut",
  },
  {
    key: "MAINTAIN",
    title: "Maintain",
    desc: "Maintain your weight while improving body composition.",
    badge: "Balance",
  },
  {
    key: "GAIN_MASS",
    title: "Gain mass",
    desc: "Build strength and muscle volume with progressive training.",
    badge: "Bulk",
  },
];

export default function StepObjective({ form, setForm }) {
  return (
    <div>
      <div className="text-center mb-5">
        <h2 className="text-[#D6F93D] text-xl font-extrabold tracking-tight">
          Your objective
        </h2>
        <p className="text-white/60 text-sm mt-1">
          Choose what you want to achieve. You can change it later.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((o) => {
          const active = form.goal === o.key;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => setForm((f) => ({ ...f, goal: o.key }))}
              className={[cardOptionBase, active ? cardOptionActive : ""].join(
                " "
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-white font-semibold text-base">
                    {o.title}
                  </div>
                  <div className="text-white/60 text-sm mt-1 leading-5">
                    {o.desc}
                  </div>
                </div>

                <span
                  className={[
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
                    active
                      ? "bg-[#D6F93D] text-black"
                      : "bg-white/10 text-white/70 border border-white/15",
                  ].join(" ")}
                >
                  {o.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
