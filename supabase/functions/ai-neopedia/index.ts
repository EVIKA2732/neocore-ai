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
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Neopedia AI request:", { query });

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
            content: `Tu es un générateur d'articles Neopedia, une encyclopédie futuriste. 
            
Génère un article détaillé sur le sujet demandé, en l'imaginant dans le futur (entre 2030 et 2100).

Retourne UNIQUEMENT un JSON valide avec cette structure exacte :
{
  "title": "Titre accrocheur de la technologie/concept",
  "category": "Catégorie (ex: Technologies Spatiales, Neurosciences, Énergies, etc.)",
  "description": "Description détaillée de 3-4 phrases expliquant la technologie et son impact",
  "technicalDetails": [
    "Détail technique 1",
    "Détail technique 2",
    "Détail technique 3",
    "Détail technique 4"
  ],
  "futureYear": année entre 2030 et 2100,
  "probability": "Haute/Moyenne/Faible"
}

Sois créatif, technique et inspirant. Base-toi sur des tendances scientifiques réelles mais projette-les dans le futur.`
          },
          { role: "user", content: query }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erreur AI gateway" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("AI response:", aiResponse);

    // Parse le JSON de la réponse IA
    let result;
    try {
      // Extraire le JSON si l'IA a ajouté du texte autour
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw response:", aiResponse);
      // Fallback avec un résultat par défaut
      result = {
        title: "Recherche en cours...",
        category: "Général",
        description: "Le système analyse votre requête. Réessayez dans quelques instants.",
        technicalDetails: [
          "Analyse sémantique en cours",
          "Génération de contenu futuriste",
          "Vérification de cohérence",
          "Optimisation du résultat"
        ],
        futureYear: 2050,
        probability: "Moyenne"
      };
    }

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Neopedia AI error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
