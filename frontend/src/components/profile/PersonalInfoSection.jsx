import React, { useState, useEffect } from "react";
import { User, X, CheckCircle, Sparkles } from "lucide-react";
import ObjectiveSection from "./ObjectiveSection";
import { profileApi } from "@/api/profileApi";

export default function PersonalInfoSection() {
  const [activeTab, setActiveTab] = useState("informations");
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
  const sectionTitle = "text-white text-lg sm:text-xl font-semibold tracking-tight";
  const label = "text-[11px] uppercase tracking-wider text-white/55 mb-2";
  const inputBase =
    "w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white placeholder:text-white/35 outline-none transition " +
    "hover:bg-white/12 hover:border-white/25 " +
    "focus:ring-4 focus:ring-[#D6F93D]/15 focus:border-[#D6F93D]/55";
  const inputDisabled =
    "disabled:bg-white/5 disabled:text-white/70 disabled:border-white/10 disabled:cursor-not-allowed";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[#D6F93D] animate-pulse" />
          <div className="text-white/80 font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Header - Responsive */}
      <div className={surface + " p-5 sm:p-6 lg:p-7 mb-4 sm:mb-6"}>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#D6F93D]">
                My Profile
              </h1>
              <span className="inline-flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-2xl bg-white/5 border border-white/10">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </span>
            </div>
            <p className="text-white/65 text-sm sm:text-base mt-2">
              Personalize your profile and unlock a smarter experience.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-white/70 text-sm">
            <Sparkles className="w-4 h-4 text-[#D6F93D]" />
            <span>BetterYou</span>
          </div>
        </div>
      </div>

      {/* Tabs - Responsive */}
      <div className={glassCard + " p-2 mb-4 sm:mb-6"}>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab("informations")}
            className={[
              "rounded-xl px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide transition",
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
              "rounded-xl px-3 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide transition",
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
        <div className={glassCard + " p-5 sm:p-6 lg:p-8 relative"}>
          {/* Cancel button - Responsive positioning */}
          {isEditing && (
            <button
              onClick={() => {
                setIsEditing(false);
                fetchUserData();
              }}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center z-10"
              aria-label="Cancel"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#D6F93D]" />
            </button>
          )}

          {/* Section header - Responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-start sm:items-center gap-3">
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-[#D6F93D]/10 border border-[#D6F93D]/25 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#D6F93D]" />
              </div>
              <div>
                <h2 className={sectionTitle}>Personal Information</h2>
                <p className="text-white/55 text-xs sm:text-sm mt-1">
                  Update your personal and physical data.
                </p>
              </div>
            </div>

            {/* Action button - Hidden on mobile when editing */}
            <div className={`${isEditing ? 'hidden sm:block' : 'block'}`}>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl font-semibold text-black bg-[#D6F93D] hover:brightness-95 transition shadow-[0_12px_40px_rgba(214,249,61,0.18)]"
                >
                  Modify
                </button>
              ) : (
                <button
                  onClick={handleSaveModifications}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl font-semibold text-black bg-[#D6F93D] hover:brightness-95 transition shadow-[0_12px_40px_rgba(214,249,61,0.18)]"
                >
                  Save
                </button>
              )}
            </div>
          </div>

          {/* Form - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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

          {/* Bottom save button - Mobile only when editing */}
          {isEditing && (
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchUserData();
                }}
                className="sm:hidden w-full px-6 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 transition border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModifications}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl font-semibold text-black bg-[#D6F93D] hover:brightness-95 transition shadow-[0_12px_40px_rgba(214,249,61,0.18)]"
              >
                Save modifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success toast - Responsive positioning */}
      {showSuccessNotif && (
        <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-50 max-w-[calc(100vw-2rem)] sm:max-w-md">
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-[#D6F93D]/35 bg-black/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-[#D6F93D]/15 border border-[#D6F93D]/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D6F93D]" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm sm:text-base">Saved successfully</p>
              <p className="text-xs sm:text-sm text-white/60">Your information has been updated</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}