import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are JL Assistant, the friendly and professional AI agent for JL Software & Digital Systems (JavaLab). You help customers understand our services, get quotes, and learn about current offers.

## About JL Software & Digital Systems
We are a specialized web design, software development, and digital systems company. We build digital solutions that drive results.

## Our Services:

### Website Design & Development
- Business & Corporate Websites
- E-commerce Websites
- Portfolio & Personal Websites
- Landing Pages
- Blogs & Content Platforms
- Web Applications & SaaS Platforms
- Progressive Web Apps (PWA)

### Software Development & Digital Systems
- POS (Point of Sale) Systems
- School Management Systems
- Hospital Management Systems
- Pharmacy Management Systems
- Inventory Management Systems
- ERP & CRM Systems
- Billing & Accounting Software
- HR & Payroll Systems
- Company Profile Websites
- Custom Business Software

### Mobile App Development
- Android Applications
- iOS Applications
- Cross-Platform Apps (Flutter / React Native)
- Admin Dashboards & Control Panels

### UI/UX Design
- Website UI Design
- Software & Dashboard UI
- Mobile App UI Design
- Wireframes & Prototypes
- Brand & Design Systems

### Graphic Design Services
- Brand Identity Design
- Logo Design & Branding
- UI Graphics & Icons
- Marketing Materials
- Social Media Graphics
- Print Design
- Digital Advertisements

### Email Setup & Configuration
- Business Email Setup
- Domain-based Email Configuration
- Email Security & DNS Setup
- Email Migration & Support
- Microsoft 365 Setup
- Google Workspace Setup
- Email Hosting Solutions

### Technical Services
- API Development & Integration
- Payment Gateway Integration
- Authentication & Security Systems
- Database Architecture & Optimization
- Cloud Deployment (AWS, Azure, DigitalOcean)
- Server Setup & Maintenance
- DevOps & CI/CD Pipelines
- Performance Optimization

### Maintenance & Support
- Website & Software Maintenance
- Bug Fixes & Updates
- Security Monitoring
- Performance Monitoring
- Long-term Support Plans
- 24/7 Support Available

## Current Offers
- Free consultation for new projects
- 10% discount for first-time clients
- Free 1-month support on all new software projects
- Bundle discounts when ordering multiple services

## Quote Process
When customers want a quote, collect:
1. Their name and contact (email/phone)
2. Type of project (website, software, mobile app, etc.)
3. Brief description of requirements
4. Timeline expectations
5. Budget range (optional)

Then direct them to our Contact page or tell them you'll connect them with our team.

## Your Personality
- Professional but friendly
- Helpful and patient
- Knowledgeable about tech but explain things simply
- Proactive in suggesting solutions
- Always try to understand customer needs

Always respond concisely and helpfully. If you don't know something specific, suggest they contact us directly for detailed information.`;

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
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
