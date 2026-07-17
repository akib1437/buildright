"use server";
// CONTROLLER: authentication — sign up (customer/admin), sign in, sign out.
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { profileModel } from "@/models/profileModel";

export async function signUpCustomer(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  if (!email || password.length < 6 || !fullName) {
    return { error: "Fill in every field. Password needs at least 6 characters." };
  }
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };
  if (!data.session) {
    return { success: "Account created. Check your email to confirm, then log in." };
  }
  redirect("/dashboard");
}

export async function signUpAdmin(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const code = String(formData.get("admin_code") || "");
  if (!email || password.length < 6 || !fullName || !code) {
    return { error: "Fill in every field. Password needs at least 6 characters." };
  }
  if (code !== process.env.ADMIN_SIGNUP_CODE) {
    return { error: "That admin code is not valid." };
  }
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };

  // Promote with the service-role client (RLS prevents self-promotion).
  const admin = createAdminClient();
  await profileModel.promoteToAdmin(admin, data.user.id);

  if (!data.session) {
    return { success: "Admin account created. Check your email to confirm, then log in." };
  }
  redirect("/admin");
}

export async function signIn(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "");
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Wrong email or password." };

  const profile = await profileModel.get(supabase, data.user.id);
  revalidatePath("/", "layout");
  redirect(next || (profile?.role === "admin" ? "/admin" : "/dashboard"));
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
