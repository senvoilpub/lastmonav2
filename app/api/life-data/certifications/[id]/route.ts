import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// PUT: Update certification
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

    const { data: existing, error: fetchError } = await supabase
      .from("user_certifications")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing || existing.user_id !== user.id) {
      return NextResponse.json(
        { error: "Certification not found or unauthorized" },
        { status: 404 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("user_certifications")
      .update({
        name: body.name || null,
        issuer: body.issuer || null,
        date: body.date || null,
        description: body.description || null,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating certification:", updateError);
      return NextResponse.json(
        { error: "Failed to update certification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ certification: updated });
  } catch (error) {
    console.error("Error in PUT /api/life-data/certifications/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete certification
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

    const { data: existing, error: fetchError } = await supabase
      .from("user_certifications")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing || existing.user_id !== user.id) {
      return NextResponse.json(
        { error: "Certification not found or unauthorized" },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from("user_certifications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("Error deleting certification:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete certification" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/life-data/certifications/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

