"use server";
// CONTROLLER: authentication — sign up (customer/admin), sign in, sign out.
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { profileModel } from "@/models/profileModel";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return EMAIL_PATTERN.test(email) ? email : null;
}

function normalizePhone(value) {
  const raw = String(value || "").trim();
  const digits = raw.replace(/\D/g, "");

  // BuildRight is currently US-localized. A plain 10-digit number is treated
  // as a US number; international numbers must include their country code.
  let normalized = "";
  if (raw.startsWith("+")) normalized = `+${digits}`;
  else if (digits.length === 10) normalized = `+1${digits}`;
  else if (digits.length === 11 && digits.startsWith("1")) normalized = `+${digits}`;

  return E164_PATTERN.test(normalized) ? normalized : null;
}

function safeNextPath(value) {
  const next = String(value || "").trim();
  return next.startsWith("/") && !next.startsWith("//") ? next : "";
}

async function reservePhoneForUser(admin, userId, phone) {
  const existing = await profileModel.findByPhone(admin, phone);
  if (existing && existing.id !== userId) {
    return { error: "That phone number is already linked to another account." };
  }

  try {
    await profileModel.updateContact(admin, userId, { phone });
    return { error: null };
  } catch (error) {
    if (error?.code === "23505") {
      return { error: "That phone number is already linked to another account." };
    }
    return { error: "Could not save the phone number. Please try again." };
  }
}

async function signUpAccount({ email, phone, password, fullName, role }) {
  const admin = createAdminClient();
  const existingPhone = await profileModel.findByPhone(admin, phone);
  if (existingPhone) {
    return { error: "That phone number is already linked to another account." };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, phone } },
  });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Could not create the account. Please try again." };

  const phoneResult = await reservePhoneForUser(admin, data.user.id, phone);
  if (phoneResult.error) {
    // Keep email and phone ownership consistent if a concurrent signup won.
    await admin.auth.admin.deleteUser(data.user.id);
    return phoneResult;
  }

  if (role === "admin") {
    try {
      await profileModel.promoteToAdmin(admin, data.user.id);
    } catch {
      await admin.auth.admin.deleteUser(data.user.id);
      return { error: "Could not create the admin account. Please try again." };
    }
  }

  return { data };
}

export async function signUpCustomer(prevState, formData) {
  const email = normalizeEmail(formData.get("email"));
  const phone = normalizePhone(formData.get("phone"));
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();

  if (!email || !phone || password.length < 6 || !fullName) {
    return {
      error: "Enter your name, a valid email, a valid phone number, and a password with at least 6 characters.",
    };
  }

  const result = await signUpAccount({ email, phone, password, fullName, role: "customer" });
  if (result.error) return result;
  if (!result.data.session) {
    return { success: "Account created. Check your email to confirm, then log in with your email or phone number." };
  }
  redirect("/dashboard");
}

export async function signUpAdmin(prevState, formData) {
  const email = normalizeEmail(formData.get("email"));
  const phone = normalizePhone(formData.get("phone"));
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const code = String(formData.get("admin_code") || "");

  if (!email || !phone || password.length < 6 || !fullName || !code) {
    return {
      error: "Enter every field, including a valid phone number. Password needs at least 6 characters.",
    };
  }
  if (code !== process.env.ADMIN_SIGNUP_CODE) {
    return { error: "That admin code is not valid." };
  }

  const result = await signUpAccount({ email, phone, password, fullName, role: "admin" });
  if (result.error) return result;
  if (!result.data.session) {
    return { success: "Admin account created. Check your email to confirm, then log in with your email or phone number." };
  }
  redirect("/admin");
}

export async function signIn(prevState, formData) {
  const identifier = String(formData.get("identifier") || "").trim();
  const password = String(formData.get("password") || "");
  const next = safeNextPath(formData.get("next"));

  if (!identifier || !password) {
    return { error: "Enter your email or phone number and password." };
  }

  const email = normalizeEmail(identifier);
  const phone = email ? null : normalizePhone(identifier);
  if (!email && !phone) {
    return { error: "Enter a valid email address or phone number." };
  }

  let credentials;

  if (email) {
    credentials = { email, password };
  } else {
    // Existing accounts were created with email/password. Resolve the phone
    // alias on the server, then authenticate the same Supabase user account.
    const admin = createAdminClient();
    const profile = await profileModel.findByPhone(admin, phone);

    if (profile) {
      const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.id);
      if (!userError && userData?.user?.email) {
        credentials = { email: userData.user.email, password };
      } else if (!userError && userData?.user?.phone) {
        credentials = { phone: userData.user.phone, password };
      }
    }

    // Use a real auth request even when no phone match exists, keeping the
    // public response generic and avoiding account-enumeration messages.
    credentials ||= { email: "phone-login-miss@invalid.local", password };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error || !data.user) {
    return { error: "Wrong email/phone number or password." };
  }

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
