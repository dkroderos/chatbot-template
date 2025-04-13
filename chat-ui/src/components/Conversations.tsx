import React, { useEffect, useState } from "react";
import { ConversationModel } from "../models";
import Conversation from "./Conversation";

interface Props {
  conversations: ConversationModel[];
  bottomRef: React.RefObject<HTMLDivElement | null>;
  isBusy: boolean;
}

const Conversations: React.FC<Props> = ({
  conversations,
  bottomRef,
  isBusy,
}) => {
  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="space-y-4 overflow-y-auto">
      {conversations.map((conversation, index) => (
        <Conversation
          key={index}
          conversation={conversation}
          screenHeight={screenHeight}
          isLastIndex={index === conversations.length - 1}
          isBusy={isBusy}
        />
      ))}
      <div ref={bottomRef} className="pb-20" />
    </div>
  );
};

export default Conversations;
