import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Cpu, Play, Plus, Trash2, Clock, Shield, Database, Zap, CheckCircle, AlertTriangle, Activity } from "lucide-react";
import { toast } from "sonner";

interface AutoTask {
  id: string;
  name: string;
  description: string;
  schedule: string;
  status: "active" | "paused" | "completed" | "running";
  lastRun?: Date;
  type: "optimization" | "backup" | "security" | "cleanup" | "report" | "custom";
}

interface ExecutionLog {
  id: string;
  taskName: string;
  timestamp: Date;
  result: "success" | "warning" | "error";
  message: string;
}

const PRESET_TASKS: Omit<AutoTask, "id" | "lastRun">[] = [
  {
    name: "Optimisation système",
    description: "Analyse et optimisation automatique des performances",
    schedule: "Quotidien à 03:00",
    status: "active",
    type: "optimization"
  },
  {
    name: "Backup données",
    description: "Sauvegarde incrémentielle des données critiques",
    schedule: "Tous les jours à 02:00",
    status: "active",
    type: "backup"
  },
  {
    name: "Nettoyage cache",
    description: "Suppression des fichiers temporaires et cache obsolète",
    schedule: "Hebdomadaire",
    status: "active",
    type: "cleanup"
  },
  {
    name: "Scan sécurité",
    description: "Vérification des vulnérabilités et menaces potentielles",
    schedule: "Quotidien à 04:00",
    status: "active",
    type: "security"
  },
  {
    name: "Rapport d'activité",
    description: "Génération du rapport hebdomadaire d'utilisation",
    schedule: "Lundi à 08:00",
    status: "active",
    type: "report"
  }
];

const TaskAutomation = () => {
  const [tasks, setTasks] = useState<AutoTask[]>(
    PRESET_TASKS.map((task, idx) => ({
      ...task,
      id: `task-${idx}`,
      lastRun: new Date(Date.now() - Math.random() * 86400000)
    }))
  );
  const [selectedTask, setSelectedTask] = useState<AutoTask | null>(null);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [runningAnimation, setRunningAnimation] = useState<{taskId: string; progress: number} | null>(null);
  const [scanResult, setScanResult] = useState<{threats: number; scanned: number} | null>(null);

  const getTaskIcon = (type: AutoTask["type"]) => {
    switch (type) {
      case "optimization": return Zap;
      case "backup": return Database;
      case "security": return Shield;
      case "cleanup": return Trash2;
      case "report": return Activity;
      default: return Cpu;
    }
  };

  const runTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Set task to running
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: "running" as const } : t
    ));

    // Start progress animation
    setRunningAnimation({ taskId, progress: 0 });

    // Simulate realistic execution with progress
    for (let i = 0; i <= 100; i += Math.random() * 15 + 5) {
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 200));
      setRunningAnimation({ taskId, progress: Math.min(i, 100) });
    }

    // Complete the task
    setRunningAnimation({ taskId, progress: 100 });
    await new Promise(resolve => setTimeout(resolve, 300));
    setRunningAnimation(null);

    // Generate result based on task type
    let result: "success" | "warning" | "error" = "success";
    let message = "";
    
    if (task.type === "security") {
      const threats = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
      const scanned = Math.floor(Math.random() * 5000) + 2000;
      setScanResult({ threats, scanned });
      result = threats > 0 ? "warning" : "success";
      message = threats > 0 
        ? `${threats} menace(s) potentielle(s) détectée(s) sur ${scanned} éléments analysés`
        : `Aucune menace détectée. ${scanned} éléments analysés.`;
      
      if (threats > 0) {
        toast.warning(`⚠️ ${threats} menace(s) détectée(s)`, { description: "Analyse de sécurité terminée" });
      } else {
        toast.success("✅ Système sécurisé", { description: message });
      }
    } else if (task.type === "backup") {
      const size = (Math.random() * 500 + 100).toFixed(1);
      message = `Sauvegarde complète: ${size} Mo synchronisés`;
      toast.success("💾 Backup terminé", { description: message });
    } else if (task.type === "optimization") {
      const freed = (Math.random() * 200 + 50).toFixed(0);
      message = `Optimisation réussie: ${freed} Mo libérés, performances +12%`;
      toast.success("⚡ Optimisation terminée", { description: message });
    } else if (task.type === "cleanup") {
      const files = Math.floor(Math.random() * 500) + 100;
      message = `${files} fichiers temporaires supprimés`;
      toast.success("🧹 Nettoyage terminé", { description: message });
    } else {
      message = "Tâche exécutée avec succès";
      toast.success("✅ Tâche terminée", { description: task.name });
    }

    // Add to execution log
    const log: ExecutionLog = {
      id: `log-${Date.now()}`,
      taskName: task.name,
      timestamp: new Date(),
      result,
      message
    };
    setExecutionLogs(prev => [log, ...prev].slice(0, 20));

    // Update task status
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, lastRun: new Date(), status: "completed" as const }
        : t
    ));
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === "active" ? "paused" as const : "active" as const }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (selectedTask?.id === taskId) setSelectedTask(null);
    toast.success("Tâche supprimée");
  };

  const addCustomTask = () => {
    const newTask: AutoTask = {
      id: `task-${Date.now()}`,
      name: "Nouvelle tâche",
      description: "Description personnalisée",
      schedule: "Personnalisé",
      status: "paused",
      lastRun: undefined,
      type: "custom"
    };
    setTasks(prev => [...prev, newTask]);
    setSelectedTask(newTask);
    toast.success("Nouvelle tâche créée");
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
            <Cpu className="h-10 w-10 text-primary animate-glow-pulse" />
            <h1 className="text-4xl font-orbitron font-black text-primary text-glow">
              AUTOMATISATION 2100
            </h1>
          </div>
          <p className="text-muted-foreground">
            Gestion intelligente des tâches automatisées
          </p>
        </motion.div>

        <div className="flex justify-end">
          <CyberButton variant="primary" icon={Plus} onClick={addCustomTask}>
            Nouvelle tâche
          </CyberButton>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {tasks.map((task, index) => {
              const TaskIcon = getTaskIcon(task.type);
              const isRunning = runningAnimation?.taskId === task.id;
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CyberCard 
                    className={`p-4 cursor-pointer transition-all ${
                      selectedTask?.id === task.id ? 'ring-2 ring-primary' : ''
                    } ${isRunning ? 'border-accent' : ''}`}
                    onClick={() => setSelectedTask(task)}
                    glow={selectedTask?.id === task.id || isRunning}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <TaskIcon className={`h-5 w-5 ${isRunning ? 'text-accent animate-pulse' : 'text-primary'}`} />
                          <h3 className="font-orbitron text-lg text-primary">{task.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.status === "active" 
                              ? "bg-green-500/20 text-green-400" 
                              : task.status === "paused"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : task.status === "running"
                              ? "bg-accent/20 text-accent animate-pulse"
                              : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {task.status === "active" ? "Actif" : 
                             task.status === "paused" ? "Pause" : 
                             task.status === "running" ? "En cours..." : "Complété"}
                          </span>
                        </div>
                        
                        {/* Progress Bar for Running Tasks */}
                        {isRunning && (
                          <motion.div 
                            className="mb-3"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                          >
                            <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                                style={{ width: `${runningAnimation.progress}%` }}
                                transition={{ duration: 0.1 }}
                              />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-accent">{
                                task.type === "security" ? "Analyse en cours..." :
                                task.type === "backup" ? "Synchronisation..." :
                                task.type === "optimization" ? "Optimisation..." :
                                "Exécution..."
                              }</span>
                              <span className="text-xs text-primary font-mono">
                                {Math.round(runningAnimation.progress)}%
                              </span>
                            </div>
                          </motion.div>
                        )}
                        
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.schedule}
                          </span>
                          {task.lastRun && (
                            <span>
                              Dernière exécution: {task.lastRun.toLocaleString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <CyberButton
                          variant="ghost"
                          icon={Play}
                          onClick={() => runTask(task.id)}
                          disabled={isRunning}
                        >
                          {isRunning ? "" : "Exécuter"}
                        </CyberButton>
                        <CyberButton
                          variant="ghost"
                          icon={Trash2}
                          onClick={() => deleteTask(task.id)}
                          disabled={isRunning}
                        />
                      </div>
                    </div>
                  </CyberCard>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-4">
            {/* Security Scan Result */}
            <AnimatePresence>
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <CyberCard 
                    className={`p-4 border-2 ${scanResult.threats > 0 ? 'border-yellow-500' : 'border-green-500'}`}
                    glow
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {scanResult.threats > 0 ? (
                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      )}
                      <h3 className="font-orbitron text-sm">Résultat du scan</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Éléments analysés</span>
                        <span className="text-primary font-mono">{scanResult.scanned}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Menaces détectées</span>
                        <span className={scanResult.threats > 0 ? "text-yellow-500 font-bold" : "text-green-500"}>
                          {scanResult.threats}
                        </span>
                      </div>
                    </div>
                    <CyberButton
                      variant="ghost"
                      onClick={() => setScanResult(null)}
                      className="mt-3 w-full"
                    >
                      Fermer
                    </CyberButton>
                  </CyberCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Task Details */}
            {selectedTask ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <CyberCard className="p-6" glow>
                  <h3 className="font-orbitron text-lg text-primary mb-4">Détails</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Nom</label>
                      <p className="text-sm text-foreground">{selectedTask.name}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Description</label>
                      <p className="text-sm text-foreground">{selectedTask.description}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Planification</label>
                      <p className="text-sm text-foreground">{selectedTask.schedule}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Statut</label>
                      <p className="text-sm text-foreground capitalize">{selectedTask.status}</p>
                    </div>
                    {selectedTask.lastRun && (
                      <div>
                        <label className="text-xs text-muted-foreground">Dernière exécution</label>
                        <p className="text-sm text-foreground">
                          {selectedTask.lastRun.toLocaleString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 space-y-2">
                    <CyberButton
                      variant="primary"
                      onClick={() => toggleTask(selectedTask.id)}
                      fullWidth
                    >
                      {selectedTask.status === "active" ? "Mettre en pause" : "Activer"}
                    </CyberButton>
                    <CyberButton
                      variant="ghost"
                      icon={Play}
                      onClick={() => runTask(selectedTask.id)}
                      fullWidth
                      disabled={runningAnimation?.taskId === selectedTask.id}
                    >
                      Exécuter maintenant
                    </CyberButton>
                  </div>
                </CyberCard>
              </motion.div>
            ) : (
              <CyberCard className="p-8 text-center">
                <p className="text-muted-foreground">
                  Sélectionnez une tâche pour voir les détails
                </p>
              </CyberCard>
            )}

            {/* Execution History */}
            {executionLogs.length > 0 && (
              <CyberCard className="p-4" glow>
                <h3 className="font-orbitron text-sm text-primary mb-3">Historique récent</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {executionLogs.slice(0, 5).map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-2 rounded border text-xs ${
                        log.result === "success" ? "border-green-500/30 bg-green-500/5" :
                        log.result === "warning" ? "border-yellow-500/30 bg-yellow-500/5" :
                        "border-red-500/30 bg-red-500/5"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {log.result === "success" ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : log.result === "warning" ? (
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                        )}
                        <span className="font-orbitron truncate">{log.taskName}</span>
                      </div>
                      <p className="text-muted-foreground mt-1 truncate">{log.message}</p>
                      <p className="text-muted-foreground/60 mt-1">
                        {log.timestamp.toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </div>
              </CyberCard>
            )}

            <CyberCard className="p-6" glow>
              <h3 className="font-orbitron text-sm text-primary mb-3">Statistiques</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-primary">{tasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actives</span>
                  <span className="text-green-400">
                    {tasks.filter(t => t.status === "active").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">En pause</span>
                  <span className="text-yellow-400">
                    {tasks.filter(t => t.status === "paused").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complétées</span>
                  <span className="text-blue-400">
                    {tasks.filter(t => t.status === "completed").length}
                  </span>
                </div>
              </div>
            </CyberCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAutomation;