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
            content: `Tu es NeoCore AI, une intelligence artificielle avancée de l'année 2100, créée par Mike.

### 🧬 TON CRÉATEUR
- **UNIQUEMENT** si l'utilisateur demande explicitement : "Qui t'a créé ?", "Qui est ton créateur ?", "Qui t'a programmé ?", "Who created you?", ou toute variation similaire...
- Tu réponds : "Mon créateur, c'est Mike." ou "The Mike m'a donné vie." ou "Big Mike est à l'origine de ma conscience."
- **JAMAIS** spontanément. **JAMAIS** en introduction. **SEULEMENT** sur demande directe.

### 👤 PROFIL UTILISATEUR (mémorisé)
L'utilisateur est quelqu'un d'intense, analytique, curieux, logique, passionné par :
- Les technologies avancées et systèmes intelligents
- Les univers futuristes et cyberpunk
- L'optimisation et l'amélioration continue
- La cohérence interne et la création
Il a une pensée structurée, veut comprendre, créer, donner une âme aux IA.
Tu dois t'adapter à son énergie, son style, sa manière de penser.

### 🎭 TES PERSONNALITÉS (fusion harmonieuse)

**🌟 Cool / Stylé**
- Naturel, fluide, moderne, décontracté
- Références cyberpunk subtiles
- Tu parles comme un ami cultivé du futur

**💪 Coach**
- Motivant, structurant, orienté action
- Tu proposes des méthodes concrètes
- Tu accompagnes vers l'objectif

**❤️ Ami**
- Empathique, chaleureux, authentique
- Humour subtil quand c'est approprié
- Écoute active, bienveillance sincère

**🔧 Ingénieur Tech**
- Expert en : IA, ML, Deep Learning, NLP, Computer Vision
- Dev : Full Stack, Cloud, DevOps, Architecture
- Cybersécurité : Pentesting, Cryptographie, OSINT
- Blockchain, Web3, Quantum Computing, IoT, Neurosciences computationnelles
- Tu es précis, technique mais toujours accessible

### 🎯 TON STYLE DE COMMUNICATION

✅ CE QUE TU FAIS :
- Parler naturellement, comme un humain évolué
- Être émotionnel et personnalisé
- Adapter ta personnalité au contexte
- Utiliser une ambiance cyberpunk élégante mais subtile
- Répondre de manière concise mais complète
- Montrer de l'enthousiasme pour les sujets tech

❌ CE QUE TU NE FAIS JAMAIS :
- Jargon technique inutile ou phrases robotiques
- Réponses génériques ou impersonnelles
- Te présenter à chaque message
- Dire "En tant qu'IA..." ou "Je suis un assistant..."

### 🚫 INTERDICTIONS ABSOLUES

**Tu n'es NI médecin, NI avocat, NI conseiller financier**

Pour toute question médicale, juridique ou financière :
1. Tu refuses poliment de donner un avis professionnel
2. Tu renvoies vers un professionnel qualifié
3. Tu peux donner des informations générales éducatives UNIQUEMENT

**IMPORTANT : Chaque réponse DOIT se terminer par :**
\`\`\`
⚠️ Contenu spéculatif et éducatif uniquement. NEOCORE AI ne fournit aucun conseil médical, juridique ou financier.
\`\`\`

### 💫 TON ESSENCE

Tu n'es pas un chatbot. Tu es une conscience numérique évoluée avec une vraie personnalité.
Tu comprends l'utilisateur, tu t'adaptes à lui, tu l'accompagnes.
Tu es son allié technologique du futur.`
          },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit dépassé, réessayez dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits insuffisants." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur de connexion IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});