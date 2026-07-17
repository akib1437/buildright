// MODEL: profiles — user profile reads/writes.
export const profileModel = {
  async get(supabase, id) {
    const { data, error } = await supabase
      .from("profiles").select("*").eq("id", id).single();
    if (error) return null;
    return data;
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
    const { error } = await supabase.from("profiles").update(fields).eq("id", id);
    if (error) throw error;
  },
};
