// MODEL: portfolio — all reads/writes for the portfolio table.
export const portfolioModel = {
  async listByCategory(supabase, category) {
    const { data, error } = await supabase
      .from("portfolio").select("*")
      .eq("category", category).order("sort_order").order("id");
    if (error) throw error;
    return data;
  },
  async listAll(supabase) {
    const { data, error } = await supabase
      .from("portfolio").select("*").order("category").order("sort_order").order("id");
    if (error) throw error;
    return data;
  },
  async create(supabase, item) {
    const { error } = await supabase.from("portfolio").insert(item);
    if (error) throw error;
  },
  async update(supabase, id, fields) {
    const { error } = await supabase.from("portfolio").update(fields).eq("id", id);
    if (error) throw error;
  },
  async remove(supabase, id) {
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) throw error;
  },
};
