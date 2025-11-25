import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Mic, MicOff, Volume2, VolumeX, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface VoiceMessage {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Load messages from localStorage
    const stored = localStorage.getItem("neocore_voice_messages");
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        addMessage(text, true);
        respondToUser(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error("Erreur de reconnaissance vocale");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: VoiceMessage = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      isUser
    };
    
    setMessages(prev => {
      const updated = [...prev, newMessage];
      localStorage.setItem("neocore_voice_messages", JSON.stringify(updated));
      return updated;
    });
  };

  const respondToUser = (userText: string) => {
    const lowerText = userText.toLowerCase();
    let response = "";

    // Simple AI responses based on keywords
    if (lowerText.includes("bonjour") || lowerText.includes("salut")) {
      response = "Bonjour! Je suis l'assistant vocal de NeoCore AI. Comment puis-je vous aider?";
    } else if (lowerText.includes("heure")) {
      response = `Il est ${new Date().toLocaleTimeString('fr-FR')}.`;
    } else if (lowerText.includes("date")) {
      response = `Nous sommes le ${new Date().toLocaleDateString('fr-FR')}.`;
    } else if (lowerText.includes("météo")) {
      response = "Je n'ai pas accès aux données météo en temps réel, mais je peux vous suggérer de consulter le module de prévisions quantiques.";
    } else if (lowerText.includes("musique")) {
      response = "Vous pouvez accéder à la bibliothèque musicale via le menu principal. Nous avons plus de 30 morceaux dans différents styles.";
    } else if (lowerText.includes("jeu") || lowerText.includes("jouer")) {
      response = "NeoCore AI propose plusieurs jeux: Snake, Ghost Evasion, et Chess of Space. Quel jeu vous intéresse?";
    } else if (lowerText.includes("aide")) {
      response = "Je peux vous renseigner sur les modules disponibles, l'heure, la date, ou répondre à vos questions sur NeoCore AI.";
    } else if (lowerText.includes("merci")) {
      response = "De rien! Je suis là pour vous aider.";
    } else {
      response = "Je n'ai pas compris votre demande. Essayez de me demander l'heure, la date, ou des informations sur les modules disponibles.";
    }

    addMessage(response, false);
    speak(response);
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("La reconnaissance vocale n'est pas supportée par votre navigateur");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
      toast.success("Écoute activée");
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("neocore_voice_messages");
    toast.success("Historique effacé");
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Mic className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              ASSISTANT VOCAL
            </h1>
          </div>
          <p className="text-muted-foreground">Contrôle vocal avec données locales uniquement</p>
        </motion.div>

        {/* Voice Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CyberCard className="p-8" glow>
            <div className="flex flex-col items-center justify-center space-y-6">
              <motion.div
                animate={{
                  scale: isListening ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 1.5,
                  repeat: isListening ? Infinity : 0,
                }}
                className={`relative w-32 h-32 rounded-full flex items-center justify-center ${
                  isListening ? 'bg-primary/20' : 'bg-cyber-darker'
                }`}
              >
                {isListening && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary"
                    animate={{
                      scale: [1, 1.5],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                )}
                <Mic className={`h-16 w-16 ${isListening ? 'text-primary' : 'text-muted-foreground'}`} />
              </motion.div>

              {transcript && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-primary text-center max-w-md"
                >
                  "{transcript}"
                </motion.p>
              )}

              <div className="flex gap-3">
                <CyberButton
                  variant={isListening ? "accent" : "primary"}
                  icon={isListening ? MicOff : Mic}
                  onClick={toggleListening}
                >
                  {isListening ? "Arrêter l'écoute" : "Activer l'écoute"}
                </CyberButton>

                {isSpeaking && (
                  <CyberButton
                    variant="ghost"
                    icon={VolumeX}
                    onClick={stopSpeaking}
                  >
                    Couper le son
                  </CyberButton>
                )}
              </div>

              <div className="text-center space-y-1">
                <p className="text-sm text-primary">
                  {isListening ? "🎤 Écoute en cours..." : isSpeaking ? "🔊 Réponse en cours..." : "Prêt"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Toutes les données vocales sont stockées localement
                </p>
              </div>
            </div>
          </CyberCard>
        </motion.div>

        {/* Message History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-orbitron text-primary">Historique</h3>
            {messages.length > 0 && (
              <CyberButton variant="ghost" icon={Trash2} onClick={clearMessages}>
                Effacer
              </CyberButton>
            )}
          </div>

          {messages.length === 0 ? (
            <CyberCard className="p-8 text-center">
              <p className="text-muted-foreground">Aucun message pour le moment</p>
            </CyberCard>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: message.isUser ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <CyberCard
                        className={`p-4 max-w-md ${
                          message.isUser ? 'bg-primary/10' : 'bg-cyber-darker'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!message.isUser && <Volume2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{message.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {message.timestamp.toLocaleTimeString('fr-FR')}
                            </p>
                          </div>
                          {message.isUser && <Mic className="h-4 w-4 text-primary mt-1 flex-shrink-0" />}
                        </div>
                      </CyberCard>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Instructions */}
        <CyberCard className="p-6">
          <h3 className="font-orbitron text-primary mb-3">Commandes vocales</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>• "Quelle heure est-il?"</div>
            <div>• "Quelle est la date?"</div>
            <div>• "Ouvre la musique"</div>
            <div>• "Lancer un jeu"</div>
            <div>• "Aide"</div>
            <div>• "Merci"</div>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};

export default VoiceAssistant;
