"use client";

import EmptyState from "@/components/EmptyState";
import useConversation from "@/hooks/useConversation";
import clsx from "clsx";

const Conversation = () => {
  let { isOpen } = useConversation();
  isOpen = true;
  return (
    <div
      className={clsx(`lg:pl-80 h-full lg-block`, isOpen ? "block" : "hidden")}
    >
      <EmptyState />
    </div>
  );
};

export default Conversation;
