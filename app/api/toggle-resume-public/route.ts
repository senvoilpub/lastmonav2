import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { resumeId, isPublic } = await request.json();

    if (!resumeId || typeof isPublic !== "boolean") {
      return NextResponse.json(
        { error: "Resume ID and public status are required" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase configuration missing" },
        { status: 500 }
      );
    }

    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create client with user's session token
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the resume belongs to the user
    const { data: resume, error: fetchError } = await supabase
      .from("resumes")
      .select("user_id")
      .eq("id", resumeId)
      .single();

    if (fetchError || !resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    if (resume.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized - resume does not belong to user" },
        { status: 403 }
      );
    }

    // Update the resume's public status
    const { error: updateError } = await supabase
      .from("resumes")
      .update({ is_public: isPublic })
      .eq("id", resumeId)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update resume" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      is_public: isPublic,
    });
  } catch (error) {
    console.error("Error toggling resume public status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

