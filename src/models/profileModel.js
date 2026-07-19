// MODEL: profiles — user profile reads/writes.
export const profileModel = {
  async get(supabase, id) {
    const { data, error } = await supabase
      .from("profiles").select("*").eq("id", id).single();
    if (error) return null;
    return data;
  },
  async findByPhone(adminSupabase, phone) {
    const { data, error } = await adminSupabase
      .from("profiles")
      .select("id, phone")
      .eq("phone", phone)
      .limit(2);
    if (error) throw error;

    // Phone numbers must identify exactly one account. If old data contains
    // duplicates, fail closed instead of choosing the wrong user.
    return data?.length === 1 ? data[0] : null;
  },
  async listCustomers(supabase) {
    const { data, error } = await supabase
      .from("profiles").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async promoteToAdmin(adminSupabase, id) {
    const { error } = await adminSupabase
      .from("profiles").update({ role: "admin" }).eq("id", id);
    if (error) throw error;
  },
  async updateContact(supabase, id, fields) {
    const { data, error } = await supabase
      .from("profiles")
      .update(fields)
      .eq("id", id)
      .select("id")
      .single();
    if (error) throw error;
    return data;
  },
};
