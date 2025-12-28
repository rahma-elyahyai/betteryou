import React from "react";
import TrainingLayout from "./components/Workout/TrainingLayout.jsx";

function App() {
  return (
    <div className="app-root flex min-h-screen w-full">
      <main className="main-content flex-1 w-full">
        <TrainingLayout />
      </main>
    </div>
  );
}

export default App;
