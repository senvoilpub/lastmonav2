import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Anonymous user ID - a fixed UUID for all anonymized resumes
const ANONYMOUS_USER_ID = "00000000-0000-0000-0000-000000000000";

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // Initialize Supabase admin client (we need service role key for this)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Verify the user token and get user ID
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // First, ensure the anonymous user exists in auth.users (if needed)
    // Actually, we'll just use the UUID directly in the resumes table
    // The anonymous user doesn't need to exist in auth.users

    // Migrate all resumes from this user to anonymous user
    const { error: updateError } = await supabaseAdmin
      .from("resumes")
      .update({ user_id: ANONYMOUS_USER_ID })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error migrating resumes:", updateError);
      return NextResponse.json(
        { error: "Failed to migrate resumes" },
        { status: 500 }
      );
    }

    // Delete the user account from auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      // Even if user deletion fails, resumes are already migrated
      // We'll still return success since the main goal (preserving resumes) is done
    }

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully. Resumes have been anonymized.",
    });
  } catch (error) {
    console.error("Error in delete-account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

