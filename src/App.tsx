import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import TruthOrDare from "./pages/TruthOrDare";
import Bot from "./pages/Bot";
import Health from "./pages/Health";
import Upload from "./pages/Upload";
import Voicevox from "./pages/Voicevox";
import AirplaneFolio from "./pages/AirplaneFolio";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/truth-or-dare" element={<TruthOrDare />} />
      <Route path="/bot" element={<Bot />} />
      <Route path="/health" element={<Health />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/voicevox" element={<Voicevox />} />
      <Route path="/airplane-folio" element={<AirplaneFolio />} />
    </Routes>
  );
}
