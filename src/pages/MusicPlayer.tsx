import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Music, Play, Pause, Square, SkipForward, SkipBack, Volume2, Activity, Search, Brain, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type MusicGenre = "jazz" | "metal" | "funk" | "rap" | "electro" | "house" | "ambient" | "synthwave" | "cyberpunk" | "classical" | "lofi";

const GENRE_LABELS: Record<MusicGenre, string> = {
  jazz: "Jazz",
  metal: "Metal",
  funk: "Funk",
  rap: "Rap/Hip-Hop",
  electro: "Electro",
  house: "House",
  ambient: "Ambient",
  synthwave: "Synthwave",
  cyberpunk: "Cyberpunk",
  classical: "Classical",
  lofi: "Lo-Fi"
};

// Genre-specific audio sources (free royalty-free music)
const GENRE_AUDIO_MAP: Record<MusicGenre, string[]> = {
  jazz: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  ],
  metal: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  ],
  funk: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  ],
  rap: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  ],
  electro: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
  ],
  house: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
  ],
  ambient: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3"
  ],
  synthwave: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3"
  ],
  cyberpunk: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
  ],
  classical: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3"
  ],
  lofi: [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3"
  ]
};

interface GeneratedTrack {
  id: string;
  title: string;
  genre: MusicGenre;
  url: string;
  generatedAt: Date;
}

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [smartMode, setSmartMode] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<GeneratedTrack[]>([]);
  
  // Hidden preference tracking
  const [genreClicks, setGenreClicks] = useState<Record<MusicGenre, number>>(() => {
    const saved = localStorage.getItem("neocore_genre_prefs");
    return saved ? JSON.parse(saved) : {};
  });

  // Save preferences
  useEffect(() => {
    localStorage.setItem("neocore_genre_prefs", JSON.stringify(genreClicks));
  }, [genreClicks]);

  // Initialize audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
    }

    const audio = audioRef.current;
    audio.volume = volume[0] / 100;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      if (smartMode) generateSmartTrack();
    };
    const handleCanPlay = () => {
      if (isPlaying) audio.play().catch(console.error);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [smartMode, isPlaying]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // Visualizer
  useEffect(() => {
    if (!canvasRef.current || !audioRef.current || !isPlaying) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawVisualizer = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barCount = 64;
      const barWidth = canvas.width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const height = Math.random() * canvas.height * 0.8;
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - height);
        gradient.addColorStop(0, '#00d4ff');
        gradient.addColorStop(0.5, '#b026ff');
        gradient.addColorStop(1, '#ff00aa');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 2, height);
      }

      animationRef.current = requestAnimationFrame(drawVisualizer);
    };

    drawVisualizer();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const trackGenreClick = (genre: MusicGenre) => {
    setGenreClicks(prev => ({
      ...prev,
      [genre]: (prev[genre] || 0) + 1
    }));
  };

  const getPreferredGenre = (): MusicGenre => {
    const entries = Object.entries(genreClicks) as [MusicGenre, number][];
    if (entries.length === 0) return "cyberpunk";
    
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  };

  const generateTrackForGenre = (genre: MusicGenre): GeneratedTrack => {
    const genreSources = GENRE_AUDIO_MAP[genre];
    const randomSource = genreSources[Math.floor(Math.random() * genreSources.length)];
    
    const titles: Record<MusicGenre, string[]> = {
      jazz: ["Midnight Blue", "Neon Lounge", "Cyber Sax", "Digital Swing"],
      metal: ["Circuit Breaker", "Titanium Assault", "Quantum Rage", "Neural Storm"],
      funk: ["Groove Station", "Electric Slide", "Bass Galaxy", "Funky Matrix"],
      rap: ["Neo City Nights", "Digital Hustle", "Future Streets", "Cyber Flow"],
      electro: ["Voltage Rush", "Circuits Alive", "Binary Beat", "Pulse Wave"],
      house: ["Deep Space", "Cosmic Dance", "Nebula Groove", "Club Neural"],
      ambient: ["Void Meditation", "Stellar Drift", "Quantum Peace", "Dream State"],
      synthwave: ["Neon Highway", "Chrome Dreams", "Retro Future", "Sunset 2077"],
      cyberpunk: ["Rain on Neon", "Corporate Night", "Underground", "Blade Runner"],
      classical: ["Digital Symphony", "Quantum Concerto", "Neural Orchestra", "AI Opus"],
      lofi: ["Chill Circuits", "Lazy Bytes", "Mellow Code", "Sleepy AI"]
    };

    const genreTitles = titles[genre];
    const title = genreTitles[Math.floor(Math.random() * genreTitles.length)];

    return {
      id: `track-${Date.now()}`,
      title: `${title} (${GENRE_LABELS[genre]})`,
      genre,
      url: randomSource,
      generatedAt: new Date()
    };
  };

  const generateTrack = async (genre?: MusicGenre) => {
    setIsGenerating(true);
    
    try {
      const targetGenre = genre || detectGenreFromSearch(searchQuery) || "cyberpunk";
      trackGenreClick(targetGenre);
      
      // Simulate AI generation time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTrack = generateTrackForGenre(targetGenre);
      
      setGeneratedTracks(prev => [newTrack, ...prev].slice(0, 20));
      setCurrentTrack(newTrack);
      
      if (audioRef.current) {
        audioRef.current.src = newTrack.url;
        audioRef.current.load();
        setIsPlaying(true);
        audioRef.current.play().catch(console.error);
      }
      
      toast.success(`🎵 "${newTrack.title}" généré !`);
    } catch (error) {
      toast.error("Erreur de génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSmartTrack = async () => {
    const preferredGenre = getPreferredGenre();
    toast.info(`🧠 Mode intelligent : détection de vos préférences...`);
    await generateTrack(preferredGenre);
  };

  const detectGenreFromSearch = (query: string): MusicGenre | null => {
    const q = query.toLowerCase();
    if (q.includes("jazz")) return "jazz";
    if (q.includes("metal") || q.includes("rock")) return "metal";
    if (q.includes("funk") || q.includes("disco")) return "funk";
    if (q.includes("rap") || q.includes("hip") || q.includes("hop")) return "rap";
    if (q.includes("electro") || q.includes("edm") || q.includes("dance")) return "electro";
    if (q.includes("house") || q.includes("techno")) return "house";
    if (q.includes("ambient") || q.includes("chill") || q.includes("relax")) return "ambient";
    if (q.includes("synth") || q.includes("retro") || q.includes("80")) return "synthwave";
    if (q.includes("cyber") || q.includes("futur") || q.includes("neo")) return "cyberpunk";
    if (q.includes("classic") || q.includes("orchestra") || q.includes("symphon")) return "classical";
    if (q.includes("lofi") || q.includes("lo-fi") || q.includes("study")) return "lofi";
    return null;
  };

  const playTrack = (track: GeneratedTrack) => {
    setCurrentTrack(track);
    trackGenreClick(track.genre);
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.load();
      setIsPlaying(true);
      audioRef.current.play().catch(console.error);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      generateTrack();
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Music className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              MUSIC PLAYER 2.0
            </h1>
          </div>
          <p className="text-muted-foreground">Génération musicale IA • Style adaptatif</p>
        </motion.div>

        {/* Search & Generation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <CyberCard className="p-4" glow>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3">
                <Search className="h-5 w-5 text-primary" />
                <input
                  type="text"
                  placeholder="Tapez un style : jazz, rap, cyberpunk, ambient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 bg-cyber-darker border border-primary/30 rounded px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <CyberButton
                variant="primary"
                icon={isGenerating ? Loader2 : Music}
                onClick={handleSearch}
                disabled={isGenerating || !searchQuery.trim()}
              >
                {isGenerating ? "Génération..." : "Générer"}
              </CyberButton>
            </div>
          </CyberCard>
        </motion.div>

        {/* Player Controls */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <CyberCard className="p-6" glow>
            {/* Visualizer */}
            <canvas
              ref={canvasRef}
              width={800}
              height={100}
              className="w-full h-24 rounded mb-4 bg-cyber-darker"
            />
            
            <div className="space-y-4">
              {currentTrack ? (
                <>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-orbitron text-primary">{currentTrack.title}</h3>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {GENRE_LABELS[currentTrack.genre]}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={([val]) => {
                        if (audioRef.current) audioRef.current.currentTime = val;
                      }}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <CyberButton variant="ghost" icon={SkipBack} />
                    <CyberButton 
                      variant="primary" 
                      icon={isPlaying ? Pause : Play}
                      onClick={togglePlay}
                    >
                      {isPlaying ? "Pause" : "Play"}
                    </CyberButton>
                    <CyberButton variant="ghost" icon={Square} onClick={stopPlayback}>
                      Stop
                    </CyberButton>
                    <CyberButton variant="ghost" icon={SkipForward} />
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-4 w-4 text-primary" />
                    <Slider 
                      value={volume} 
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-primary w-12 text-right">{volume[0]}%</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Recherchez un style ou sélectionnez un genre pour générer de la musique
                </div>
              )}
            </div>
          </CyberCard>
        </motion.div>

        {/* Smart Mode */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <CyberCard className="p-4" glow>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-orbitron text-sm text-primary">Mode Intelligent</p>
                  <p className="text-xs text-muted-foreground">
                    Génère automatiquement selon vos préférences
                  </p>
                </div>
              </div>
              <CyberButton
                variant={smartMode ? "primary" : "ghost"}
                onClick={() => {
                  setSmartMode(!smartMode);
                  if (!smartMode) generateSmartTrack();
                }}
                disabled={isGenerating}
              >
                {smartMode ? "Activé" : "Activer"}
              </CyberButton>
            </div>
          </CyberCard>
        </motion.div>

        {/* Genre Selection */}
        <div className="space-y-2">
          <h3 className="font-orbitron text-sm text-primary text-center">Sélection par genre</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(GENRE_LABELS).map(([key, label]) => (
              <CyberButton
                key={key}
                variant="ghost"
                onClick={() => generateTrack(key as MusicGenre)}
                disabled={isGenerating}
              >
                {label}
              </CyberButton>
            ))}
          </div>
        </div>

        {/* Generated Tracks History */}
        {generatedTracks.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-orbitron text-sm text-primary">Historique</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CyberCard 
                    className={`p-4 cursor-pointer transition-all ${
                      currentTrack?.id === track.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => playTrack(track)}
                    glow={currentTrack?.id === track.id}
                  >
                    <div className="space-y-2">
                      <h4 className="font-orbitron text-primary text-sm">{track.title}</h4>
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                          {GENRE_LABELS[track.genre]}
                        </span>
                        <span className="text-muted-foreground">
                          {track.generatedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </CyberCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;