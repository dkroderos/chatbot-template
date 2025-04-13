import React, { useEffect, useState } from "react";
import { Conversation } from "../models";

interface Props {
  conversations: Conversation[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
}

const Conversations: React.FC<Props> = ({ conversations, bottomRef }) => {
  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="space-y-4 overflow-y-auto">
      {conversations.map((conv, index) => (
        <React.Fragment key={index}>
          <div className="flex justify-end">
            <div className="transition-colors duration-300 whitespace-pre-wrap p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white max-w-[80%] break-words">
              {conv.message}
            </div>
          </div>
          <div
            className="flex justify-start"
            style={{
              minHeight:
                index === conversations.length - 1
                  ? `${screenHeight * 0.75}px`
                  : "auto",
            }}
          >
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
