"use client";

import { pusherClient } from "@/app/libs/pusher";
import { FullMessageType } from "@/app/types";
import useConversation from "@/hooks/useConversation";
import axios from "axios";
import { find } from "lodash";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";

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

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const messageHandler = (msg: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: msg.id })) return current;

        return [...current, msg];
      });

      bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    };

    const updateMessageHandler = (n_msg: FullMessageType) => {
      setMessages((current) =>
        current.map((c_msg) => {
          if (c_msg.id === n_msg.id) {
            return n_msg;
          }

          return c_msg;
        })
      );
    };

    pusherClient.bind("message:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("message:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
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
