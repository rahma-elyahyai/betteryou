import React, { useState } from "react";
import WorkoutCatalog from "./WorkoutCatalog";
import MyProgramsSection from "./MyProgramsSection";

export default function TrainingLayout() {
  const [activeTab, setActiveTab] = useState("training");
  const userId = 1; // remplace après par getCurrentUserId()

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
