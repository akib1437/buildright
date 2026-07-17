"use server";
// CONTROLLER: contact messages — public send, admin manage.
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { messageModel } from "@/models/messageModel";

export async function sendMessage(prevState, formData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!name || !email.includes("@") || !body) {
    return { error: "Add your name, a valid email, and a message." };
  }
  try {
    await messageModel.create(createClient(), { name, email, body: body.slice(0, 3000) });
  } catch {
    return { error: "Could not send. Try again." };
  }
  return { success: "Message sent. We reply within one business day." };
}

export async function toggleMessageRead(id, read) {
  await messageModel.setRead(createClient(), Number(id), read);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id) {
  await messageModel.remove(createClient(), Number(id));
  revalidatePath("/admin/messages");
}
