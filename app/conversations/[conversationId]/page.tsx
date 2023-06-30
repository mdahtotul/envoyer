import getConversationById from "@/actions/getConversationById";
import getMessages from "@/actions/getMessages";
import EmptyState from "@/rootComponents/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";

interface IdParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IdParams }) => {
  const conversation = await getConversationById(params?.conversationId);
  const messages = await getMessages(params?.conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body messages={messages} />
      </div>
    </div>
  );
};

export default ConversationId;
