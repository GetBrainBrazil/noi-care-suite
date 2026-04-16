// One-shot edge function to bootstrap an admin user.
// Safe-by-default: only creates the hardcoded admin defined below.
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = "daniel@getbrain.com.br";
const ADMIN_PASSWORD = "gb@2026";
const ADMIN_NAME = "Daniel - GetBrain";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Try to create user (idempotent: handle "already registered")
    let userId: string | null = null;
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_NAME },
    });

    if (createErr) {
      // If user exists, find them and update password
      const { data: list } = await admin.auth.admin.listUsers();
      const existing = list.users.find((u) => u.email === ADMIN_EMAIL);
      if (!existing) throw createErr;
      userId = existing.id;
      await admin.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: ADMIN_NAME },
      });
    } else {
      userId = created.user!.id;
    }

    // Ensure profile is approved
    await admin.from("profiles").upsert(
      { user_id: userId, email: ADMIN_EMAIL, full_name: ADMIN_NAME, status: "approved" },
      { onConflict: "user_id" },
    );

    // Ensure Admin role assignment
    const { data: role } = await admin.from("roles").select("id").eq("name", "Administrador").maybeSingle();
    if (role) {
      await admin.from("user_roles").upsert(
        { user_id: userId, role_id: role.id },
        { onConflict: "user_id,role_id" },
      );
    }

    return new Response(JSON.stringify({ ok: true, user_id: userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err?.message ?? err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
