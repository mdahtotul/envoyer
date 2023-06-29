"use client";

import { Conversation } from "@prisma/client";

interface ConversationListProps {
  initialItems: Conversation[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
}) => {
  return (
    <div>
      <h2>Conversation List</h2>
    </div>
  );
};

export default ConversationList;
