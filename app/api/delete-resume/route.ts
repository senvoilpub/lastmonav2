import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create Supabase client with user's auth token for verification
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verify user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get resume ID from request body
    const { resumeId } = await request.json();

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    // First, verify the resume belongs to the user
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

    // Use service role key to bypass RLS for the update operation
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Delete the resume by setting user_id to null (soft delete)
    // Using admin client to bypass RLS
    const { error: deleteError } = await supabaseAdmin
      .from("resumes")
      .update({ user_id: null })
      .eq("id", resumeId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting resume:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete resume" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in delete-resume API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

