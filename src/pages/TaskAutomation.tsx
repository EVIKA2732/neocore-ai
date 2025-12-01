import { useState } from "react";
import { motion } from "framer-motion";
import { CyberCard } from "@/components/CyberCard";
import { CyberButton } from "@/components/CyberButton";
import { Cpu, Play, Plus, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

interface AutoTask {
  id: string;
  name: string;
  description: string;
  schedule: string;
  status: "active" | "paused" | "completed";
  lastRun?: Date;
}

const PRESET_TASKS: Omit<AutoTask, "id" | "lastRun">[] = [
  {
    name: "Optimisation système",
    description: "Analyse et optimisation automatique des performances",
    schedule: "Quotidien à 03:00",
    status: "active"
  },
  {
    name: "Backup données",
    description: "Sauvegarde incrémentielle des données critiques",
    schedule: "Tous les jours à 02:00",
    status: "active"
  },
  {
    name: "Nettoyage cache",
    description: "Suppression des fichiers temporaires et cache obsolète",
    schedule: "Hebdomadaire",
    status: "active"
  },
  {
    name: "Scan sécurité",
    description: "Vérification des vulnérabilités et menaces",
    schedule: "Quotidien à 04:00",
    status: "active"
  },
  {
    name: "Rapport d'activité",
    description: "Génération du rapport hebdomadaire d'utilisation",
    schedule: "Lundi à 08:00",
    status: "active"
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

  const runTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, lastRun: new Date(), status: "completed" as const }
        : task
    ));
    toast.success("Tâche exécutée avec succès");
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
      lastRun: undefined
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
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CyberCard 
                  className={`p-4 cursor-pointer transition-all ${
                    selectedTask?.id === task.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTask(task)}
                  glow={selectedTask?.id === task.id}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-orbitron text-lg text-primary">{task.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          task.status === "active" 
                            ? "bg-green-500/20 text-green-400" 
                            : task.status === "paused"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {task.status === "active" ? "Actif" : task.status === "paused" ? "Pause" : "Complété"}
                        </span>
                      </div>
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
                      >
                        Exécuter
                      </CyberButton>
                      <CyberButton
                        variant="ghost"
                        icon={Trash2}
                        onClick={() => deleteTask(task.id)}
                      />
                    </div>
                  </div>
                </CyberCard>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
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
