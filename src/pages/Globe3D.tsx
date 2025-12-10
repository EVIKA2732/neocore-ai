import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Globe from "react-globe.gl";
import { CyberCard } from "@/components/CyberCard";
import { Globe as GlobeIcon, MapPin, ZoomIn, ZoomOut, Eye, Layers, RotateCcw, Sun } from "lucide-react";
import { CyberButton } from "@/components/CyberButton";
import { Switch } from "@/components/ui/switch";

type Location = {
  lat: number;
  lng: number;
  name: string;
  description: string;
  color: string;
  population?: string;
  utc: string;
};

const LOCATIONS: Location[] = [
  // Europe
  { lat: 48.8566, lng: 2.3522, name: "Paris", description: "France", color: "#00d4ff", population: "12.2M", utc: "UTC+1" },
  { lat: 51.5074, lng: -0.1278, name: "Londres", description: "Royaume-Uni", color: "#ff6b00", population: "9.5M", utc: "UTC+0" },
  { lat: 52.52, lng: 13.405, name: "Berlin", description: "Allemagne", color: "#ffea00", population: "3.7M", utc: "UTC+1" },
  { lat: 41.9028, lng: 12.4964, name: "Rome", description: "Italie", color: "#00ff9d", population: "4.3M", utc: "UTC+1" },
  { lat: 40.4168, lng: -3.7038, name: "Madrid", description: "Espagne", color: "#ff00ea", population: "6.7M", utc: "UTC+1" },
  { lat: 55.7558, lng: 37.6173, name: "Moscou", description: "Russie", color: "#b400ff", population: "12.5M", utc: "UTC+3" },
  { lat: 59.3293, lng: 18.0686, name: "Stockholm", description: "Suède", color: "#00ffff", population: "1.6M", utc: "UTC+1" },
  { lat: 52.3676, lng: 4.9041, name: "Amsterdam", description: "Pays-Bas", color: "#ff8800", population: "1.1M", utc: "UTC+1" },
  
  // Amérique du Nord
  { lat: 40.7128, lng: -74.006, name: "New York", description: "États-Unis", color: "#ff00ea", population: "18.8M", utc: "UTC-5" },
  { lat: 34.0522, lng: -118.2437, name: "Los Angeles", description: "États-Unis", color: "#ff6600", population: "13.2M", utc: "UTC-8" },
  { lat: 41.8781, lng: -87.6298, name: "Chicago", description: "États-Unis", color: "#00ff88", population: "9.5M", utc: "UTC-6" },
  { lat: 29.7604, lng: -95.3698, name: "Houston", description: "États-Unis", color: "#ffcc00", population: "7.1M", utc: "UTC-6" },
  { lat: 43.6532, lng: -79.3832, name: "Toronto", description: "Canada", color: "#ff0066", population: "6.2M", utc: "UTC-5" },
  { lat: 19.4326, lng: -99.1332, name: "Mexico", description: "Mexique", color: "#ff0062", population: "21.8M", utc: "UTC-6" },
  { lat: 25.7617, lng: -80.1918, name: "Miami", description: "États-Unis", color: "#00ffaa", population: "6.2M", utc: "UTC-5" },
  { lat: 47.6062, lng: -122.3321, name: "Seattle", description: "États-Unis", color: "#66ff00", population: "4.0M", utc: "UTC-8" },
  
  // Amérique du Sud
  { lat: -23.5505, lng: -46.6333, name: "São Paulo", description: "Brésil", color: "#00ffff", population: "22.0M", utc: "UTC-3" },
  { lat: -34.6037, lng: -58.3816, name: "Buenos Aires", description: "Argentine", color: "#66ff00", population: "15.4M", utc: "UTC-3" },
  { lat: -22.9068, lng: -43.1729, name: "Rio de Janeiro", description: "Brésil", color: "#ffff00", population: "13.6M", utc: "UTC-3" },
  { lat: -12.0464, lng: -77.0428, name: "Lima", description: "Pérou", color: "#ff6699", population: "10.7M", utc: "UTC-5" },
  { lat: -33.4489, lng: -70.6693, name: "Santiago", description: "Chili", color: "#ff9900", population: "7.1M", utc: "UTC-4" },
  
  // Asie
  { lat: 35.6762, lng: 139.6503, name: "Tokyo", description: "Japon", color: "#00ff9d", population: "37.4M", utc: "UTC+9" },
  { lat: 31.2304, lng: 121.4737, name: "Shanghai", description: "Chine", color: "#ff3366", population: "27.0M", utc: "UTC+8" },
  { lat: 39.9042, lng: 116.4074, name: "Beijing", description: "Chine", color: "#ffaa00", population: "21.5M", utc: "UTC+8" },
  { lat: 28.6139, lng: 77.209, name: "New Delhi", description: "Inde", color: "#00ccff", population: "32.9M", utc: "UTC+5:30" },
  { lat: 19.076, lng: 72.8777, name: "Mumbai", description: "Inde", color: "#ff00cc", population: "21.0M", utc: "UTC+5:30" },
  { lat: 37.5665, lng: 126.978, name: "Séoul", description: "Corée du Sud", color: "#00ff66", population: "25.6M", utc: "UTC+9" },
  { lat: 1.3521, lng: 103.8198, name: "Singapour", description: "Singapour", color: "#ff9900", population: "5.9M", utc: "UTC+8" },
  { lat: 22.3193, lng: 114.1694, name: "Hong Kong", description: "Chine", color: "#cc00ff", population: "7.5M", utc: "UTC+8" },
  { lat: 25.2048, lng: 55.2708, name: "Dubaï", description: "Émirats", color: "#ffdd00", population: "3.5M", utc: "UTC+4" },
  { lat: 13.7563, lng: 100.5018, name: "Bangkok", description: "Thaïlande", color: "#ff6699", population: "10.7M", utc: "UTC+7" },
  { lat: 35.1796, lng: 136.9066, name: "Nagoya", description: "Japon", color: "#00ffcc", population: "9.1M", utc: "UTC+9" },
  
  // Océanie
  { lat: -33.8688, lng: 151.2093, name: "Sydney", description: "Australie", color: "#ffea00", population: "5.4M", utc: "UTC+11" },
  { lat: -37.8136, lng: 144.9631, name: "Melbourne", description: "Australie", color: "#00ffaa", population: "5.1M", utc: "UTC+11" },
  { lat: -36.8509, lng: 174.7645, name: "Auckland", description: "Nouvelle-Zélande", color: "#00ff88", population: "1.7M", utc: "UTC+13" },
  
  // Afrique
  { lat: -33.9249, lng: 18.4241, name: "Le Cap", description: "Afrique du Sud", color: "#ff6600", population: "4.7M", utc: "UTC+2" },
  { lat: 30.0444, lng: 31.2357, name: "Le Caire", description: "Égypte", color: "#ffcc66", population: "21.3M", utc: "UTC+2" },
  { lat: 6.5244, lng: 3.3792, name: "Lagos", description: "Nigeria", color: "#00ff00", population: "15.4M", utc: "UTC+1" },
  { lat: -1.2921, lng: 36.8219, name: "Nairobi", description: "Kenya", color: "#ff3333", population: "4.7M", utc: "UTC+3" },
  { lat: 33.5731, lng: -7.5898, name: "Casablanca", description: "Maroc", color: "#00ccff", population: "3.7M", utc: "UTC+1" },
];

const Globe3D = () => {
  const globeEl = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [altitude, setAltitude] = useState(2.5);
  const [showBorders, setShowBorders] = useState(true);
  const [showTimezones, setShowTimezones] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.3);
  const [satelliteView, setSatelliteView] = useState(false);

  useEffect(() => {
    if (!globeEl.current) return;

    const globe = globeEl.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = rotationSpeed;
    globe.controls().enableZoom = true;
    
    setGlobeReady(true);
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
  }, [rotationSpeed]);

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

  const globeTexture = satelliteView 
    ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
    : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

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
            {LOCATIONS.length} villes mondiales • Fuseaux UTC • Cliquez pour explorer
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
                  globeImageUrl={globeTexture}
                  bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                  backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                  showGraticules={showTimezones}
                  pointsData={LOCATIONS}
                  pointAltitude={0.02}
                  pointColor={(d: any) => d.color}
                  pointRadius={0.4}
                  pointLabel={(d: any) => `
                    <div style="background: rgba(0,0,0,0.95); padding: 12px; border-radius: 8px; border: 2px solid ${d.color}; min-width: 180px; backdrop-filter: blur(10px);">
                      <div style="color: ${d.color}; font-weight: bold; font-family: 'Orbitron', sans-serif; font-size: 14px;">${d.name}</div>
                      <div style="color: #aaa; font-size: 12px; margin-top: 4px;">${d.description}</div>
                      ${d.population ? `<div style="color: #00d4ff; font-size: 11px; margin-top: 4px;">👥 Population: ${d.population}</div>` : ''}
                      <div style="color: #ffea00; font-size: 11px; margin-top: 2px;">🕐 ${d.utc}</div>
                    </div>
                  `}
                  onPointClick={(point: any) => handleLocationClick(point as Location)}
                  atmosphereColor={satelliteView ? "rgba(255, 150, 50, 0.2)" : "rgba(0, 212, 255, 0.3)"}
                  atmosphereAltitude={0.25}
                  enablePointerInteraction={true}
                />
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                <CyberButton variant="ghost" icon={ZoomIn} onClick={zoomIn} />
                <CyberButton variant="ghost" icon={ZoomOut} onClick={zoomOut} />
              </div>
              
              {/* View Mode Indicator */}
              <div className="absolute top-6 left-6 bg-cyber-dark/80 px-3 py-1 rounded-full border border-primary/30">
                <span className="text-xs font-orbitron text-primary">
                  {satelliteView ? "🌙 Vue Nocturne" : "🌍 Vue Satellite"}
                </span>
              </div>
            </CyberCard>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:w-80 space-y-4">
            {/* Controls */}
            <CyberCard className="p-4 space-y-4">
              <CyberButton variant="primary" icon={RotateCcw} onClick={resetView} fullWidth>
                Réinitialiser la vue
              </CyberButton>
              
              {/* Display Options */}
              <div className="space-y-3 pt-2 border-t border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-xs font-orbitron">Fuseaux horaires</span>
                  </div>
                  <Switch checked={showTimezones} onCheckedChange={setShowTimezones} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-primary" />
                    <span className="text-xs font-orbitron">Vue nocturne</span>
                  </div>
                  <Switch checked={satelliteView} onCheckedChange={setSatelliteView} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-orbitron text-muted-foreground">Vitesse rotation</span>
                    <span className="text-xs text-primary">{rotationSpeed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
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
                    <p className="text-accent">🕐 {selectedLocation.utc}</p>
                  </div>
                </CyberCard>
              </motion.div>
            )}

            {/* Location List */}
            <CyberCard className="p-4" glow>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-orbitron font-bold text-primary text-sm">Villes ({LOCATIONS.length})</h2>
              </div>
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
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
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-orbitron text-xs truncate" style={{ color: loc.color }}>
                            {loc.name}
                          </span>
                          <span className="text-[10px] text-accent ml-2">{loc.utc}</span>
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