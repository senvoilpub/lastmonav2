import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// PUT: Update an experience
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();

    // First verify the experience belongs to the user
    const { data: existing, error: fetchError } = await supabase
      .from("user_experiences")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing || existing.user_id !== user.id) {
      return NextResponse.json(
        { error: "Experience not found or unauthorized" },
        { status: 404 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("user_experiences")
      .update({
        title: body.title || null,
        company: body.company || null,
        period: body.period || null,
        description: body.description || null,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating experience:", updateError);
      return NextResponse.json(
        { error: "Failed to update experience" },
        { status: 500 }
      );
    }

    return NextResponse.json({ experience: updated });
  } catch (error) {
    console.error("Error in PUT /api/experiences/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    // First verify the experience belongs to the user
    const { data: existing, error: fetchError } = await supabase
      .from("user_experiences")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing || existing.user_id !== user.id) {
      return NextResponse.json(
        { error: "Experience not found or unauthorized" },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from("user_experiences")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting experience:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete experience" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/experiences/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

