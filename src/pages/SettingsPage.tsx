import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Bell, Lock, Palette, Terminal as TerminalIcon, Shield, Trash2, FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
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

const THEMES = [
  { id: 'blue', name: 'Bleu Néon', primary: '190 100% 50%' },
  { id: 'rose', name: 'Rose Néon', primary: '330 100% 50%' },
  { id: 'green', name: 'Vert Néon', primary: '130 100% 50%' },
  { id: 'orange', name: 'Orange Néon', primary: '30 100% 50%' },
  { id: 'purple', name: 'Violet Néon', primary: '280 85% 50%' },
  { id: 'rainbow', name: 'Arc-en-ciel', primary: '340 100% 55%' },
  { id: 'magenta', name: 'Magenta', primary: '320 100% 55%' },
  { id: 'dark-gray', name: 'Gris Foncé', primary: '220 10% 50%' },
  { id: 'neon-yellow', name: 'Jaune Néon', primary: '60 100% 50%' },
  { id: 'electric-blue', name: 'Bleu Électrique', primary: '200 100% 50%' },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(false);
  const [security, setSecurity] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('blue');

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('neocore-theme') || 'blue';
    setSelectedTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('neocore-theme', themeId);
    const themeName = THEMES.find(t => t.id === themeId)?.name || themeId;
    toast.success(`Thème ${themeName} activé`, {
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

          {/* Theme selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CyberCard className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Palette className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-orbitron font-bold">Thèmes de Couleur</h3>
                    <p className="text-sm text-muted-foreground">Personnalisez l'apparence</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`p-3 rounded border-2 transition-all text-left ${
                        selectedTheme === theme.id
                          ? 'border-primary bg-primary/20 neon-glow'
                          : 'border-primary/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: `hsl(${theme.primary})` }}
                        />
                        <span className="text-xs font-orbitron">{theme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </CyberCard>
          </motion.div>

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
                    <strong className="text-foreground">Vos droits :</strong> Conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679), vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition concernant vos données personnelles.
                  </p>
                  <p>
                    <strong className="text-foreground">Données stockées localement :</strong> Notes personnelles, missions et objectifs, historiques de conversations avec l'IA, scores et progressions dans les jeux, préférences d'interface (thèmes, paramètres), fichiers audio importés (assistant vocal), musiques personnelles uploadées (max 2 Go).
                  </p>
                  <p>
                    <strong className="text-foreground">Traitement et conservation :</strong> Toutes vos données sont stockées exclusivement en local sur votre appareil (localStorage). Aucune transmission à des serveurs externes ou tiers. Aucun tracking, cookie ou analyse comportementale.
                  </p>
                  <p>
                    <strong className="text-foreground">Sécurité :</strong> Les données sont protégées par les mécanismes de sécurité de votre navigateur. Nous recommandons l'utilisation de mots de passe forts et la mise à jour régulière de votre navigateur.
                  </p>
                  <p>
                    <strong className="text-foreground">Responsable de traitement :</strong> NEOCORE AI (projet éducatif spéculatif). Pour toute question relative à vos données personnelles, utilisez le bouton de suppression ci-dessous.
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
                    ⚠️ AVERTISSEMENT GÉNÉRAL ET CADRE LÉGAL
                  </p>
                  <p>
                    <strong>Nature du projet :</strong> NEOCORE AI est un projet à caractère spéculatif, éducatif, ludique et artistique. L'ensemble des contenus présentés (prédictions, scénarios futurs, données médicales, informations scientifiques) sont de nature <strong>fictionnelle, hypothétique et futuriste</strong>. Ils ne constituent en aucun cas des informations factuelles, vérifiées ou scientifiquement validées.
                  </p>
                  
                  <p className="text-foreground font-semibold mt-4">
                    ❌ INTERDICTIONS FORMELLES ET ABSOLUES
                  </p>
                  <p className="mt-2">
                    Conformément aux législations françaises et européennes régissant les professions réglementées (notamment la loi n° 71-1130 du 31 décembre 1971, le Code de la santé publique, le Code de déontologie des avocats, etc.), NEOCORE AI ne fournit :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                    <li><strong>Aucun conseil médical</strong> : Pas de diagnostic, traitement, prescription, avis clinique ou recommandation thérapeutique (Articles L4161-1 et suivants du Code de la santé publique - exercice illégal de la médecine)</li>
                    <li><strong>Aucun conseil juridique</strong> : Pas d'analyse de textes légaux, d'interprétation de lois, de rédaction d'actes juridiques ou de consultation en droit (Loi n° 71-1130 du 31 décembre 1971 - exercice illégal du droit)</li>
                    <li><strong>Aucun conseil fiscal ou comptable</strong> : Pas de conseil en optimisation fiscale, déclarations, expertise comptable (Ordonnance n° 45-2138 du 19 septembre 1945 - exercice illégal de l'expertise comptable)</li>
                    <li><strong>Aucun conseil d'architecture ou d'ingénierie</strong> engageant la sécurité des personnes ou des biens</li>
                    <li><strong>Aucun conseil financier</strong> réglementé (investissements, placements, gestion de patrimoine)</li>
                  </ul>

                  <p className="mt-4">
                    <strong className="text-foreground">Responsabilité et limites :</strong> L'utilisateur reconnaît et accepte expressément que NEOCORE AI ne remplace en aucun cas un professionnel qualifié, diplômé et assermenté. Toute décision prise sur la base des contenus générés par NEOCORE AI relève de l'unique responsabilité de l'utilisateur. Pour tout conseil, diagnostic ou expertise relevant d'une profession réglementée, consultez impérativement un professionnel humain certifié et inscrit au tableau de son ordre professionnel.
                  </p>

                  <p className="mt-4">
                    <strong className="text-foreground">Propriété intellectuelle et contenus générés :</strong> Les contenus spéculatifs, prédictions futuristes, scénarios d'évolution et données prospectives sont générés automatiquement par intelligence artificielle. Ils ne constituent pas des faits établis, ne sont pas vérifiés scientifiquement et ne doivent pas être considérés comme des sources d'information fiables ou officielles. Toute reproduction ou utilisation commerciale sans autorisation est strictement interdite.
                  </p>

                  <p className="mt-4">
                    <strong className="text-foreground">Sources d'information :</strong> Pour des informations médicales fiables, consultez des organismes officiels (Haute Autorité de Santé, Ordre des médecins, services hospitaliers). Pour des informations juridiques, consultez le site officiel Légifrance ou un avocat inscrit au barreau. Pour des conseils financiers, consultez un Conseiller en Investissements Financiers (CIF) agréé.
                  </p>

                  <p className="mt-4">
                    <strong className="text-foreground">Mentions de conformité :</strong> Ce projet respecte le RGPD (Règlement UE 2016/679), la loi Informatique et Libertés (loi n° 78-17 du 6 janvier 1978 modifiée), et les directives européennes relatives à la protection des consommateurs et à la publicité trompeuse.
                  </p>

                  <div className="mt-6 p-4 bg-primary/10 border-2 border-primary/40 rounded-lg text-center">
                    <p className="text-foreground font-bold text-sm">
                      ⚠️ RAPPEL IMPÉRATIF ⚠️
                    </p>
                    <p className="text-foreground text-xs mt-2">
                      Contenu exclusivement spéculatif, éducatif et fictif.<br />
                      <strong>Non médical · Non juridique · Non professionnel</strong><br />
                      NEOCORE AI ne fournit aucun conseil relevant d'une profession réglementée.<br />
                      En cas de doute, consultez un professionnel qualifié.
                    </p>
                  </div>
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
