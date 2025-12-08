import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Globe from "react-globe.gl";
import { CyberCard } from "@/components/CyberCard";
import { Globe as GlobeIcon, MapPin, ZoomIn, ZoomOut } from "lucide-react";
import { CyberButton } from "@/components/CyberButton";

type Location = {
  lat: number;
  lng: number;
  name: string;
  description: string;
  color: string;
  population?: string;
};

const LOCATIONS: Location[] = [
  // Europe
  { lat: 48.8566, lng: 2.3522, name: "Paris", description: "Capitale française", color: "#00d4ff", population: "12.2M" },
  { lat: 51.5074, lng: -0.1278, name: "Londres", description: "Royaume-Uni", color: "#ff6b00", population: "9.5M" },
  { lat: 52.52, lng: 13.405, name: "Berlin", description: "Allemagne", color: "#ffea00", population: "3.7M" },
  { lat: 41.9028, lng: 12.4964, name: "Rome", description: "Italie", color: "#00ff9d", population: "4.3M" },
  { lat: 40.4168, lng: -3.7038, name: "Madrid", description: "Espagne", color: "#ff00ea", population: "6.7M" },
  { lat: 55.7558, lng: 37.6173, name: "Moscou", description: "Russie", color: "#b400ff", population: "12.5M" },
  { lat: 59.3293, lng: 18.0686, name: "Stockholm", description: "Suède", color: "#00ffff", population: "1.6M" },
  { lat: 52.3676, lng: 4.9041, name: "Amsterdam", description: "Pays-Bas", color: "#ff8800", population: "1.1M" },
  
  // Amérique du Nord
  { lat: 40.7128, lng: -74.006, name: "New York", description: "Mégapole américaine", color: "#ff00ea", population: "18.8M" },
  { lat: 34.0522, lng: -118.2437, name: "Los Angeles", description: "Californie", color: "#ff6600", population: "13.2M" },
  { lat: 41.8781, lng: -87.6298, name: "Chicago", description: "Illinois", color: "#00ff88", population: "9.5M" },
  { lat: 29.7604, lng: -95.3698, name: "Houston", description: "Texas", color: "#ffcc00", population: "7.1M" },
  { lat: 43.6532, lng: -79.3832, name: "Toronto", description: "Canada", color: "#ff0066", population: "6.2M" },
  { lat: 19.4326, lng: -99.1332, name: "Mexico City", description: "Mexique", color: "#ff0062", population: "21.8M" },
  
  // Amérique du Sud
  { lat: -23.5505, lng: -46.6333, name: "São Paulo", description: "Brésil", color: "#00ffff", population: "22.0M" },
  { lat: -34.6037, lng: -58.3816, name: "Buenos Aires", description: "Argentine", color: "#66ff00", population: "15.4M" },
  { lat: -22.9068, lng: -43.1729, name: "Rio de Janeiro", description: "Brésil", color: "#ffff00", population: "13.6M" },
  { lat: -12.0464, lng: -77.0428, name: "Lima", description: "Pérou", color: "#ff6699", population: "10.7M" },
  
  // Asie
  { lat: 35.6762, lng: 139.6503, name: "Tokyo", description: "Centre technologique", color: "#00ff9d", population: "37.4M" },
  { lat: 31.2304, lng: 121.4737, name: "Shanghai", description: "Chine", color: "#ff3366", population: "27.0M" },
  { lat: 39.9042, lng: 116.4074, name: "Beijing", description: "Capitale chinoise", color: "#ffaa00", population: "21.5M" },
  { lat: 28.6139, lng: 77.209, name: "New Delhi", description: "Inde", color: "#00ccff", population: "32.9M" },
  { lat: 19.076, lng: 72.8777, name: "Mumbai", description: "Inde", color: "#ff00cc", population: "21.0M" },
  { lat: 37.5665, lng: 126.978, name: "Séoul", description: "Corée du Sud", color: "#00ff66", population: "25.6M" },
  { lat: 1.3521, lng: 103.8198, name: "Singapour", description: "Cité-État", color: "#ff9900", population: "5.9M" },
  { lat: 22.3193, lng: 114.1694, name: "Hong Kong", description: "Chine", color: "#cc00ff", population: "7.5M" },
  { lat: 25.2048, lng: 55.2708, name: "Dubaï", description: "Émirats", color: "#ffdd00", population: "3.5M" },
  
  // Océanie
  { lat: -33.8688, lng: 151.2093, name: "Sydney", description: "Australie", color: "#ffea00", population: "5.4M" },
  { lat: -37.8136, lng: 144.9631, name: "Melbourne", description: "Australie", color: "#00ffaa", population: "5.1M" },
  
  // Afrique
  { lat: -33.9249, lng: 18.4241, name: "Le Cap", description: "Afrique du Sud", color: "#ff6600", population: "4.7M" },
  { lat: 30.0444, lng: 31.2357, name: "Le Caire", description: "Égypte", color: "#ffcc66", population: "21.3M" },
  { lat: 6.5244, lng: 3.3792, name: "Lagos", description: "Nigeria", color: "#00ff00", population: "15.4M" },
];

const Globe3D = () => {
  const globeEl = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [altitude, setAltitude] = useState(2.5);

  useEffect(() => {
    if (!globeEl.current) return;

    const globe = globeEl.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.3;
    globe.controls().enableZoom = true;
    
    setGlobeReady(true);
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
  }, []);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = false;
      globeEl.current.pointOfView(
        { lat: location.lat, lng: location.lng, altitude: 1.5 },
        1000
      );
    }
  };

  const zoomIn = () => {
    if (globeEl.current) {
      const newAlt = Math.max(0.5, altitude - 0.5);
      setAltitude(newAlt);
      globeEl.current.pointOfView({ altitude: newAlt }, 500);
    }
  };

  const zoomOut = () => {
    if (globeEl.current) {
      const newAlt = Math.min(4, altitude + 0.5);
      setAltitude(newAlt);
      globeEl.current.pointOfView({ altitude: newAlt }, 500);
    }
  };

  const resetView = () => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
      setAltitude(2.5);
      setSelectedLocation(null);
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
            <GlobeIcon className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              GLOBE 3D INTERACTIF
            </h1>
          </div>
          <p className="text-muted-foreground">
            {LOCATIONS.length} villes mondiales • Cliquez pour explorer
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Globe - Left/Center */}
          <div className="flex-1 lg:flex-[2]">
            <CyberCard className="p-4 relative" glow>
              <div ref={containerRef} className="h-[500px] lg:h-[600px] w-full">
                <Globe
                  ref={globeEl}
                  width={containerRef.current?.clientWidth || 800}
                  height={500}
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                  backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                  pointsData={LOCATIONS}
                  pointAltitude={0.02}
                  pointColor={(d: any) => d.color}
                  pointRadius={0.4}
                  pointLabel={(d: any) => `
                    <div style="background: rgba(0,0,0,0.9); padding: 10px; border-radius: 8px; border: 2px solid ${d.color}; min-width: 150px;">
                      <div style="color: ${d.color}; font-weight: bold; font-family: 'Orbitron', sans-serif; font-size: 14px;">${d.name}</div>
                      <div style="color: #aaa; font-size: 12px; margin-top: 4px;">${d.description}</div>
                      ${d.population ? `<div style="color: #00d4ff; font-size: 11px; margin-top: 4px;">Population: ${d.population}</div>` : ''}
                    </div>
                  `}
                  onPointClick={(point: any) => handleLocationClick(point as Location)}
                  atmosphereColor="rgba(0, 212, 255, 0.3)"
                  atmosphereAltitude={0.2}
                  enablePointerInteraction={true}
                />
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                <CyberButton variant="ghost" icon={ZoomIn} onClick={zoomIn} />
                <CyberButton variant="ghost" icon={ZoomOut} onClick={zoomOut} />
              </div>
            </CyberCard>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:w-80 space-y-4">
            {/* Controls */}
            <CyberCard className="p-4">
              <CyberButton variant="primary" onClick={resetView} fullWidth>
                Réinitialiser la vue
              </CyberButton>
            </CyberCard>

            {/* Selected Location Info */}
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CyberCard className="p-4 border-2" glow>
                  <h3 className="font-orbitron font-bold text-lg mb-2" style={{ color: selectedLocation.color }}>
                    {selectedLocation.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{selectedLocation.description}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>📍 Lat: {selectedLocation.lat.toFixed(4)}°</p>
                    <p>📍 Lng: {selectedLocation.lng.toFixed(4)}°</p>
                    {selectedLocation.population && (
                      <p>👥 Population: {selectedLocation.population}</p>
                    )}
                  </div>
                </CyberCard>
              </motion.div>
            )}

            {/* Location List */}
            <CyberCard className="p-4" glow>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-orbitron font-bold text-primary text-sm">Lieux ({LOCATIONS.length})</h2>
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                {LOCATIONS.map((loc) => (
                  <button
                    key={`${loc.lat}-${loc.lng}`}
                    onClick={() => handleLocationClick(loc)}
                    className={`w-full p-2 rounded border transition-all text-left text-sm ${
                      selectedLocation?.name === loc.name
                        ? "border-primary bg-primary/20"
                        : "border-primary/20 hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: loc.color }}
                      />
                      <div className="min-w-0">
                        <div className="font-orbitron text-xs truncate" style={{ color: loc.color }}>
                          {loc.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">{loc.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CyberCard>

            {/* Controls Help */}
            <CyberCard className="p-4 bg-primary/5">
              <div className="text-xs text-muted-foreground space-y-2">
                <p className="font-orbitron text-primary">🎮 Contrôles</p>
                <ul className="space-y-1 ml-2">
                  <li>• Clic + glisser : Rotation</li>
                  <li>• Molette : Zoom</li>
                  <li>• Clic marqueur : Détails</li>
                </ul>
              </div>
            </CyberCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Globe3D;