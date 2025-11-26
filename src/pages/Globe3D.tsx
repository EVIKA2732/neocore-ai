import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Globe from "react-globe.gl";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Globe as GlobeIcon, MapPin } from "lucide-react";

type Location = {
  lat: number;
  lng: number;
  name: string;
  description: string;
  color: string;
};

const LOCATIONS: Location[] = [
  { lat: 48.8566, lng: 2.3522, name: "Paris", description: "Capitale française", color: "#00d4ff" },
  { lat: 40.7128, lng: -74.006, name: "New York", description: "Mégapole américaine", color: "#ff00ea" },
  { lat: 35.6762, lng: 139.6503, name: "Tokyo", description: "Centre technologique", color: "#00ff9d" },
  { lat: -33.8688, lng: 151.2093, name: "Sydney", description: "Australie", color: "#ffea00" },
  { lat: 51.5074, lng: -0.1278, name: "Londres", description: "Royaume-Uni", color: "#ff6b00" },
  { lat: 55.7558, lng: 37.6173, name: "Moscou", description: "Russie", color: "#b400ff" },
  { lat: -23.5505, lng: -46.6333, name: "São Paulo", description: "Brésil", color: "#00ffff" },
  { lat: 19.4326, lng: -99.1332, name: "Mexico", description: "Mexique", color: "#ff0062" },
];

const Globe3D = () => {
  const globeEl = useRef<any>();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [globeReady, setGlobeReady] = useState(false);

  useEffect(() => {
    if (!globeEl.current) return;

    // Auto-rotate
    const globe = globeEl.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    
    setGlobeReady(true);

    // Point camera at start
    globe.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 1000);
  }, []);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    if (globeEl.current) {
      globeEl.current.pointOfView(
        { lat: location.lat, lng: location.lng, altitude: 1.5 },
        1000
      );
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
            <GlobeIcon className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              GLOBE 3D INTERACTIF
            </h1>
          </div>
          <p className="text-muted-foreground">
            Explorez la Terre en 3D - Cliquez sur les marqueurs pour découvrir les villes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CyberCard className="p-4 h-[600px]" glow>
              <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                pointsData={LOCATIONS}
                pointAltitude={0.02}
                pointColor={(d: any) => d.color}
                pointRadius={0.5}
                pointLabel={(d: any) => `
                  <div style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; border: 1px solid ${d.color};">
                    <div style="color: ${d.color}; font-weight: bold; font-family: 'Orbitron', sans-serif;">${d.name}</div>
                    <div style="color: #fff; font-size: 12px;">${d.description}</div>
                  </div>
                `}
                onPointClick={(point: any) => handleLocationClick(point as Location)}
                atmosphereColor="rgba(0, 212, 255, 0.5)"
                atmosphereAltitude={0.15}
                enablePointerInteraction={true}
              />
            </CyberCard>
          </div>

          <div className="space-y-4">
            <CyberCard className="p-4" glow>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-orbitron font-bold text-primary">Lieux Marqués</h2>
              </div>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {LOCATIONS.map((loc) => (
                  <button
                    key={`${loc.lat}-${loc.lng}`}
                    onClick={() => handleLocationClick(loc)}
                    className={`w-full p-3 rounded border transition-all text-left ${
                      selectedLocation?.name === loc.name
                        ? "border-primary bg-primary/20 neon-glow"
                        : "border-primary/30 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: loc.color }}
                      />
                      <div>
                        <div className="font-orbitron text-sm" style={{ color: loc.color }}>
                          {loc.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{loc.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CyberCard>

            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CyberCard className="p-4 border-2" glow>
                  <h3 className="font-orbitron font-bold text-lg mb-2" style={{ color: selectedLocation.color }}>
                    {selectedLocation.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{selectedLocation.description}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>📍 Latitude: {selectedLocation.lat.toFixed(4)}°</p>
                    <p>📍 Longitude: {selectedLocation.lng.toFixed(4)}°</p>
                  </div>
                </CyberCard>
              </motion.div>
            )}

            <CyberCard className="p-4 bg-primary/5">
              <div className="text-xs text-muted-foreground space-y-2">
                <p>🎮 <strong>Contrôles :</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Clic gauche + glisser : Rotation</li>
                  <li>Molette : Zoom</li>
                  <li>Clic droit + glisser : Translation</li>
                  <li>Clic sur marqueur : Informations</li>
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
