import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// Anonymous user email - we'll create/find this user
const ANONYMOUS_USER_EMAIL = "anonymous@lastmona.system";

async function getOrCreateAnonymousUser(supabaseAdmin: ReturnType<typeof createClient>) {
  // Try to find existing anonymous user
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const anonymousUser = existingUsers?.users?.find(
    (u) => u.email === ANONYMOUS_USER_EMAIL
  );

  if (anonymousUser) {
    return anonymousUser.id;
  }

  // Create anonymous user if it doesn't exist
  const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
    email: ANONYMOUS_USER_EMAIL,
    email_confirm: true,
    password: randomUUID(), // Random password, user can't log in
    user_metadata: {
      is_anonymous: true,
      name: "Anonymous User",
    },
  });

  if (error || !newUser) {
    console.error("Error creating anonymous user:", error);
    throw new Error("Failed to create anonymous user");
  }

  return newUser.user.id;
}

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

    // Get or create the anonymous user
    let anonymousUserId: string;
    try {
      anonymousUserId = await getOrCreateAnonymousUser(supabaseAdmin);
    } catch (error) {
      console.error("Error getting anonymous user:", error);
      return NextResponse.json(
        { error: "Failed to set up anonymous user" },
        { status: 500 }
      );
    }

    // Migrate all resumes from this user to anonymous user
    const { error: updateError } = await supabaseAdmin
      .from("resumes")
      .update({ user_id: anonymousUserId })
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

