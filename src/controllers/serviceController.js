"use server";
// CONTROLLER: services — admin edits to the service catalog.
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { serviceModel } from "@/models/serviceModel";

export async function updateService(prevState, formData) {
  const id = Number(formData.get("id"));
  if (!id) return { error: "Invalid service." };
  const fields = {
    name: String(formData.get("name") || "").trim(),
    tagline: String(formData.get("tagline") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    price_range: String(formData.get("price_range") || "").trim(),
    duration: String(formData.get("duration") || "").trim(),
    active: formData.get("active") === "on",
  };
  if (!fields.name) return { error: "Name is required." };
  try {
    await serviceModel.update(createClient(), id, fields);
  } catch {
    return { error: "Save failed. Are you signed in as admin?" };
  }
  revalidatePath("/");
  revalidatePath("/admin/services");
  return { success: "Saved." };
}
