"use server";
// CONTROLLER: bookings — create, cancel, availability, admin status changes.
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { bookingModel } from "@/models/bookingModel";
import { TIME_SLOTS, CLOSED_WEEKDAY } from "@/lib/constants";

function isValidDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !isNaN(d) && d >= today && d.getDay() !== CLOSED_WEEKDAY;
}

export async function createBooking(prevState, formData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const serviceSlug = String(formData.get("service_slug") || "");
  const date = String(formData.get("booking_date") || "");
  const slot = String(formData.get("time_slot") || "");

  if (!["repair", "remodel", "addition"].includes(serviceSlug))
    return { error: "Unknown service." };
  if (!isValidDate(date))
    return { error: "Pick an available date (we're closed Sundays; past dates can't be booked)." };
  if (!TIME_SLOTS.includes(slot))
    return { error: "Pick a time slot." };

  // Availability check against all users' bookings (service role, times only).
  const taken = await bookingModel.takenSlots(createAdminClient(), date);
  if (taken.includes(slot))
    return { error: "That slot was just taken. Pick another time." };

  try {
    await bookingModel.create(supabase, {
      user_id: user.id,
      service_slug: serviceSlug,
      booking_date: date,
      time_slot: slot,
      property_type: String(formData.get("property_type") || ""),
      option_1: String(formData.get("option_1") || ""),
      option_2: String(formData.get("option_2") || ""),
      address: String(formData.get("address") || "").slice(0, 300),
      phone: String(formData.get("phone") || "").slice(0, 40),
      details: String(formData.get("details") || "").slice(0, 2000),
    });
  } catch (e) {
    return { error: "Could not save the booking. Try again." };
  }
  revalidatePath("/dashboard");
  redirect("/dashboard?booked=1");
}

export async function getTakenSlots(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
  return bookingModel.takenSlots(createAdminClient(), date);
}

export async function cancelMyBooking(bookingId) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await bookingModel.cancelOwn(supabase, bookingId, user.id);
  revalidatePath("/dashboard");
}

// ---- admin actions (RLS enforces admin role) ----
export async function adminSetBookingStatus(bookingId, status, adminNote) {
  const supabase = createClient();
  await bookingModel.setStatus(supabase, bookingId, status, adminNote);
  revalidatePath("/admin/schedule");
  revalidatePath("/admin");
}

export async function adminDeleteBooking(bookingId) {
  const supabase = createClient();
  await bookingModel.remove(supabase, bookingId);
  revalidatePath("/admin/schedule");
}
