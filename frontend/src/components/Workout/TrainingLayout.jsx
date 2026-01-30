import React, { useState, useEffect } from "react";
import WorkoutCatalog from "./WorkoutCatalog";
import MyProgramsSection from "./MyProgramsSection";
import { getCurrentUserId } from "@/utils/authUtils.js";

export default function TrainingLayout() {
  const [activeTab, setActiveTab] = useState("training");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const id = await getCurrentUserId();
      console.log("User ID:", id);
      setUserId(id);
    }
    fetchUser();
  }, []);

  if (activeTab === "programs" && !userId) {
    // Optionnel : loader pendant le fetch
    return <div>Loading...</div>;
  }

  return (
    <div>
      {activeTab === "training" ? (
        <WorkoutCatalog onGoPrograms={() => setActiveTab("programs")} />
      ) : (
        <MyProgramsSection
          userId={userId}
          onGoCatalog={() => setActiveTab("training")}
        />
      )}
    </div>
  );
}