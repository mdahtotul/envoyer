"use client";

import { FullMessageType } from "@/app/types";
import useConversation from "@/hooks/useConversation";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg, idx) => (
        <MessageBox key={idx} isLast={idx === messages.length - 1} data={msg} />
      ))}

      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
