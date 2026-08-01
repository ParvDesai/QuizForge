import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AssignmentsPage from "./pages/AssignmentsPage";
import CreatePage from "./pages/CreatePage";
import GeneratingPage from "./pages/GeneratingPage";
import PaperPage from "./pages/PaperPage";
import SettingsPage from "./pages/SettingsPage";
import LibraryPage from "./pages/LibraryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/assignments" element={<AssignmentsPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/generating/:id" element={<GeneratingPage />} />
      <Route path="/paper/:id" element={<PaperPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
