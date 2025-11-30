import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Simple in-memory cache (5 minutes)
let cachedCount: { count: number; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check cache first to reduce database load
    if (cachedCount && Date.now() - cachedCount.timestamp < CACHE_DURATION) {
      return NextResponse.json({ count: cachedCount.count });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      // Return 0 instead of error to prevent information leakage
      return NextResponse.json({ count: 0 });
    }

    // Create admin client (server-side only, never exposed to client)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Count ALL resumes ever created (including anonymized ones)
    // This is safe because:
    // 1. We only return a number, no user data
    // 2. Service role key is server-side only
    // 3. We use COUNT which is efficient and read-only
    const { count, error } = await supabaseAdmin
      .from("resumes")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error counting resumes:", error);
      // Return cached value if available, otherwise 0
      return NextResponse.json({ 
        count: cachedCount?.count || 0 
      });
    }

    const resumeCount = count || 0;

    // Update cache
    cachedCount = {
      count: resumeCount,
      timestamp: Date.now(),
    };

    return NextResponse.json({ count: resumeCount });
  } catch (error) {
    console.error("Error in resume-count API:", error);
    // Return cached value if available, otherwise 0
    // Never expose error details to client
    return NextResponse.json({ 
      count: cachedCount?.count || 0 
    });
  }
}


