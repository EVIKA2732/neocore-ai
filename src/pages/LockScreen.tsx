import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberButton } from "@/components/CyberButton";
import { Lock, Unlock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const LockScreen = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("neocore_lock_password");
    if (stored) {
      setSavedPassword(stored);
    }
  }, []);

  const setupPassword = () => {
    if (password.length < 4) {
      toast.error("Le mot de passe doit contenir au moins 4 caractères");
      return;
    }
    localStorage.setItem("neocore_lock_password", password);
    setSavedPassword(password);
    setPassword("");
    setIsSetupMode(false);
    toast.success("Mot de passe défini avec succès");
  };

  const lockScreen = () => {
    if (!savedPassword) {
      toast.error("Veuillez d'abord définir un mot de passe");
      setIsSetupMode(true);
      return;
    }
    setIsLocked(true);
    toast.success("Écran verrouillé");
  };

  const unlockScreen = () => {
    if (inputPassword === savedPassword) {
      setIsLocked(false);
      setInputPassword("");
      toast.success("Déverrouillé");
    } else {
      toast.error("Mot de passe incorrect");
      setInputPassword("");
    }
  };

  const removePassword = () => {
    localStorage.removeItem("neocore_lock_password");
    setSavedPassword("");
    setPassword("");
    setIsSetupMode(false);
    setIsLocked(false);
    toast.success("Mot de passe supprimé");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyber-dark to-black">
        {/* Stars */}
        {Array.from({ length: 200 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Earth */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="relative w-[600px] h-[600px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-green-400 to-blue-600 opacity-90 shadow-[0_0_100px_rgba(59,130,246,0.5)]" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-transparent" />
            {/* Cloud layer */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Atmospheric glow */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent" />
      </div>

      {/* Lock Screen Overlay */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-cyber-dark/90 border-2 border-primary/50 rounded-lg p-8 w-full max-w-md space-y-6 neon-glow"
            >
              <div className="text-center space-y-2">
                <Lock className="h-16 w-16 text-primary mx-auto animate-glow-pulse" />
                <h2 className="text-2xl font-orbitron text-primary text-glow">
                  ÉCRAN VERROUILLÉ
                </h2>
                <p className="text-muted-foreground">Entrez le mot de passe pour déverrouiller</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && unlockScreen()}
                    placeholder="Mot de passe"
                    className="bg-cyber-darker border-primary/30 text-primary pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <CyberButton
                  variant="primary"
                  icon={Unlock}
                  onClick={unlockScreen}
                  fullWidth
                >
                  Déverrouiller
                </CyberButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel */}
      {!isLocked && (
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-cyber-dark/80 backdrop-blur-sm border-2 border-primary/50 rounded-lg p-8 w-full max-w-md space-y-6 neon-glow"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-orbitron text-primary text-glow">
                ÉCRAN DE VERROUILLAGE
              </h1>
              <p className="text-muted-foreground">
                Vue de la Terre depuis l'espace
              </p>
            </div>

            {!savedPassword || isSetupMode ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-primary mb-2 block">
                    Définir un mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 4 caractères"
                      className="bg-cyber-darker border-primary/30 text-primary pr-10"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <CyberButton
                  variant="primary"
                  icon={Lock}
                  onClick={setupPassword}
                  fullWidth
                >
                  Enregistrer
                </CyberButton>

                {savedPassword && (
                  <CyberButton
                    variant="ghost"
                    onClick={() => setIsSetupMode(false)}
                    fullWidth
                  >
                    Annuler
                  </CyberButton>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 border border-primary/30 rounded">
                  <p className="text-sm text-primary text-center">
                    ✓ Mot de passe configuré
                  </p>
                </div>

                <CyberButton
                  variant="primary"
                  icon={Lock}
                  onClick={lockScreen}
                  fullWidth
                >
                  Verrouiller l'écran
                </CyberButton>

                <div className="grid grid-cols-2 gap-3">
                  <CyberButton
                    variant="ghost"
                    onClick={() => setIsSetupMode(true)}
                  >
                    Modifier
                  </CyberButton>
                  <CyberButton
                    variant="accent"
                    onClick={removePassword}
                  >
                    Supprimer
                  </CyberButton>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-primary/20">
              <p className="text-xs text-muted-foreground text-center">
                Le mot de passe est stocké localement dans votre navigateur
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LockScreen;
