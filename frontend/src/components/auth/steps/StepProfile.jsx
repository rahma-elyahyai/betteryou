import React from "react";

const label = "text-[12px] font-medium tracking-wide text-white/70 mb-1 ml-1";
const field =
  "w-full rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-white " +
  "placeholder:text-white/40 outline-none transition " +
  "hover:border-white/30 hover:bg-white/15 " +
  "focus:border-[#D6F93D]/70 focus:ring-4 focus:ring-[#D6F93D]/15";
const chipRadioBase =
  "flex items-center gap-3 rounded-2xl border px-4 py-3 transition cursor-pointer " +
  "bg-white/10 border-white/15 hover:bg-white/15 hover:border-white/30";
const chipRadioActive =
  "border-[#D6F93D]/70 bg-[#D6F93D]/10 ring-4 ring-[#D6F93D]/10";

export default function StepProfile({ form, setForm }) {
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="text-left">
      <div className="text-center mb-5">
        <h2 className="text-[#D6F93D] text-xl font-extrabold tracking-tight">
          Who are you?
        </h2>
        <p className="text-white/60 text-sm mt-1">
          Tell us a bit about you to personalize your plan.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className={label}>First name</div>
          <input
            className={field}
            placeholder="enter your first name"
            value={form.firstName}
            onChange={(e) => set({ firstName: e.target.value })}
          />
        </div>

        <div>
          <div className={label}>Last name</div>
          <input
            className={field}
            placeholder="enter your last name"
            value={form.lastName}
            onChange={(e) => set({ lastName: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-3">
        <div className={label}>Birth date</div>
        <input
          className={field}
          type="date"
          value={form.birthDate}
          onChange={(e) => set({ birthDate: e.target.value })}
        />
      </div>

      <div className="mt-3">
        <div className={label}>Email</div>
        <input
          className={field}
          placeholder="you@example.com"
          type="email"
          value={form.email}
          onChange={(e) => set({ email: e.target.value })}
        />
      </div>

      <div className="mt-3">
        <div className={label}>Password</div>
        <input
          className={field}
          placeholder="enter your password"
          type="password"
          value={form.password}
          onChange={(e) => set({ password: e.target.value })}
        />
        <div className="text-[12px] text-white/40 mt-1 ml-1">
          Use at least 8 characters.
        </div>
      </div>

      <div className="mt-4">
        <div className={label}>Gender</div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            type="button"
            onClick={() => set({ gender: "FEMALE" })}
            className={[
              chipRadioBase,
              form.gender === "FEMALE" ? chipRadioActive : "",
            ].join(" ")}
          >
            <span
              className={[
                "h-4 w-4 rounded-full border transition",
                form.gender === "FEMALE"
                  ? "border-[#D6F93D] bg-[#D6F93D]"
                  : "border-white/40 bg-transparent",
              ].join(" ")}
            />
            <span className="text-white font-medium">Female</span>
          </button>

          <button
            type="button"
            onClick={() => set({ gender: "MALE" })}
            className={[
              chipRadioBase,
              form.gender === "MALE" ? chipRadioActive : "",
            ].join(" ")}
          >
            <span
              className={[
                "h-4 w-4 rounded-full border transition",
                form.gender === "MALE"
                  ? "border-[#D6F93D] bg-[#D6F93D]"
                  : "border-white/40 bg-transparent",
              ].join(" ")}
            />
            <span className="text-white font-medium">Male</span>
          </button>
        </div>
      </div>
    </div>
  );
}
