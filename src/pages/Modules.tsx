import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CyberCard } from "@/components/CyberCard";
import { Music, FileText, MessageSquare, Terminal, Gamepad2, Globe as GlobeIcon, Swords, Activity, Clock, Lock, Image, Mic, Earth, Sparkles, HeartPulse, Cpu, Brain, Trophy, Globe as GlobeMap } from "lucide-react";

const Modules = () => {
  const navigate = useNavigate();

  const modules = [
    { icon: MessageSquare, title: "Chat IA", description: "Assistant neuronal multi-personnalité", onClick: () => navigate("/chat") },
    { icon: Sparkles, title: "Neopedia IA", description: "Encyclopédie infinie générée par IA", onClick: () => navigate("/neopedia-ai") },
    { icon: HeartPulse, title: "Avancées Médicales", description: "Médecine 2030-2100", onClick: () => navigate("/medical") },
    { icon: Music, title: "Lecteur Musical", description: "Bibliothèque IA musicale", onClick: () => navigate("/music") },
    { icon: Cpu, title: "Automatisation 2100", description: "Gestion des tâches intelligentes", onClick: () => navigate("/automation") },
    { icon: Brain, title: "Oracle Cybernétique", description: "Prédictions du futur", onClick: () => navigate("/predictions") },
    { icon: Gamepad2, title: "Mini-Jeux", description: "Arcade néon", onClick: () => navigate("/games") },
    { icon: Trophy, title: "Course Cyber-CEI", description: "Course de chevaux futuriste", onClick: () => navigate("/horses") },
    { icon: Swords, title: "Chess of Space", description: "Échecs quantiques", onClick: () => navigate("/chess") },
    { icon: Activity, title: "Nanomédecine", description: "Thérapies du futur", onClick: () => navigate("/nanomedicine") },
    { icon: Clock, title: "Voyage Temporel", description: "Exploration 2025-2110", onClick: () => navigate("/timetravel") },
    { icon: Earth, title: "Évolution Terrestre", description: "Chronologie 2025-2100", onClick: () => navigate("/earth") },
    { icon: GlobeIcon, title: "Horloges Planétaires", description: "Temps multi-mondes", onClick: () => navigate("/clocks") },
    { icon: GlobeMap, title: "Globe 3D", description: "Carte interactive mondiale", onClick: () => navigate("/globe") },
    { icon: Lock, title: "Verrouillage", description: "Écran de sécurité spatial", onClick: () => navigate("/lock") },
    { icon: Image, title: "Fonds d'écran", description: "Galerie cyberpunk IA", onClick: () => navigate("/wallpapers") },
    { icon: Mic, title: "Assistant Vocal", description: "Commandes vocales locales", onClick: () => navigate("/voice") },
    { icon: FileText, title: "Notes", description: "Mémoire quantique", onClick: () => navigate("/notes") },
    { icon: Terminal, title: "Terminal", description: "Console système", onClick: () => navigate("/terminal") },
  ];

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
            MODULES SYSTÈME
          </h1>
          <p className="text-muted-foreground">Centre de contrôle neuronal</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {modules.map(({ icon: Icon, title, description, onClick }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClick}
            >
              <CyberCard className="p-6 text-center space-y-3 cursor-pointer hover:border-primary transition-all duration-300" glow>
                <Icon className="h-10 w-10 mx-auto text-primary" />
                <div>
                  <h3 className="font-orbitron font-bold text-foreground">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </div>
              </CyberCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modules;
