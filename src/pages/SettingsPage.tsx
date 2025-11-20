import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Bell, Lock, Palette, Terminal as TerminalIcon, Shield, Trash2, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(false);
  const [security, setSecurity] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  const handleNotifications = (checked: boolean) => {
    setNotifications(checked);
    if (checked) {
      toast.success("Alertes neuronales activées", {
        description: "Vous recevrez des notifications système",
        className: "neon-glow"
      });
    } else {
      toast("Alertes neuronales désactivées");
    }
  };

  const handleSecurity = (checked: boolean) => {
    setSecurity(checked);
    if (checked) {
      toast.success("Pare-feu quantique activé ✅", {
        description: "Protection maximale engagée",
        className: "neon-glow"
      });
    } else {
      toast.warning("Protection désactivée", {
        description: "Système vulnérable"
      });
    }
  };

  const handleTheme = (checked: boolean) => {
    setDarkTheme(checked);
    toast(checked ? "Thème Bleu Néon activé" : "Thème Rose Néon activé", {
      className: "neon-glow"
    });
  };

  const handleDeleteAllData = () => {
    // Suppression de toutes les données localStorage
    const keysToDelete = [
      'chat_messages',
      'terminal_history',
      'notes',
      'missions',
      'snake_highscore',
      'ghost_evasion_score',
      'user_profile',
      'predictions_history'
    ];
    
    keysToDelete.forEach(key => localStorage.removeItem(key));
    
    toast.success("✅ Toutes vos données ont été supprimées définitivement", {
      description: "Conformité RGPD - Droit à l'effacement exercé",
      className: "neon-glow"
    });
  };

  const settings = [
    { 
      icon: Bell, 
      title: "Notifications", 
      description: "Activer les alertes neuronales",
      checked: notifications,
      onChange: handleNotifications
    },
    { 
      icon: Shield, 
      title: "Sécurité", 
      description: "Pare-feu quantique",
      checked: security,
      onChange: handleSecurity
    },
    { 
      icon: Palette, 
      title: "Thème", 
      description: "Bleu / Rose Néon",
      checked: darkTheme,
      onChange: handleTheme
    },
  ];

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-4xl font-orbitron font-black text-center text-primary text-glow">
          PARAMÈTRES
        </h1>

        <div className="space-y-4">
          {settings.map(({ icon: Icon, title, description, checked, onChange }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CyberCard className="p-4" glow={checked}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-orbitron font-bold">{title}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={checked}
                    onCheckedChange={onChange}
                  />
                </div>
              </CyberCard>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CyberCard className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <TerminalIcon className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-orbitron font-bold">Mode Terminal</h3>
                    <p className="text-sm text-muted-foreground">Interface de commande</p>
                  </div>
                </div>
                <CyberButton
                  variant="primary"
                  onClick={() => navigate("/terminal")}
                >
                  Accéder
                </CyberButton>
              </div>
            </CyberCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mt-8"
          >
            <CyberCard className="p-6 border-2 border-primary/30" glow>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-orbitron font-bold text-primary">RGPD & Données Personnelles</h2>
                </div>
                
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Vos droits :</strong> Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données.
                  </p>
                  <p>
                    <strong className="text-foreground">Données stockées :</strong> Notes, missions, historiques de chat, scores de jeux, préférences de thème (stockage local uniquement).
                  </p>
                  <p>
                    <strong className="text-foreground">Conservation :</strong> Les données sont stockées localement sur votre appareil. Aucune donnée n'est transmise à des tiers.
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <CyberButton
                      variant="ghost"
                      icon={Trash2}
                      className="w-full border-2 border-red-500/50 hover:border-red-500 hover:bg-red-500/10"
                    >
                      Effacer toutes mes données
                    </CyberButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-cyber-darker border-2 border-primary">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-primary font-orbitron">
                        ⚠️ Suppression Définitive
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-foreground">
                        Cette action est irréversible. Toutes vos données seront définitivement supprimées :
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Historiques de chat et conversations</li>
                          <li>Notes et missions</li>
                          <li>Scores de jeux</li>
                          <li>Préférences et paramètres</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-cyber-dark border-primary/30">
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAllData}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Confirmer la suppression
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CyberCard>

            <CyberCard className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-orbitron font-bold text-primary">Mentions Légales</h2>
                </div>
                
                <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <p className="text-foreground font-semibold border-l-4 border-primary pl-3 py-2 bg-primary/5">
                    ⚠️ DISCLAIMER GÉNÉRAL
                  </p>
                  <p>
                    NEOCORE AI est un projet spéculatif, éducatif et de divertissement. Tout contenu fourni est de nature <strong>fictionnelle et futuriste</strong>.
                  </p>
                  
                  <p className="text-foreground font-semibold mt-4">
                    ❌ Interdictions Absolues :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Aucun conseil médical, diagnostic ou thérapeutique</li>
                    <li>Aucun conseil juridique ou analyse légale</li>
                    <li>Aucun conseil fiscal, financier ou comptable</li>
                    <li>Aucun conseil d'architecture ou d'ingénierie</li>
                  </ul>

                  <p className="mt-4">
                    <strong className="text-foreground">Responsabilité :</strong> L'utilisateur reconnaît que NEOCORE AI ne remplace en aucun cas un professionnel qualifié. Pour tout conseil relevant d'une profession réglementée, consultez un expert humain certifié.
                  </p>

                  <p className="mt-4">
                    <strong className="text-foreground">Propriété intellectuelle :</strong> Les contenus spéculatifs, textes futuristes et prédictions sont générés automatiquement et ne constituent pas des faits vérifiés.
                  </p>

                  <p className="mt-4 text-center py-3 bg-primary/10 border border-primary/30 rounded text-foreground">
                    ⚠️ Contenu spéculatif, éducatif, non médical, non juridique et non professionnel.<br />
                    NEOCORE AI ne fournit aucun conseil relevant d'une profession réglementée.
                  </p>
                </div>
              </div>
            </CyberCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
