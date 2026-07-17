// MODEL: bookings — all reads/writes for the bookings table.
export const bookingModel = {
  async create(supabase, booking) {
    const { data, error } = await supabase
      .from("bookings").insert(booking).select().single();
    if (error) throw error;
    return data;
  },
  async listForUser(supabase, userId) {
    const { data, error } = await supabase
      .from("bookings").select("*")
      .eq("user_id", userId)
      .order("booking_date", { ascending: false });
    if (error) throw error;
    return data;
  },
  async listAll(supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*, profiles(full_name, phone)")
      .order("booking_date", { ascending: true })
      .order("time_slot", { ascending: true });
    if (error) throw error;
    return data;
  },
  async takenSlots(supabase, date) {
    // Slots already held by pending/confirmed bookings on a date (one crew).
    const { data, error } = await supabase
      .from("bookings").select("time_slot")
      .eq("booking_date", date)
      .in("status", ["pending", "confirmed"]);
    if (error) throw error;
    return data.map((r) => r.time_slot);
  },
  async setStatus(supabase, id, status, adminNote) {
    const fields = { status };
    if (adminNote !== undefined) fields.admin_note = adminNote;
    const { error } = await supabase.from("bookings").update(fields).eq("id", id);
    if (error) throw error;
  },
  async cancelOwn(supabase, id, userId) {
    const { error } = await supabase
      .from("bookings").update({ status: "cancelled" })
      .eq("id", id).eq("user_id", userId);
    if (error) throw error;
  },
  async remove(supabase, id) {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) throw error;
  },
  async counts(supabase) {
    const { data, error } = await supabase.from("bookings").select("status");
    if (error) throw error;
    const c = { total: data.length, pending: 0, confirmed: 0, completed: 0, cancelled: 0, declined: 0 };
    for (const r of data) c[r.status] = (c[r.status] || 0) + 1;
    return c;
  },
};
