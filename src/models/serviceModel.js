// MODEL: services — all reads/writes for the services table.
export const serviceModel = {
  async listActive(supabase) {
    const { data, error } = await supabase
      .from("services").select("*").eq("active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
  async listAll(supabase) {
    const { data, error } = await supabase
      .from("services").select("*").order("sort_order");
    if (error) throw error;
    return data;
  },
  async getBySlug(supabase, slug) {
    const { data, error } = await supabase
      .from("services").select("*").eq("slug", slug).single();
    if (error) return null;
    return data;
  },
  async update(supabase, id, fields) {
    const { error } = await supabase.from("services").update(fields).eq("id", id);
    if (error) throw error;
  },
};
