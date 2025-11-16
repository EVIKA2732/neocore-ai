import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { Globe, Clock } from "lucide-react";

interface Planet {
  name: string;
  color: string;
  dayLength: number; // in hours
  yearLength: number; // in days
  description: string;
}

const planets: Planet[] = [
  {
    name: "Terre",
    color: "bg-blue-500",
    dayLength: 24,
    yearLength: 365,
    description: "Planète d'origine"
  },
  {
    name: "Kepler-442b",
    color: "bg-green-500",
    dayLength: 112,
    yearLength: 1120,
    description: "Super-Terre habitable"
  },
  {
    name: "Proxima Centauri b",
    color: "bg-red-500",
    dayLength: 267,
    yearLength: 11.2,
    description: "Exoplanète la plus proche"
  },
  {
    name: "TRAPPIST-1e",
    color: "bg-purple-500",
    dayLength: 148,
    yearLength: 6.1,
    description: "Zone habitable système TRAPPIST"
  },
  {
    name: "Nova Centauri",
    color: "bg-cyan-500",
    dayLength: 36,
    yearLength: 892,
    description: "Colonie minière"
  }
];

const PlanetaryClocks = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPlanetTime = (planet: Planet) => {
    const earthHours = currentTime.getHours() + currentTime.getMinutes() / 60;
    const planetHours = (earthHours * 24) / planet.dayLength;
    const hours = Math.floor(planetHours) % 24;
    const minutes = Math.floor((planetHours % 1) * 60);
    
    const earthDays = Math.floor(currentTime.getTime() / (1000 * 60 * 60 * 24));
    const planetYear = Math.floor(earthDays / planet.yearLength);
    const planetDay = earthDays % planet.yearLength;

    return {
      time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      date: `Année ${planetYear} - Jour ${planetDay}`
    };
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
            <Globe className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              HORLOGES PLANÉTAIRES
            </h1>
          </div>
          <p className="text-muted-foreground">Synchronisation temporelle multi-mondes</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planets.map((planet, index) => {
            const planetTime = getPlanetTime(planet);
            return (
              <motion.div
                key={planet.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard className="p-6 space-y-4 hover:scale-105 transition-transform" glow>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${planet.color} animate-pulse`} />
                      <h3 className="font-orbitron text-lg text-primary">
                        {planet.name}
                      </h3>
                    </div>
                    <Clock className="h-5 w-5 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-3xl font-orbitron text-primary text-glow">
                      {planetTime.time}
                    </div>
                    <div className="text-sm text-muted-foreground font-mono">
                      {planetTime.date}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-primary/30">
                    <p className="text-xs text-muted-foreground mb-2">{planet.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-cyber-darker p-2 rounded border border-primary/20">
                        <div className="text-primary/70">Jour</div>
                        <div className="text-primary font-mono">{planet.dayLength}h</div>
                      </div>
                      <div className="bg-cyber-darker p-2 rounded border border-primary/20">
                        <div className="text-primary/70">Année</div>
                        <div className="text-primary font-mono">{planet.yearLength}j</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-2 bg-cyber-darker rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${planet.color}`}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${((currentTime.getSeconds() / 60) * 100)}%` 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </CyberCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CyberCard className="p-6" glow>
            <h3 className="font-orbitron text-xl text-primary mb-4">
              Synchronisation Universelle
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-cyber-darker p-4 rounded border border-primary/30">
                <div className="text-primary/70 mb-2">Temps Terrestre</div>
                <div className="text-2xl font-orbitron text-primary">
                  {currentTime.toLocaleTimeString('fr-FR')}
                </div>
              </div>
              <div className="bg-cyber-darker p-4 rounded border border-primary/30">
                <div className="text-primary/70 mb-2">Temps Galactique</div>
                <div className="text-2xl font-orbitron text-primary">
                  {Math.floor(currentTime.getTime() / 1000).toString(36).toUpperCase()}
                </div>
              </div>
              <div className="bg-cyber-darker p-4 rounded border border-primary/30">
                <div className="text-primary/70 mb-2">Cycle Stellaire</div>
                <div className="text-2xl font-orbitron text-primary">
                  {(currentTime.getTime() % 100000).toString().padStart(5, '0')}
                </div>
              </div>
            </div>
          </CyberCard>
        </motion.div>
      </div>
    </div>
  );
};

export default PlanetaryClocks;
