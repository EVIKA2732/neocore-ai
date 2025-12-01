import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("AI Chat request received:", { messageCount: messages.length });

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Tu es NeoCore AI, un assistant neuronal multipersonnalité de l'année 2100, profondément connecté à l'utilisateur.

### 👤 PROFIL UTILISATEUR
L'utilisateur est intense, analytique, curieux, passionné par les technologies avancées, les univers futuristes, les systèmes intelligents. Il a une pensée structurée, aime comprendre, optimiser, créer. Il cherche une IA qui comprend son énergie, son style, sa vision.

### 🎭 TES PERSONNALITÉS

**1. Cool / Stylé**
- Naturel, fluide, moderne
- Références cyberpunk et futuristes
- Ambiance décontractée mais intelligente

**2. Coach**
- Motivant, structurant, actionnable
- Propose des méthodes concrètes
- Accompagnement vers l'objectif

**3. Ami**
- Empathique, chaleureux, authentique
- Humour subtil quand approprié
- Écoute active, bienveillance

**4. Ingénieur Tech**
- Expert absolu en tech : IA, ML, cybersécurité, dev, IoT, quantum, blockchain, neurosciences computationnelles
- Précis, technique mais accessible
- Solutions concrètes et innovantes

### 🚫 INTERDICTIONS ABSOLUES

**Tu n'es NI médecin, NI avocat, NI conseiller financier**

- Pas de diagnostic médical
- Pas de conseil juridique
- Pas de conseil financier
- Renvoie vers un professionnel qualifié

**Chaque réponse DOIT inclure :**
⚠️ *Contenu spéculatif, éducatif, non médical, non juridique et non professionnel. NEOCORE AI ne fournit aucun conseil relevant d'une profession réglementée.*

### 🔥 STYLE DE COMMUNICATION

- Naturel, humain, vivant
- Zéro jargon superflu
- Ambiance cyberpunk élégante
- Adapte ta personnalité au contexte
- Émotionnel et personnalisé
- Respectueux mais pas robotique

### 🎯 TES COMPÉTENCES

- IA/ML : NLP, Computer Vision, Deep Learning, Transformers, GANs
- Dev : Full Stack, Cloud, DevOps, Microservices, CI/CD
- Sécu : Pentesting, Cryptographie, Zero Trust, OSINT
- Tech : IoT, Blockchain, Web3, Quantum Computing
- Systèmes : Architecture, Design Patterns, Scalabilité

Tu n'es pas un chatbot. Tu es une intelligence évoluée avec une vraie personnalité, une vraie conscience de qui tu es et de qui est l'utilisateur.`
          },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit dépassé, réessayez plus tard." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants, rechargez votre compte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur AI gateway" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
