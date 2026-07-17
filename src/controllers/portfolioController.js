"use server";
// CONTROLLER: portfolio — admin CRUD for project photos.
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { portfolioModel } from "@/models/portfolioModel";

const CATEGORIES = ["bath", "kitchen", "repairs"];

function refresh() {
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  revalidatePath("/");
}

export async function addPortfolioItem(prevState, formData) {
  const category = String(formData.get("category") || "");
  const title = String(formData.get("title") || "").trim();
  const imageUrl = String(formData.get("image_url") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!CATEGORIES.includes(category)) return { error: "Pick a category." };
  if (!title || !imageUrl.startsWith("http")) return { error: "Title and a full image URL are required." };
  try {
    const supabase = createClient();
    await portfolioModel.create(supabase, { category, title, image_url: imageUrl, description });
  } catch {
    return { error: "Could not add the project. Are you signed in as admin?" };
  }
  refresh();
  return { success: "Project added." };
}

export async function updatePortfolioItem(prevState, formData) {
  const id = Number(formData.get("id"));
  const fields = {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    image_url: String(formData.get("image_url") || "").trim(),
    category: String(formData.get("category") || ""),
  };
  if (!id || !fields.title || !CATEGORIES.includes(fields.category)) return { error: "Invalid update." };
  try {
    await portfolioModel.update(createClient(), id, fields);
  } catch {
    return { error: "Update failed." };
  }
  refresh();
  return { success: "Saved." };
}

export async function deletePortfolioItem(id) {
  await portfolioModel.remove(createClient(), Number(id));
  refresh();
}
