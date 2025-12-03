import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface ExperienceEntry {
  title?: string;
  company?: string;
  period?: string;
  description?: string;
}

// Helper function to extract experiences from text using Gemini AI
async function extractExperiencesFromText(
  text: string
): Promise<ExperienceEntry[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return [];
  }

  const prompt = `Extract all work experiences from the following text. Return ONLY a valid JSON array of experience objects. Each experience should have: title, company, period, and description fields.

Format:
[
  {
    "title": "Job Title",
    "company": "Company Name",
    "period": "Start Date - End Date",
    "description": "Brief description of responsibilities and achievements"
  }
]

If no clear work experience is found, return an empty array [].

Text to analyze: ${text}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return [];
    }

    const data = await response.json();
    const responseText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch =
      responseText.match(/```(?:json)?\s*(\[[\s\S]*\])\s*```/) ||
      responseText.match(/(\[[\s\S]*\])/);

    const jsonText = jsonMatch ? jsonMatch[1] : responseText;
    const experiences = JSON.parse(jsonText);

    return Array.isArray(experiences) ? experiences : [];
  } catch (error) {
    console.error("Error extracting experiences:", error);
    return [];
  }
}

// GET: Fetch all experiences for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: experiences, error } = await supabase
      .from("user_experiences")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching experiences:", error);
      return NextResponse.json(
        { error: "Failed to fetch experiences" },
        { status: 500 }
      );
    }

    return NextResponse.json({ experiences: experiences || [] });
  } catch (error) {
    console.error("Error in GET /api/experiences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create new experience(s) - either from text extraction or manual entry
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text, experience } = body;

    // If text is provided, extract experiences using AI
    if (text && typeof text === "string") {
      const extracted = await extractExperiencesFromText(text);

      if (extracted.length > 0) {
        const experiencesToInsert = extracted.map((exp) => ({
          user_id: user.id,
          title: exp.title || null,
          company: exp.company || null,
          period: exp.period || null,
          description: exp.description || null,
        }));

        const { data: inserted, error: insertError } = await supabase
          .from("user_experiences")
          .insert(experiencesToInsert)
          .select();

        if (insertError) {
          console.error("Error inserting experiences:", insertError);
          return NextResponse.json(
            { error: "Failed to save experiences" },
            { status: 500 }
          );
        }

        return NextResponse.json({ experiences: inserted });
      }
    }

    // If experience object is provided, insert it directly
    if (experience) {
      const { data: inserted, error: insertError } = await supabase
        .from("user_experiences")
        .insert({
          user_id: user.id,
          title: experience.title || null,
          company: experience.company || null,
          period: experience.period || null,
          description: experience.description || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting experience:", insertError);
        return NextResponse.json(
          { error: "Failed to save experience" },
          { status: 500 }
        );
      }

      return NextResponse.json({ experience: inserted });
    }

    return NextResponse.json(
      { error: "Either 'text' or 'experience' must be provided" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in POST /api/experiences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

