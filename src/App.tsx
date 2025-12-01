import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { Navigation } from "./components/Navigation";
import { LegalFooter } from "./components/LegalFooter";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Modules from "./pages/Modules";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import ChatAI from "./pages/ChatAI";
import Notes from "./pages/Notes";
import Terminal from "./pages/Terminal";
import Games from "./pages/Games";
import PlanetaryClocks from "./pages/PlanetaryClocks";
import ChessSpace from "./pages/ChessSpace";
import Nanomedicine from "./pages/Nanomedicine";
import TimeTravel from "./pages/TimeTravel";
import MusicPlayer from "./pages/MusicPlayer";
import LockScreen from "./pages/LockScreen";
import WallpaperGallery from "./pages/WallpaperGallery";
import VoiceAssistant from "./pages/VoiceAssistant";
import EarthEvolution from "./pages/EarthEvolution";
import NeopediaAI from "./pages/NeopediaAI";
import MedicalAdvances from "./pages/MedicalAdvances";
import HorseRacing from "./pages/HorseRacing";
import Globe3D from "./pages/Globe3D";
import TaskAutomation from "./pages/TaskAutomation";
import FuturePredictions from "./pages/FuturePredictions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {showSplash ? (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          ) : (
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/modules" element={<Modules />} />
                  <Route path="/chat" element={<ChatAI />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/terminal" element={<Terminal />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/clocks" element={<PlanetaryClocks />} />
                  <Route path="/chess" element={<ChessSpace />} />
                  <Route path="/nanomedicine" element={<Nanomedicine />} />
                  <Route path="/timetravel" element={<TimeTravel />} />
                  <Route path="/music" element={<MusicPlayer />} />
                  <Route path="/lock" element={<LockScreen />} />
                  <Route path="/wallpapers" element={<WallpaperGallery />} />
                  <Route path="/voice" element={<VoiceAssistant />} />
                  <Route path="/earth" element={<EarthEvolution />} />
                  <Route path="/neopedia-ai" element={<NeopediaAI />} />
                  <Route path="/medical" element={<MedicalAdvances />} />
                  <Route path="/horses" element={<HorseRacing />} />
                  <Route path="/globe" element={<Globe3D />} />
                  <Route path="/automation" element={<TaskAutomation />} />
                  <Route path="/predictions" element={<FuturePredictions />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Navigation />
                <LegalFooter />
              </div>
            </BrowserRouter>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
