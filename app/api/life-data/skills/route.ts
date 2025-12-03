import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET: Fetch all skills for the authenticated user
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

    const { data: skillsData, error } = await supabase
      .from("user_skills")
      .select("id, skill")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching skills:", error);
      return NextResponse.json(
        { error: "Failed to fetch skills" },
        { status: 500 }
      );
    }

    // Return as array of strings for easier use
    const skills = skillsData?.map((s) => s.skill) || [];
    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Error in GET /api/life-data/skills:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add a new skill
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
    const { skill } = body;

    if (!skill || typeof skill !== "string" || !skill.trim()) {
      return NextResponse.json(
        { error: "Skill is required" },
        { status: 400 }
      );
    }

    // Check if skill already exists
    const { data: existing } = await supabase
      .from("user_skills")
      .select("id")
      .eq("user_id", user.id)
      .eq("skill", skill.trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Skill already exists" },
        { status: 400 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("user_skills")
      .insert({
        user_id: user.id,
        skill: skill.trim(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting skill:", insertError);
      return NextResponse.json(
        { error: "Failed to save skill" },
        { status: 500 }
      );
    }

    return NextResponse.json({ skill: inserted });
  } catch (error) {
    console.error("Error in POST /api/life-data/skills:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a skill by skill name
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const skill = searchParams.get("skill");

    if (!skill) {
      return NextResponse.json(
        { error: "Skill is required" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from("user_skills")
      .delete()
      .eq("user_id", user.id)
      .eq("skill", skill);

    if (deleteError) {
      console.error("Error deleting skill:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete skill" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/life-data/skills:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

