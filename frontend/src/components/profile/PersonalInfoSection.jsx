import React, { useState, useEffect } from "react";
import { User, X, CheckCircle } from "lucide-react";
import ObjectiveSection from "./ObjectiveSection";
import Sidebar from "../../layout/Sidebar";

export default function ProfileHeader() {
  const [activeTab, setActiveTab] = useState("informations"); // informations | objective
  const [activePage, setActivePage] = useState("profile"); // dashboard | nutrition | training | profile
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
      const response = await fetch("http://localhost:8080/api/profile");
      const data = await response.json();

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      const response = await fetch("http://localhost:8080/api/profile/info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Erreur backend:", await response.text());
        return;
      }

      await fetchUserData();
      setIsEditing(false);

      setShowSuccessNotif(true);
      setTimeout(() => {
        setShowSuccessNotif(false);
      }, 3000);
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
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar (isolée) */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={() => {
          console.log("logout");
        }}
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activePage === "profile" ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold" style={{ color: "#D6F93D" }}>
                  My Profile
                </h1>
                <User className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-gray-300 mt-2">Personalize your profile and unlock a smarter</p>
            </div>

            {/* Tabs */}
            <div className="bg-gray-700 rounded-lg p-1 flex gap-1 mb-6">
              <button
                onClick={() => setActiveTab("informations")}
                className={`flex-1 px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
                  activeTab === "informations"
                    ? "text-black"
                    : "bg-purple-900 text-white hover:bg-purple-800"
                }`}
                style={activeTab === "informations" ? { backgroundColor: "#D6F93D" } : {}}
              >
                INFORMATIONS
              </button>

              <button
                onClick={() => setActiveTab("objective")}
                className={`flex-1 px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
                  activeTab === "objective"
                    ? "text-black"
                    : "bg-purple-900 text-white hover:bg-purple-800"
                }`}
                style={activeTab === "objective" ? { backgroundColor: "#D6F93D" } : {}}
              >
                OBJECTIVE
              </button>
            </div>

            {/* Objective tab */}
            {activeTab === "objective" && <ObjectiveSection />}

            {/* Informations tab */}
            {activeTab === "informations" && (
              <div
                className="bg-[#2C0E4E] rounded-lg p-8 relative"
                style={{ border: "1px solid #D6F93D" }}
              >
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="absolute top-4 right-4 text-white hover:opacity-80"
                    style={{ color: "#D6F93D" }}
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-700/30 p-2 rounded">
                      <User className="w-6 h-6" style={{ color: "#D6F93D" }} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 rounded-lg font-bold text-black transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#D6F93D" }}
                    >
                      Modify
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white text-sm mb-2">first name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-full bg-white text-gray-800 disabled:bg-gray-200 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">last name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-full bg-white text-gray-800 disabled:bg-gray-200 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">age</label>
                    <input
                      type="text"
                      value={formData.birth_date ? calculateAge(formData.birth_date) : ""}
                      disabled
                      className="w-full px-4 py-3 rounded-full bg-gray-200 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">gender</label>
                    <input
                      type="text"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-full bg-white text-gray-800 disabled:bg-gray-200 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">weight (kg)</label>
                    <input
                      type="number"
                      name="initial_weight_kg"
                      value={formData.initial_weight_kg}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-full bg-white text-gray-800 disabled:bg-gray-200 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">height (cm)</label>
                    <input
                      type="number"
                      name="height_cm"
                      value={formData.height_cm}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-full bg-white text-gray-800 disabled:bg-gray-200 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">fitness level</label>
                    <input
                      type="text"
                      name="fitness_level"
                      value={formData.fitness_level}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-full bg-white text-gray-800 disabled:bg-gray-200 disabled:text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-2">activity level</label>
                    <input
                      type="text"
                      name="activity_level"
                      value={formData.activity_level}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 rounded-full bg-white text-gray-800 disabled:bg-gray-200 disabled:text-gray-600"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleSaveModifications}
                      className="px-12 py-3 rounded-lg font-bold text-black transition-opacity hover:opacity-90"
                      style={{ backgroundColor: "#D6F93D" }}
                    >
                      save modifications
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

      {/* Notification de succès */}
      {showSuccessNotif && (
        <div className="fixed top-8 right-8 z-50 animate-slide-in">
          <div
            className="flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg border"
            style={{ backgroundColor: "#D6F93D", borderColor: "#b8d631" }}
          >
            <CheckCircle className="w-6 h-6 text-green-700" />
            <div>
              <p className="font-bold text-black text-lg">Modification réussie !</p>
              <p className="text-sm text-gray-800">Vos informations ont été mises à jour</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}
