import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SleepModeProps {
  timeout?: number; // in milliseconds
  children: React.ReactNode;
}

export const SleepMode = ({ timeout = 600000, children }: SleepModeProps) => {
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
    }, 10000);

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
            className="fixed inset-0 z-[9999] bg-cyber-dark flex items-center justify-center cursor-pointer"
            onClick={() => setIsSleeping(false)}
          >
            <div className="relative">
              {/* Breathing Core */}
              <motion.div
                className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 60px rgba(0, 212, 255, 0.3)",
                    "0 0 100px rgba(0, 212, 255, 0.5)",
                    "0 0 60px rgba(0, 212, 255, 0.3)"
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/50 to-accent/50"
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <motion.div
                    className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                    animate={{
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    <span className="text-4xl">🧠</span>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Orbiting Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#00d4ff' : '#ff00ea',
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [
                      Math.cos((i * 60 * Math.PI) / 180) * 100,
                      Math.cos(((i * 60 + 360) * Math.PI) / 180) * 100
                    ],
                    y: [
                      Math.sin((i * 60 * Math.PI) / 180) * 100,
                      Math.sin(((i * 60 + 360) * Math.PI) / 180) * 100
                    ],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.5
                  }}
                />
              ))}

              {/* Text */}
              <motion.div
                className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <p className="font-orbitron text-primary text-xl mb-2">NEOCORE AI</p>
                <p className="text-muted-foreground text-sm">Mode veille • Bougez pour réveiller</p>
              </motion.div>

              {/* Background Particles */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={`bg-${i}`}
                    className="absolute w-1 h-1 rounded-full bg-primary/30"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 5
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};