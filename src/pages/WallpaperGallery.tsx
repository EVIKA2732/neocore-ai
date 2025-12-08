import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Image, Download, Sparkles, Check, Loader2, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CYBERPUNK_PROMPTS = [
  "Cyberpunk city at night with neon lights reflecting on wet streets, flying cars, holographic advertisements, ultra detailed",
  "Futuristic Tokyo street in rain with neon signs, cyberpunk aesthetic, blade runner style",
  "Massive cyberpunk megacity skyline with towering skyscrapers, neon purple and blue lights",
  "Underground cyber hacker den with multiple holographic screens, dark atmosphere",
  "Cyberpunk alley with steam vents, neon shop signs in Japanese, rainy night",
  "Futuristic nightclub interior with holographic dancers, neon lights everywhere",
  "Cyberpunk rooftop view of megacity, flying vehicles, massive digital billboards",
  "Dark cyber street market with vendors selling tech, neon glow, atmospheric",
  "Cybernetic laboratory with glowing equipment, blue and purple lighting",
  "Abandoned cyber district with broken neon signs, moody atmosphere",
  "Futuristic cyber café with holographic menus, cozy neon ambiance",
  "Cyberpunk highway with speeding vehicles, city lights in background"
];

// High-quality cyberpunk wallpapers from Unsplash
const CYBERPUNK_IMAGES = [
  "https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=1920&q=90",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=90",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1920&q=90",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=90",
  "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=90",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=90",
  "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1920&q=90",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=90",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=90",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&q=90",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1920&q=90",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=90"
];

interface Wallpaper {
  id: number;
  url: string;
  prompt: string;
  isAI: boolean;
}

const WallpaperGallery = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [generating, setGenerating] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(70);

  // Load saved wallpaper on mount
  useEffect(() => {
    const savedWallpaper = localStorage.getItem('neocore_wallpaper');
    const savedBrightness = localStorage.getItem('neocore_wallpaper_brightness');
    if (savedWallpaper) {
      setSelectedWallpaper(savedWallpaper);
      applyWallpaperToBody(savedWallpaper, parseInt(savedBrightness || '70'));
    }
    if (savedBrightness) {
      setBrightness(parseInt(savedBrightness));
    }
  }, []);

  const applyWallpaperToBody = (url: string, bright: number = brightness) => {
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,${(100 - bright) / 100}), rgba(0,0,0,${(100 - bright) / 100})), url(${url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  };

  const generateWallpaper = async () => {
    setGenerating(true);
    try {
      const randomPrompt = CYBERPUNK_PROMPTS[Math.floor(Math.random() * CYBERPUNK_PROMPTS.length)];
      
      // Try AI generation first
      try {
        const { data, error } = await supabase.functions.invoke('ai-wallpaper', {
          body: { prompt: randomPrompt }
        });
        
        if (!error && data?.imageUrl) {
          const newWallpaper: Wallpaper = {
            id: Date.now(),
            url: data.imageUrl,
            prompt: randomPrompt,
            isAI: true
          };
          setWallpapers(prev => [newWallpaper, ...prev]);
          toast.success("Fond d'écran IA généré !");
          return;
        }
      } catch (aiError) {
        console.log("AI generation unavailable, using fallback");
      }
      
      // Fallback to curated images
      const randomImage = CYBERPUNK_IMAGES[Math.floor(Math.random() * CYBERPUNK_IMAGES.length)];
      
      const newWallpaper: Wallpaper = {
        id: Date.now(),
        url: randomImage,
        prompt: randomPrompt,
        isAI: false
      };
      
      setWallpapers(prev => [newWallpaper, ...prev]);
      toast.success("Fond d'écran cyberpunk ajouté !");
    } catch (error) {
      toast.error("Erreur lors de la génération");
    } finally {
      setGenerating(false);
    }
  };

  const applyWallpaper = (url: string) => {
    setSelectedWallpaper(url);
    applyWallpaperToBody(url, brightness);
    localStorage.setItem('neocore_wallpaper', url);
    localStorage.setItem('neocore_wallpaper_brightness', brightness.toString());
    toast.success("Fond d'écran appliqué !");
  };

  const updateBrightness = (newBrightness: number) => {
    setBrightness(newBrightness);
    if (selectedWallpaper) {
      applyWallpaperToBody(selectedWallpaper, newBrightness);
      localStorage.setItem('neocore_wallpaper_brightness', newBrightness.toString());
    }
  };

  const removeWallpaper = () => {
    setSelectedWallpaper(null);
    document.body.style.backgroundImage = '';
    document.body.style.background = '';
    localStorage.removeItem('neocore_wallpaper');
    localStorage.removeItem('neocore_wallpaper_brightness');
    toast.success("Fond d'écran supprimé");
  };

  const downloadWallpaper = async (url: string, id: number) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `neocore-wallpaper-${id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      toast.success("Téléchargement démarré !");
    } catch (error) {
      // Fallback for CORS issues
      window.open(url, '_blank');
      toast.info("Ouverture dans un nouvel onglet");
    }
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
          <p className="text-muted-foreground">Fonds d'écran haute qualité</p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <CyberButton
            variant="primary"
            icon={generating ? Loader2 : Sparkles}
            onClick={generateWallpaper}
            disabled={generating}
          >
            {generating ? "Génération..." : "Générer un fond"}
          </CyberButton>
          
          {selectedWallpaper && (
            <CyberButton variant="ghost" onClick={removeWallpaper}>
              Supprimer le fond
            </CyberButton>
          )}
        </div>

        {/* Brightness Control */}
        {selectedWallpaper && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CyberCard className="p-4 max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={brightness}
                  onChange={(e) => updateBrightness(parseInt(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <Sun className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary w-12">{brightness}%</span>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Luminosité du fond d'écran
              </p>
            </CyberCard>
          </motion.div>
        )}

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
                      loading="lazy"
                    />
                    
                    {selectedWallpaper === wallpaper.url && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    {wallpaper.isAI && (
                      <div className="absolute top-2 left-2 bg-accent/80 text-accent-foreground text-xs px-2 py-1 rounded">
                        IA
                      </div>
                    )}
                    
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
                        />
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
          <CyberCard className="p-4 inline-block">
            <p className="text-sm text-muted-foreground">
              💡 Les fonds d'écran sont générés avec des thèmes cyberpunk haute qualité
            </p>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default WallpaperGallery;