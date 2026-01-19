import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Mic, MicOff, Volume2, VolumeX, Trash2, Cloud, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [isProcessing, setIsProcessing] = useState(false);
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
        processUserRequest(text);
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

  const processUserRequest = async (userText: string) => {
    setIsProcessing(true);
    const lowerText = userText.toLowerCase();
    let response = "";

    try {
      // Requêtes dynamiques avec Internet
      if (lowerText.includes("météo")) {
        const city = extractCity(lowerText) || "Paris";
        response = await fetchWeather(city);
      } else if (lowerText.includes("heure") && (lowerText.includes("à") || lowerText.includes("au") || lowerText.includes("en"))) {
        const city = extractCity(lowerText) || "Paris";
        response = getTimeForCity(city);
      } else if (lowerText.includes("heure")) {
        response = `Il est ${new Date().toLocaleTimeString('fr-FR')}.`;
      } else if (lowerText.includes("date")) {
        response = `Nous sommes le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
      } else if (lowerText.includes("bonjour") || lowerText.includes("salut") || lowerText.includes("hello")) {
        response = "Salut ! Je suis l'assistant vocal NeoCore. Pose-moi tes questions ou demande la météo, l'heure dans une ville, ou des infos sur les modules.";
      } else if (lowerText.includes("musique")) {
        response = "Tu peux accéder au lecteur de musique IA depuis le menu. Génère des morceaux dans le style que tu veux : rap, jazz, cyberpunk...";
      } else if (lowerText.includes("jeu") || lowerText.includes("jouer")) {
        response = "NeoCore propose Snake, les courses de chevaux Cyber-CEI, et les échecs galactiques. Quel jeu te tente ?";
      } else if (lowerText.includes("merci")) {
        response = "Pas de quoi ! Je suis là pour ça.";
      } else if (lowerText.includes("créateur") || lowerText.includes("créé") || lowerText.includes("qui t'a fait")) {
        response = "Mon créateur, c'est Mike. Il m'a développé sans utiliser de LLM externe.";
      } else {
        // Utiliser l'IA pour les autres requêtes
        response = await getAIResponse(userText);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      response = "Désolé, je n'ai pas pu traiter cette demande. Réessaie.";
    }

    setIsProcessing(false);
    addMessage(response, false);
    speak(response);
  };

  const extractCity = (text: string): string | null => {
    const cityPatterns = [
      /météo (?:à|au|en|de) (.+?)(?:\s|$|\?)/i,
      /heure (?:à|au|en|de) (.+?)(?:\s|$|\?)/i,
      /temps (?:à|au|en|de) (.+?)(?:\s|$|\?)/i
    ];
    
    for (const pattern of cityPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };

  const fetchWeather = async (city: string): Promise<string> => {
    // Simulation de météo réaliste (sans API externe pour le moment)
    const conditions = ["ensoleillé", "nuageux", "partiellement nuageux", "pluvieux", "orageux"];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temp = Math.floor(Math.random() * 25) + 5;
    const humidity = Math.floor(Math.random() * 40) + 40;
    
    return `Météo à ${city} : ${condition}, ${temp}°C, humidité ${humidity}%. Données simulées localement.`;
  };

  const getTimeForCity = (city: string): string => {
    const timezones: Record<string, string> = {
      "paris": "Europe/Paris",
      "new york": "America/New_York",
      "tokyo": "Asia/Tokyo",
      "londres": "Europe/London",
      "london": "Europe/London",
      "sydney": "Australia/Sydney",
      "los angeles": "America/Los_Angeles",
      "berlin": "Europe/Berlin",
      "moscou": "Europe/Moscow",
      "dubai": "Asia/Dubai",
      "pékin": "Asia/Shanghai",
      "beijing": "Asia/Shanghai"
    };

    const tz = timezones[city.toLowerCase()] || "Europe/Paris";
    const time = new Date().toLocaleTimeString('fr-FR', { timeZone: tz });
    return `Il est ${time} à ${city}.`;
  };

  const getAIResponse = async (text: string): Promise<string> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }]
        }),
      });

      if (!response.ok) {
        throw new Error("AI request failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      let fullResponse = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) fullResponse += content;
            } catch {}
          }
        }
      }

      return fullResponse || "Je n'ai pas compris. Reformule ta question.";
    } catch (error) {
      return "Désolé, je ne peux pas répondre pour le moment.";
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    
    // Nettoyer le texte des emojis et caractères spéciaux pour une meilleure synthèse
    const cleanText = text.replace(/[⚠️🎵🧠💡🔧❤️💪🌟]/g, '').trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Sélectionner une voix française si disponible
    const voices = synthRef.current.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith('fr'));
    if (frenchVoice) utterance.voice = frenchVoice;
    
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
          <p className="text-muted-foreground">Contrôle vocal intelligent avec requêtes dynamiques</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2"
        >
          <CyberButton variant="ghost" icon={Cloud} onClick={() => {
            addMessage("Quelle est la météo à Paris ?", true);
            processUserRequest("Quelle est la météo à Paris ?");
          }}>
            Météo Paris
          </CyberButton>
          <CyberButton variant="ghost" icon={Clock} onClick={() => {
            addMessage("Quelle heure est-il à Tokyo ?", true);
            processUserRequest("Quelle heure est-il à Tokyo ?");
          }}>
            Heure Tokyo
          </CyberButton>
          <CyberButton variant="ghost" icon={MapPin} onClick={() => {
            addMessage("Quelle est la météo à New York ?", true);
            processUserRequest("Quelle est la météo à New York ?");
          }}>
            Météo NYC
          </CyberButton>
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
                  isListening ? 'bg-primary/20' : isProcessing ? 'bg-accent/20' : 'bg-cyber-darker'
                }`}
              >
                {(isListening || isProcessing) && (
                  <motion.div
                    className={`absolute inset-0 rounded-full border-4 ${isProcessing ? 'border-accent' : 'border-primary'}`}
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
                <Mic className={`h-16 w-16 ${isListening ? 'text-primary' : isProcessing ? 'text-accent' : 'text-muted-foreground'}`} />
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
                  disabled={isProcessing}
                >
                  {isListening ? "Arrêter" : "Parler"}
                </CyberButton>

                {isSpeaking && (
                  <CyberButton
                    variant="ghost"
                    icon={VolumeX}
                    onClick={stopSpeaking}
                  >
                    Couper
                  </CyberButton>
                )}
              </div>

              <div className="text-center space-y-1">
                <p className="text-sm text-primary">
                  {isListening ? "🎤 Écoute en cours..." : isProcessing ? "🧠 Traitement..." : isSpeaking ? "🔊 Réponse..." : "Prêt"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Données stockées localement • Requêtes internet autorisées
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
              <p className="text-muted-foreground">Dis "Bonjour" pour commencer</p>
            </CyberCard>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              <AnimatePresence>
                {messages.slice(-20).map((message) => (
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
            <div>• "Météo à [ville]"</div>
            <div>• "Quelle heure à [ville]?"</div>
            <div>• "Parle-moi de..."</div>
            <div>• "Ouvre la musique"</div>
            <div>• "Qui t'a créé?"</div>
            <div>• Questions générales</div>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};

export default VoiceAssistant;
