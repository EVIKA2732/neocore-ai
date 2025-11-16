import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { Navigation } from "./components/Navigation";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Modules from "./pages/Modules";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/SettingsPage";
import ChatAI from "./pages/ChatAI";
import Notes from "./pages/Notes";
import Terminal from "./pages/Terminal";
import Games from "./pages/Games";
import CyberTalk from "./pages/CyberTalk";
import Calendar from "./pages/Calendar";
import Neopedia from "./pages/Neopedia";
import PlanetaryClocks from "./pages/PlanetaryClocks";
import ChessSpace from "./pages/ChessSpace";
import Nanomedicine from "./pages/Nanomedicine";
import TimeTravel from "./pages/TimeTravel";
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
                  <Route path="/cybertalk" element={<CyberTalk />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/neopedia" element={<Neopedia />} />
                  <Route path="/clocks" element={<PlanetaryClocks />} />
                  <Route path="/chess" element={<ChessSpace />} />
                  <Route path="/nanomedicine" element={<Nanomedicine />} />
                  <Route path="/timetravel" element={<TimeTravel />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Navigation />
              </div>
            </BrowserRouter>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
