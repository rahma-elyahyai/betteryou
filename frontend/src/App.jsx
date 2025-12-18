import { BrowserRouter, Routes, Route } from "react-router-dom";
import NutritionPage from "./features/Nutrition/components/NutritionPage";
import MyPrograms from "./features/Nutrition/components/MyPrograms";
import CreateNutritionPlan from "./features/Nutrition/components/CreateNutritionPlan";
import AddMeals from "./features/Nutrition/components/AddMeals";
import { NutritionProvider } from "./features/Nutrition/store/NutritionContext"

function App() {
  return (
    <BrowserRouter>
    <NutritionProvider>
      <Routes>

        {/* PAGE NUTRITION */}
        <Route path="/nutrition" element={<NutritionPage />} />

        <Route path="*" element={<div>404 Not Found</div>} />

        <Route path="/myprograms" element={<MyPrograms/>} />

        {/* PAGE ACCUEIL (optionnelle pour le test) */}
        <Route path="/" element={<div>Home Page</div>} />

        <Route path="/create-nutrition-plan" element={<CreateNutritionPlan />} />
        <Route path="/nutrition-plans/:planId/add-meals" element={<AddMeals />} />

      </Routes>
      </NutritionProvider>
    </BrowserRouter>
  );
}

export default App;
