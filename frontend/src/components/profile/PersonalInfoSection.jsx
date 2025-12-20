import React, { useState, useEffect } from "react";
import { User, X, CheckCircle, Sparkles } from "lucide-react";
import ObjectiveSection from "./ObjectiveSection";
import Sidebar from "@/layout/Sidebar";
import { profileApi } from "@/api/profileApi";

export default function PersonalInfoSection() {
  const [activeTab, setActiveTab] = useState("informations");
  const [activePage, setActivePage] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    height_cm: "",
    initial_weight_kg: "",
    fitness_level: "",
    activity_level: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data } = await profileApi.getProfile();
      const info = data.info;

      setFormData({
        first_name: info.firstName || "",
        last_name: info.lastName || "",
        birth_date: info.birthDate || "",
        gender: info.gender?.toLowerCase() || "",
        height_cm: info.heightCm ?? "",
        initial_weight_kg: info.weight ?? "",
        fitness_level: info.fitnessLevel?.toLowerCase() || "",
        activity_level: info.activityLevel?.toLowerCase() || "",
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveModifications = async () => {
    try {
      const payload = {
        firstName: formData.first_name,
        lastName: formData.last_name,
        gender: formData.gender ? formData.gender.toUpperCase() : null,
        weight: formData.initial_weight_kg ? Number(formData.initial_weight_kg) : null,
        heightCm: formData.height_cm ? Number(formData.height_cm) : null,
        fitnessLevel: formData.fitness_level ? formData.fitness_level.toUpperCase() : null,
        activityLevel: formData.activity_level ? formData.activity_level.toUpperCase() : null,
      };

      await profileApi.updateInfo(payload);
      await fetchUserData();
      setIsEditing(false);

      setShowSuccessNotif(true);
      setTimeout(() => setShowSuccessNotif(false), 2500);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return "";
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // ✨ UI classes
  const surface =
    "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]";
  const glassCard =
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.40)]";
  const sectionTitle = "text-white text-xl font-semibold tracking-tight";
  const label = "text-[11px] uppercase tracking-wider text-white/55 mb-2";
  const inputBase =
    "w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/35 outline-none transition " +
    "hover:bg-white/12 hover:border-white/25 " +
    "focus:ring-4 focus:ring-[#D6F93D]/15 focus:border-[#D6F93D]/55";
  const inputDisabled =
    "disabled:bg-white/5 disabled:text-white/70 disabled:border-white/10 disabled:cursor-not-allowed";

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-black text-white flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,249,61,0.10),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(214,249,61,0.10),transparent_40%)]" />
        <div className="absolute inset-0 opacity-20 bg-[url('/src/assets/noise.png')] bg-repeat" />
        <div className="relative flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[#D6F93D] animate-pulse" />
          <div className="text-white/80 font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white flex">
      {/* Background like login/loading */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,249,61,0.10),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(214,249,61,0.10),transparent_40%)]" />
      <div className="absolute inset-0 opacity-20 bg-[url('/src/assets/noise.png')] bg-repeat" />

      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={() => {
          localStorage.removeItem("token");
          console.log("logout");
        }}
      />

      <div className="relative flex-1 p-8">
        {activePage === "profile" ? (
          <>
            {/* Header */}
            <div className={surface + " p-7 mb-6"}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-extrabold tracking-tight text-[#D6F93D]">
                      My Profile
                    </h1>
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-white/5 border border-white/10">
                      <User className="w-5 h-5 text-purple-400" />
                    </span>
                  </div>
                  <p className="text-white/65 mt-2">
                    Personalize your profile and unlock a smarter experience.
                  </p>
                </div>

                <div className="hidden md:flex items-center gap-2 text-white/70 text-sm">
                  <Sparkles className="w-4 h-4 text-[#D6F93D]" />
                  <span>BetterYou</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={glassCard + " p-2 mb-6"}>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab("informations")}
                  className={[
                    "rounded-xl px-6 py-3 font-semibold tracking-wide transition",
                    activeTab === "informations"
                      ? "bg-[#D6F93D] text-black shadow-[0_12px_40px_rgba(214,249,61,0.22)]"
                      : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  INFORMATIONS
                </button>

                <button
                  onClick={() => setActiveTab("objective")}
                  className={[
                    "rounded-xl px-6 py-3 font-semibold tracking-wide transition",
                    activeTab === "objective"
                      ? "bg-[#D6F93D] text-black shadow-[0_12px_40px_rgba(214,249,61,0.22)]"
                      : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  OBJECTIVE
                </button>
              </div>
            </div>

            {activeTab === "objective" && <ObjectiveSection />}

            {activeTab === "informations" && (
              <div className={glassCard + " p-8 relative"}>
                {/* top right actions */}
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserData();
                    }}
                    className="absolute top-5 right-5 h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center"
                    aria-label="Cancel"
                  >
                    <X className="w-5 h-5 text-[#D6F93D]" />
                  </button>
                )}

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-[#D6F93D]/10 border border-[#D6F93D]/25 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#D6F93D]" />
                    </div>
                    <div>
                      <h2 className={sectionTitle}>Personal Information</h2>
                      <p className="text-white/55 text-sm mt-1">
                        Update your personal and physical data.
                      </p>
                    </div>
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 rounded-xl font-semibold text-black bg-[#D6F93D] hover:brightness-95 transition shadow-[0_12px_40px_rgba(214,249,61,0.18)]"
                    >
                      Modify
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveModifications}
                      className="px-6 py-2.5 rounded-xl font-semibold text-black bg-[#D6F93D] hover:brightness-95 transition shadow-[0_12px_40px_rgba(214,249,61,0.18)]"
                    >
                      Save
                    </button>
                  )}
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className={label}>First name</div>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBase + " " + inputDisabled}
                    />
                  </div>

                  <div>
                    <div className={label}>Last name</div>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBase + " " + inputDisabled}
                    />
                  </div>

                  <div>
                    <div className={label}>Age</div>
                    <input
                      type="text"
                      value={formData.birth_date ? calculateAge(formData.birth_date) : "-"}
                      disabled
                      className={inputBase + " disabled:bg-white/5 disabled:text-white/70 disabled:border-white/10"}
                    />
                  </div>

                  <div>
                    <div className={label}>Gender</div>
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBase + " " + inputDisabled + " capitalize"}
                    />
                  </div>

                  <div>
                    <div className={label}>Weight (kg)</div>
                    <input
                      type="number"
                      name="initial_weight_kg"
                      value={formData.initial_weight_kg}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBase + " " + inputDisabled}
                    />
                  </div>

                  <div>
                    <div className={label}>Height (cm)</div>
                    <input
                      type="number"
                      name="height_cm"
                      value={formData.height_cm}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBase + " " + inputDisabled}
                    />
                  </div>

                  <div>
                    <div className={label}>Fitness level</div>
                    <input
                      type="text"
                      name="fitness_level"
                      value={formData.fitness_level}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBase + " " + inputDisabled}
                    />
                  </div>

                  <div>
                    <div className={label}>Activity level</div>
                    <input
                      type="text"
                      name="activity_level"
                      value={formData.activity_level}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={inputBase + " " + inputDisabled}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleSaveModifications}
                      className="px-8 py-3 rounded-xl font-semibold text-black bg-[#D6F93D] hover:brightness-95 transition shadow-[0_12px_40px_rgba(214,249,61,0.18)]"
                    >
                      Save modifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      {/* Success toast */}
      {showSuccessNotif && (
        <div className="fixed top-8 right-8 z-50">
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-[#D6F93D]/35 bg-black/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
            <div className="h-10 w-10 rounded-2xl bg-[#D6F93D]/15 border border-[#D6F93D]/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#D6F93D]" />
            </div>
            <div>
              <p className="font-semibold text-white">Saved successfully</p>
              <p className="text-sm text-white/60">Your information has been updated</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
