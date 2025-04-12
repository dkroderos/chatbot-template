import React, { useEffect, useRef } from "react";
import { Conversation } from "../models";

interface Props {
  conversations: Conversation[];
}

const Conversations: React.FC<Props> = ({ conversations }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  return (
    <div className="space-y-4 overflow-y-auto">
      {conversations.map((conv, index) => (
        <React.Fragment key={index}>
          <div className="flex justify-end">
            <div className="transition-colors duration-300 whitespace-pre-wrap p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white max-w-[80%] break-words">
              {conv.message}
            </div>
          </div>
          <div className="flex justify-start">
            <div className="whitespace-pre-wrap max-w-[80%] break-words">
              {conv.response}
            </div>
          </div>
        </React.Fragment>
      ))}
      <div ref={bottomRef} className="pb-20" />
    </div>
  );
};

export default Conversations;
