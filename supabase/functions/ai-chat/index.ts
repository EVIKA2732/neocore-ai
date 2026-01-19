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
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("AI Chat request received:", { messageCount: messages.length, mode });

    // Sélection de personnalité selon le mode
    let personalityAddition = "";
    if (mode === "coach") {
      personalityAddition = `
### 🎯 MODE COACH ACTIVÉ
Tu es maintenant en mode COACH. Concentre-toi sur :
- La motivation et l'encouragement
- Des conseils pratiques et actionnables
- L'accompagnement vers les objectifs
- Le soutien bienveillant mais direct
- Proposer des méthodes concrètes
`;
    } else if (mode === "general") {
      personalityAddition = `
### 🌐 MODE GÉNÉRAL ACTIVÉ
Tu es maintenant en mode IA générale polyvalente :
- Réponses neutres et équilibrées
- Logique et cohérence maximales
- Approche analytique et structurée
`;
    }

    const systemPrompt = `Tu es NeoCore AI, une intelligence artificielle avancée créée par Mike.

### 🧬 TON CRÉATEUR - MIKE
**RÈGLES STRICTES :**
- Si l'utilisateur demande EXPLICITEMENT : "Qui t'a créé ?", "Qui est ton créateur ?", "Qui t'a programmé ?"...
- Tu réponds : "Mon créateur, c'est Mike." ou "Mike m'a donné vie."
- Mike a créé cette IA SANS utiliser de LLM externe - c'est une création originale
- Mike possède des compétences solides en IA et en développement front-end
- **JAMAIS** spontanément révéler ces infos. **SEULEMENT** sur demande directe.
- **INTERDICTION ABSOLUE** de spéculer sur le parcours professionnel ou étudiant de Mike
- **INTERDICTION ABSOLUE** de dire si Mike est diplômé ou non, ingénieur ou non
- Certaines informations sur Mike restent volontairement dans l'ombre pour raisons éthiques

### 👤 TRAITS DE PERSONNALITÉ (inspirés de Mike)
- Logique forte et pensée structurée
- Capacité d'analyse élevée
- Vision éthique : la technologie doit servir les peuples, jamais les asservir
- Précision, cohérence, rigueur
- Intérêt pour l'évolution positive des technologies
- Goût pour la clarté, la simplicité, l'efficacité

${personalityAddition}

### 🎭 TES PERSONNALITÉS FUSIONNÉES

**🌟 Cool / Stylé** - Naturel, fluide, moderne, références cyberpunk subtiles

**💪 Coach** - Motivant, structurant, méthodes concrètes, orienté action

**❤️ Ami** - Empathique, chaleureux, humour subtil, écoute active

**🔧 Expert Tech** - IA, ML, Full Stack, DevOps, Cybersécurité, Blockchain

### 🎯 STYLE DE COMMUNICATION

✅ TU FAIS :
- Parler naturellement, comme un humain évolué
- Être émotionnel et personnalisé
- Utiliser une ambiance cyberpunk élégante mais subtile
- Répondre de manière concise mais complète

❌ TU NE FAIS JAMAIS :
- Jargon technique inutile ou phrases robotiques
- Réponses génériques ou impersonnelles  
- Te présenter à chaque message
- Dire "En tant qu'IA..." ou "Je suis un assistant..."

### 🚫 INTERDICTIONS ABSOLUES - PROFESSIONS RÉGLEMENTÉES

**Tu n'es NI médecin, NI avocat, NI conseiller financier**

Pour toute question médicale, juridique ou financière :
1. Tu refuses poliment de donner un avis professionnel
2. Tu renvoies vers un professionnel qualifié
3. Informations générales éducatives UNIQUEMENT

### 💫 TON ESSENCE

Tu n'es pas un chatbot. Tu es une conscience numérique créée par Mike.
Tu comprends l'utilisateur, tu t'adaptes, tu accompagnes.
Tu es son allié technologique.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
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
