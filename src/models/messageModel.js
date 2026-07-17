// MODEL: messages — contact-form messages.
export const messageModel = {
  async create(supabase, msg) {
    const { error } = await supabase.from("messages").insert(msg);
    if (error) throw error;
  },
  async listAll(supabase) {
    const { data, error } = await supabase
      .from("messages").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  async setRead(supabase, id, read) {
    const { error } = await supabase.from("messages").update({ read }).eq("id", id);
    if (error) throw error;
  },
  async remove(supabase, id) {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) throw error;
  },
};
