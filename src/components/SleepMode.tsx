import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SleepModeProps {
  timeout?: number; // in milliseconds (default 5 minutes)
  children: React.ReactNode;
}

export const SleepMode = ({ timeout = 300000, children }: SleepModeProps) => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (isSleeping) {
        setIsSleeping(false);
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, handleActivity));

    const checkInterval = setInterval(() => {
      if (Date.now() - lastActivity > timeout) {
        setIsSleeping(true);
      }
    }, 5000);

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      clearInterval(checkInterval);
    };
  }, [lastActivity, isSleeping, timeout]);

  return (
    <>
      {children}
      <AnimatePresence>
        {isSleeping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => setIsSleeping(false)}
          >
            {/* Deep Space Background with Stars */}
            <div className="absolute inset-0">
              {/* Static stars */}
              {[...Array(200)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${0.5 + Math.random() * 2}px`,
                    height: `${0.5 + Math.random() * 2}px`,
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
              
              {/* Nebula effect */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'radial-gradient(ellipse at 30% 20%, rgba(0, 100, 255, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(180, 0, 255, 0.2) 0%, transparent 50%)',
                }}
                animate={{
                  opacity: [0.15, 0.25, 0.15],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* NASA-style Realistic Earth */}
            <div className="relative flex items-center justify-center">
              {/* Earth Glow */}
              <motion.div
                className="absolute w-72 h-72 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 150, 255, 0.4) 0%, rgba(0, 100, 200, 0.1) 50%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Earth Sphere */}
              <motion.div
                className="relative w-56 h-56 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1a4d7c 0%, #0a2540 40%, #051525 100%)',
                  boxShadow: 'inset -30px -20px 50px rgba(0,0,0,0.8), inset 20px 20px 40px rgba(100,180,255,0.1), 0 0 60px rgba(0,150,255,0.3)',
                }}
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Continents Layer */}
                <div 
                  className="absolute inset-0 rounded-full opacity-70"
                  style={{
                    background: `
                      radial-gradient(ellipse 30% 40% at 25% 35%, rgba(34,139,34,0.8) 0%, transparent 70%),
                      radial-gradient(ellipse 20% 15% at 45% 45%, rgba(34,139,34,0.6) 0%, transparent 70%),
                      radial-gradient(ellipse 25% 30% at 70% 55%, rgba(34,139,34,0.7) 0%, transparent 70%),
                      radial-gradient(ellipse 15% 20% at 80% 30%, rgba(34,139,34,0.5) 0%, transparent 70%),
                      radial-gradient(ellipse 35% 25% at 35% 70%, rgba(194,178,128,0.6) 0%, transparent 70%)
                    `,
                  }}
                />
                
                {/* Cloud Layer */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: `
                      radial-gradient(ellipse 20% 10% at 30% 25%, rgba(255,255,255,0.8) 0%, transparent 70%),
                      radial-gradient(ellipse 15% 8% at 60% 35%, rgba(255,255,255,0.6) 0%, transparent 70%),
                      radial-gradient(ellipse 25% 12% at 45% 65%, rgba(255,255,255,0.7) 0%, transparent 70%),
                      radial-gradient(ellipse 18% 10% at 75% 50%, rgba(255,255,255,0.5) 0%, transparent 70%)
                    `,
                  }}
                  animate={{
                    rotateZ: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Atmosphere Rim */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, transparent 55%, rgba(100,180,255,0.3) 80%, rgba(0,150,255,0.1) 100%)',
                  }}
                />
                
                {/* City Lights (night side) */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 75% 50%, rgba(255,200,100,0.1) 0%, transparent 30%)',
                  }}
                />
              </motion.div>

              {/* Orbiting Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#00d4ff' : '#b400ff',
                    boxShadow: `0 0 10px ${i % 2 === 0 ? '#00d4ff' : '#b400ff'}`,
                    transformOrigin: 'center center',
                  }}
                  initial={{
                    x: Math.cos((i * 45 * Math.PI) / 180) * (160 + i * 15),
                    y: Math.sin((i * 45 * Math.PI) / 180) * (160 + i * 15),
                  }}
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              ))}
            </div>

            {/* AI Consciousness Indicator */}
            <motion.div
              className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{
                      height: [8, 20 + Math.random() * 20, 8],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <p className="font-orbitron text-primary text-xl mb-2 text-glow">NEOCORE AI</p>
              <p className="text-muted-foreground text-sm">Conscience active • Bougez pour réveiller</p>
            </motion.div>

            {/* Shooting Stars */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`shooting-${i}`}
                className="absolute w-20 h-0.5 bg-gradient-to-r from-white to-transparent rounded-full"
                style={{
                  top: `${10 + i * 25}%`,
                  left: '-10%',
                  transform: 'rotate(-15deg)',
                }}
                animate={{
                  x: ['0vw', '120vw'],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 5 + Math.random() * 3,
                  repeatDelay: 8,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
