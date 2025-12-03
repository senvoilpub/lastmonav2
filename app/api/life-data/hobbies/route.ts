import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET: Fetch all hobbies for the authenticated user
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

    const { data: hobbiesData, error } = await supabase
      .from("user_hobbies")
      .select("id, hobby")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching hobbies:", error);
      return NextResponse.json(
        { error: "Failed to fetch hobbies" },
        { status: 500 }
      );
    }

    // Return as array of strings for easier use
    const hobbies = hobbiesData?.map((h) => h.hobby) || [];
    return NextResponse.json({ hobbies });
  } catch (error) {
    console.error("Error in GET /api/life-data/hobbies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add a new hobby
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
    const { hobby } = body;

    if (!hobby || typeof hobby !== "string" || !hobby.trim()) {
      return NextResponse.json(
        { error: "Hobby is required" },
        { status: 400 }
      );
    }

    // Check if hobby already exists
    const { data: existing } = await supabase
      .from("user_hobbies")
      .select("id")
      .eq("user_id", user.id)
      .eq("hobby", hobby.trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Hobby already exists" },
        { status: 400 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("user_hobbies")
      .insert({
        user_id: user.id,
        hobby: hobby.trim(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting hobby:", insertError);
      return NextResponse.json(
        { error: "Failed to save hobby" },
        { status: 500 }
      );
    }

    return NextResponse.json({ hobby: inserted });
  } catch (error) {
    console.error("Error in POST /api/life-data/hobbies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a hobby by hobby name
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
    const hobby = searchParams.get("hobby");

    if (!hobby) {
      return NextResponse.json(
        { error: "Hobby is required" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from("user_hobbies")
      .delete()
      .eq("user_id", user.id)
      .eq("hobby", hobby);

    if (deleteError) {
      console.error("Error deleting hobby:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete hobby" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/life-data/hobbies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

