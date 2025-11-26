import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Activity } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

type MusicGenre = "jazz" | "metal" | "funk" | "rap_us" | "rap_de" | "electro" | "house" | "ambient" | "synthwave" | "cyberpunk";

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: MusicGenre;
  duration: number;
  energy: number; // 1-10, used for smart selection
}

const MUSIC_LIBRARY: Track[] = [
  // Jazz
  { id: "j1", title: "Midnight Blue", artist: "Cyber Jazz Ensemble", genre: "jazz", duration: 245, energy: 3 },
  { id: "j2", title: "Neon Lounge", artist: "Digital Quartet", genre: "jazz", duration: 298, energy: 4 },
  { id: "j3", title: "Holographic Dreams", artist: "AI Jazz Collective", genre: "jazz", duration: 312, energy: 2 },
  
  // Metal
  { id: "m1", title: "Circuit Breaker", artist: "Neural Chaos", genre: "metal", duration: 267, energy: 10 },
  { id: "m2", title: "Titanium Assault", artist: "Mech Warriors", genre: "metal", duration: 289, energy: 9 },
  { id: "m3", title: "Quantum Rage", artist: "Void Destroyers", genre: "metal", duration: 234, energy: 10 },
  
  // Funk
  { id: "f1", title: "Groove Station", artist: "Funktronic Band", genre: "funk", duration: 256, energy: 7 },
  { id: "f2", title: "Electric Slide", artist: "Retro Future Crew", genre: "funk", duration: 243, energy: 6 },
  { id: "f3", title: "Bass Galaxy", artist: "Space Groove", genre: "funk", duration: 278, energy: 7 },
  
  // Rap US
  { id: "r1", title: "Neo City Nights", artist: "Cyber MC", genre: "rap_us", duration: 198, energy: 8 },
  { id: "r2", title: "Digital Hustle", artist: "AI Flow", genre: "rap_us", duration: 223, energy: 7 },
  { id: "r3", title: "Future Streets", artist: "Tech Rhymes", genre: "rap_us", duration: 245, energy: 8 },
  
  // Rap DE
  { id: "rd1", title: "Neon Strassen", artist: "Cyber Deutsche", genre: "rap_de", duration: 212, energy: 7 },
  { id: "rd2", title: "Zukunft Jetzt", artist: "Digital Flow DE", genre: "rap_de", duration: 234, energy: 8 },
  { id: "rd3", title: "Techno Bars", artist: "KI Rapper", genre: "rap_de", duration: 198, energy: 7 },
  
  // Electro
  { id: "e1", title: "Voltage Rush", artist: "Electron Pulse", genre: "electro", duration: 289, energy: 9 },
  { id: "e2", title: "Circuits Alive", artist: "Tech Waves", genre: "electro", duration: 267, energy: 8 },
  { id: "e3", title: "Binary Beat", artist: "Digital Storm", genre: "electro", duration: 298, energy: 9 },
  
  // House
  { id: "h1", title: "Deep Space", artist: "House Galaxy", genre: "house", duration: 356, energy: 6 },
  { id: "h2", title: "Cosmic Dance", artist: "Stellar Beats", genre: "house", duration: 334, energy: 7 },
  { id: "h3", title: "Nebula Groove", artist: "Space House Collective", genre: "house", duration: 378, energy: 6 },
  
  // Ambient
  { id: "a1", title: "Void Meditation", artist: "Cosmic Silence", genre: "ambient", duration: 423, energy: 1 },
  { id: "a2", title: "Stellar Drift", artist: "Deep Space Audio", genre: "ambient", duration: 456, energy: 2 },
  { id: "a3", title: "Quantum Stillness", artist: "Infinite Calm", genre: "ambient", duration: 398, energy: 1 },
  
  // Synthwave
  { id: "s1", title: "Neon Highway", artist: "Retro Drive", genre: "synthwave", duration: 267, energy: 5 },
  { id: "s2", title: "Chrome Dreams", artist: "80s Future", genre: "synthwave", duration: 289, energy: 6 },
  { id: "s3", title: "Sunset Boulevard 2077", artist: "Cyber Nostalgia", genre: "synthwave", duration: 312, energy: 5 },
  
  // Cyberpunk
  { id: "c1", title: "Rain on Neon", artist: "Night City Orchestra", genre: "cyberpunk", duration: 298, energy: 4 },
  { id: "c2", title: "Corporate District", artist: "Urban AI", genre: "cyberpunk", duration: 334, energy: 5 },
  { id: "c3", title: "Underground Network", artist: "Dystopian Sounds", genre: "cyberpunk", duration: 356, energy: 6 },
];

const GENRE_LABELS: Record<MusicGenre, string> = {
  jazz: "Jazz",
  metal: "Metal",
  funk: "Funk",
  rap_us: "Rap US",
  rap_de: "Rap DE",
  electro: "Electro",
  house: "House",
  ambient: "Ambient",
  synthwave: "Synthwave",
  cyberpunk: "Cyberpunk"
};

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [selectedGenre, setSelectedGenre] = useState<MusicGenre | "all">("all");
  const [smartMode, setSmartMode] = useState(false);
  const [userActivity, setUserActivity] = useState(5); // 1-10 scale

  // Smart music selection based on user behavior
  useEffect(() => {
    if (!smartMode) return;

    const handleActivity = () => {
      const now = Date.now();
      const lastActivity = parseInt(localStorage.getItem("lastActivity") || "0");
      const timeDiff = now - lastActivity;
      
      // Quick activity = high energy needed
      if (timeDiff < 1000) {
        setUserActivity(prev => Math.min(10, prev + 1));
      } else if (timeDiff > 5000) {
        setUserActivity(prev => Math.max(1, prev - 1));
      }
      
      localStorage.setItem("lastActivity", now.toString());
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [smartMode]);

  // Auto-select track based on user activity
  useEffect(() => {
    if (!smartMode || currentTrack) return;

    const suitableTracks = MUSIC_LIBRARY.filter(track => 
      Math.abs(track.energy - userActivity) <= 2
    );

    if (suitableTracks.length > 0) {
      const randomTrack = suitableTracks[Math.floor(Math.random() * suitableTracks.length)];
      setCurrentTrack(randomTrack);
    }
  }, [userActivity, smartMode, currentTrack]);

  const filteredTracks = selectedGenre === "all" 
    ? MUSIC_LIBRARY 
    : MUSIC_LIBRARY.filter(t => t.genre === selectedGenre);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    playTrack(filteredTracks[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack) return;
    const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? filteredTracks.length - 1 : currentIndex - 1;
    playTrack(filteredTracks[prevIndex]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              BIBLIOTHÈQUE MUSICALE
            </h1>
          </div>
          <p className="text-muted-foreground">Musique libre générée par IA • {MUSIC_LIBRARY.length} morceaux</p>
        </motion.div>

        {/* Player Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CyberCard className="p-6" glow>
            <div className="space-y-4">
              {currentTrack ? (
                <>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-orbitron text-primary">{currentTrack.title}</h3>
                    <p className="text-muted-foreground">{currentTrack.artist}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {GENRE_LABELS[currentTrack.genre]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(currentTrack.duration)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <CyberButton variant="ghost" icon={SkipBack} onClick={previousTrack}>Préc.</CyberButton>
                    <CyberButton 
                      variant="primary" 
                      icon={isPlaying ? Pause : Play}
                      onClick={togglePlay}
                    >
                      {isPlaying ? "Pause" : "Play"}
                    </CyberButton>
                    <CyberButton variant="ghost" icon={SkipForward} onClick={nextTrack}>Suiv.</CyberButton>
                  </div>

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
                  Sélectionnez un morceau pour commencer
                </div>
              )}
            </div>
          </CyberCard>
        </motion.div>

        {/* Smart Mode */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <CyberCard className="p-4" glow>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shuffle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-orbitron text-sm text-primary">Mode Intelligent</p>
                  <p className="text-xs text-muted-foreground">
                    Sélection automatique selon votre activité
                  </p>
                </div>
              </div>
              <CyberButton
                variant={smartMode ? "primary" : "ghost"}
                onClick={() => setSmartMode(!smartMode)}
              >
                {smartMode ? "Activé" : "Désactivé"}
              </CyberButton>
            </div>
            {smartMode && (
              <div className="mt-3 p-3 bg-cyber-darker rounded border border-primary/20">
                <p className="text-xs text-primary">
                  Niveau d'énergie détecté: {userActivity}/10
                </p>
                <div className="mt-2 h-2 bg-cyber-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${userActivity * 10}%` }}
                  />
                </div>
              </div>
            )}
          </CyberCard>
        </motion.div>

        {/* Genre Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          <CyberButton
            variant={selectedGenre === "all" ? "primary" : "ghost"}
            onClick={() => setSelectedGenre("all")}
          >
            Tous
          </CyberButton>
          {Object.entries(GENRE_LABELS).map(([key, label]) => (
            <CyberButton
              key={key}
              variant={selectedGenre === key ? "primary" : "ghost"}
              onClick={() => setSelectedGenre(key as MusicGenre)}
            >
              {label}
            </CyberButton>
          ))}
        </div>

        {/* Track List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTracks.map((track, index) => (
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
                  <h4 className="font-orbitron text-primary">{track.title}</h4>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                      {GENRE_LABELS[track.genre]}
                    </span>
                    <span className="text-muted-foreground">{formatTime(track.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Énergie:</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-3 rounded ${
                            i < track.energy ? 'bg-primary' : 'bg-cyber-dark'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CyberCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
