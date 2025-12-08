import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CyberButton } from "@/components/CyberButton";
import { CyberCard } from "@/components/CyberCard";
import { Zap, Database, Shield, Cpu, ArrowRight } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, title: "Ultra rapide", description: "Performance optimale sur tous les appareils" },
    { icon: Database, title: "Données sécurisées", description: "Stockage local chiffré et RGPD" },
    { icon: Shield, title: "Mode hors ligne", description: "Fonctionne partout, tout le temps" },
    { icon: Cpu, title: "IA avancée", description: "Assistant neuronal multipersonnalité" },
  ];

  const handleStart = () => {
    navigate('/modules');
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-lg mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <h1 className="text-6xl font-orbitron font-black text-primary text-glow">
              NEOCORE
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground text-lg"
          >
            Votre assistant cyberpunk personnel
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <CyberCard glow className="p-8 space-y-6">
            <h2 className="text-2xl font-orbitron font-bold text-center text-primary">
              Bienvenue dans le futur
            </h2>
            
            <div className="space-y-4">
              {features.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors"
                >
                  <Icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-orbitron font-bold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <CyberButton 
                variant="primary" 
                fullWidth 
                onClick={handleStart}
                icon={ArrowRight}
              >
                Commencer
              </CyberButton>
            </motion.div>
          </CyberCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">
            NeoCore AI v2.0 • Créé par Mike
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;