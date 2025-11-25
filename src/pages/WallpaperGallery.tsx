import { useState } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Image, Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

const WALLPAPER_PROMPTS = [
  "Cyberpunk city at night with neon lights and rain, ultra high resolution",
  "Futuristic space station orbiting a neon planet, cinematic lighting",
  "Digital rain matrix code falling in neon blue and pink colors",
  "Neon samurai warrior in cyberpunk Tokyo streets, dramatic lighting",
  "Holographic interface with floating data streams, purple and cyan",
  "Dystopian megacity with flying cars and neon advertisements",
  "Quantum computer core with glowing circuits, abstract tech art",
  "Cyberpunk hacker den with multiple screens showing code",
  "Futuristic neural network visualization with glowing nodes",
  "Neon grid landscape in retrowave style with purple sunset",
  "Cybernetic eye close-up with circuit reflections",
  "Abstract digital waves in neon colors, fluid motion",
];

const WallpaperGallery = () => {
  const [wallpapers, setWallpapers] = useState<Array<{ id: number; url: string; prompt: string }>>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(null);

  const generateWallpaper = async () => {
    setGenerating(true);
    try {
      const randomPrompt = WALLPAPER_PROMPTS[Math.floor(Math.random() * WALLPAPER_PROMPTS.length)];
      
      // Simulate generation (in real app, would call image generation API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newWallpaper = {
        id: Date.now(),
        url: `https://picsum.photos/1920/1080?random=${Date.now()}`, // Placeholder
        prompt: randomPrompt
      };
      
      setWallpapers(prev => [newWallpaper, ...prev]);
      toast.success("Fond d'écran généré avec succès");
    } catch (error) {
      toast.error("Erreur lors de la génération");
    } finally {
      setGenerating(false);
    }
  };

  const applyWallpaper = (url: string) => {
    setSelectedWallpaper(url);
    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    localStorage.setItem('neocore_wallpaper', url);
    toast.success("Fond d'écran appliqué");
  };

  const downloadWallpaper = (url: string, id: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `neocore-wallpaper-${id}.jpg`;
    a.click();
    toast.success("Téléchargement démarré");
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 grid-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <Image className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              GALERIE CYBERPUNK
            </h1>
          </div>
          <p className="text-muted-foreground">Fonds d'écran générés par IA</p>
        </motion.div>

        <div className="flex justify-center">
          <CyberButton
            variant="primary"
            icon={Sparkles}
            onClick={generateWallpaper}
            disabled={generating}
          >
            {generating ? "Génération en cours..." : "Générer un fond d'écran"}
          </CyberButton>
        </div>

        {wallpapers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CyberCard className="p-12 text-center" glow>
              <Image className="h-20 w-20 text-primary/30 mx-auto mb-4" />
              <h3 className="text-xl font-orbitron text-primary mb-2">
                Aucun fond d'écran
              </h3>
              <p className="text-muted-foreground">
                Cliquez sur "Générer" pour créer votre premier fond d'écran cyberpunk
              </p>
            </CyberCard>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallpapers.map((wallpaper, index) => (
              <motion.div
                key={wallpaper.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard 
                  className="overflow-hidden group cursor-pointer"
                  glow={selectedWallpaper === wallpaper.url}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={wallpaper.url}
                      alt={wallpaper.prompt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform">
                      <div className="flex gap-2">
                        <CyberButton
                          variant="primary"
                          onClick={() => applyWallpaper(wallpaper.url)}
                          fullWidth
                        >
                          Appliquer
                        </CyberButton>
                        <CyberButton
                          variant="ghost"
                          icon={Download}
                          onClick={() => downloadWallpaper(wallpaper.url, wallpaper.id)}
                        >DL</CyberButton>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {wallpaper.prompt}
                    </p>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center">
          <CyberCard className="p-6 inline-block">
            <p className="text-sm text-muted-foreground">
              💡 Les fonds d'écran sont générés aléatoirement avec des prompts cyberpunk
            </p>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default WallpaperGallery;
