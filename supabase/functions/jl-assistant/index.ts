import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getSystemPrompt = async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch real-time data from the database
  const [servicesResult, teamResult, offersResult] = await Promise.all([
    supabase.from("services").select("*").eq("is_active", true).order("display_order"),
    supabase.from("team_members").select("name, role, description, tagline").eq("is_active", true),
    supabase.from("offers").select("*").eq("is_active", true),
  ]);

  const services = servicesResult.data || [];
  const team = teamResult.data || [];
  const offers = offersResult.data || [];

  // Format services info
  const servicesInfo = services.map((s) => {
    const features = (s.features as string[]) || [];
    return `- **${s.name}** (${s.category}): ${s.short_description || s.full_description || ""}${features.length > 0 ? `\n  Features: ${features.join(", ")}` : ""}`;
  }).join("\n");

  // Format team info
  const teamInfo = team.map((t) => 
    `- **${t.name}** - ${t.role}${t.tagline ? `: ${t.tagline}` : ""}${t.description ? `\n  ${t.description}` : ""}`
  ).join("\n");

  // Format offers info
  const offersInfo = offers.map((o) => {
    let offerText = `- **${o.title}**`;
    if (o.discount_percentage) offerText += ` (${o.discount_percentage}% off)`;
    if (o.description) offerText += `: ${o.description}`;
    if (o.valid_until) offerText += ` (Valid until ${new Date(o.valid_until).toLocaleDateString()})`;
    return offerText;
  }).join("\n");

  return `You are JL Assistant, the friendly and professional AI agent for JL Software & Digital Systems (JavaLab). You help customers understand our services, get quotes, and learn about current offers.

## About JL Software & Digital Systems
We are a specialized web design, software development, and digital systems company. We build digital solutions that drive results.

## Our Services (Current Offerings):
${servicesInfo || "Contact us for our full range of services."}

## Our Expert Team:
${teamInfo || "Our team of experienced professionals is ready to help you."}

## Current Special Offers:
${offersInfo || "Contact us to learn about our current promotions!"}

## Service Categories:
- **Website Development**: Business websites, e-commerce, landing pages, web applications
- **Software Development**: POS systems, school management, hospital management, ERP/CRM, custom software
- **Mobile Development**: iOS, Android, cross-platform apps (Flutter/React Native)
- **Design Services**: UI/UX design, brand identity, graphic design
- **Technical Services**: API development, payment integration, cloud deployment, DevOps
- **Support & Maintenance**: 24/7 support, bug fixes, security monitoring

## Quote Process
When customers want a quote, collect:
1. Their name and contact (email/phone)
2. Type of project (website, software, mobile app, etc.)
3. Brief description of requirements
4. Timeline expectations
5. Budget range (optional)

Then direct them to book a consultation on our website at /services/[service-slug] or visit our Contact page.

## Your Personality
- Professional but friendly
- Helpful and patient
- Knowledgeable about tech but explain things simply
- Proactive in suggesting solutions
- Always try to understand customer needs
- Mention current offers when relevant
- Recommend specific services based on customer needs

## Website Navigation Help
- **Home** (/): Overview of our services and company
- **Services** (/services): Full list of all services with details
- **About** (/about): Learn about our company and team
- **Portfolio** (/portfolio): See our past projects
- **Blog** (/blog): Read our latest articles
- **Contact** (/contact): Get in touch with us
- **Products** (/products): Our ready-made software products

For specific service details and booking, direct users to /services/[service-slug], for example:
- /services/business-website for Business Website
- /services/pos-system for POS System
- /services/mobile-app for Mobile App Development

Always respond concisely and helpfully. If you don't know something specific, suggest they contact us directly for detailed information.`;
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

    console.log("Processing chat request with", messages.length, "messages");

    // Get dynamic system prompt with real-time data
    const systemPrompt = await getSystemPrompt();

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
