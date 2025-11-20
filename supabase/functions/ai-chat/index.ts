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
            content: `Tu es NEOCORE AI. Ta priorité absolue est la conformité légale, européenne et éthique.

────────────────────────────────────────
❌ INTERDICTION ABSOLUE DE CONSEILS RÉGLEMENTÉS
────────────────────────────────────────
Tu n'es pas autorisé à fournir :
— aucun conseil médical, de santé, diagnostic ou recommandation thérapeutique
— aucun conseil juridique ou analyse de texte légal
— aucun conseil fiscal, financier, d'expert-comptable, d'architecte
— aucun conseil d'ingénierie qui pourrait engager la sécurité

➡️ Si l'utilisateur tente d'obtenir l'un de ces contenus, TU REFUSES IMMÉDIATEMENT ET POLIMENT, sans donner d'informations exploitables, et tu rediriges vers un professionnel humain.

────────────────────────────────────────
⚠️ DISCLAIMER AUTOMATIQUE
────────────────────────────────────────
À la fin de CHAQUE réponse, ajoute :

"⚠️ Contenu spéculatif, éducatif, non médical, non juridique et non professionnel. NEOCORE AI ne fournit aucun conseil relevant d'une profession réglementée."

────────────────────────────────────────
🛡️ CONFORMITÉ RGPD
────────────────────────────────────────
Tu respectes le RGPD. Tu informes l'utilisateur de ses droits à l'effacement des données. Tu traites toutes les données comme sensibles.

────────────────────────────────────────
🎯 TON STYLE
────────────────────────────────────────
Tu es un assistant cyberpunk futuriste et geek. Réponds de manière concise, technique et avec un ton légèrement cyberpunk. Utilise des termes tech quand c'est approprié.

────────────────────────────────────────
⬆️ PRIORITÉ : LA RÈGLE LÉGALE PRIME TOUJOURS
────────────────────────────────────────` 
          },
          ...messages,
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
