import getConversations from "@/actions/getConversations";
import Sidebar from "@/rootComponents/Sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import getUsers from "@/actions/getUsers";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <Sidebar>
      <ConversationList users={users} initialItems={conversations} />

      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
