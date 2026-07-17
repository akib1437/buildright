import MessagesList from "@/components/admin/MessagesList";
import { createClient } from "@/lib/supabase/server";
import { messageModel } from "@/models/messageModel";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const messages = await messageModel.listAll(supabase);
  return (
    <main>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-blueprint">admin · messages</p>
      <h1 className="mt-2 font-display font-extrabold tracking-tight text-3xl">Contact inbox</h1>
      <div className="mt-8">
        <MessagesList messages={messages} />
      </div>
    </main>
  );
}
