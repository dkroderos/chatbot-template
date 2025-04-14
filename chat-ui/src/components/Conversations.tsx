import React, { useEffect, useState } from "react";
import { ConversationModel } from "../models";
import Conversation from "./Conversation";

interface Props {
  conversations: ConversationModel[];
  isEditingMessageRef: React.RefObject<boolean>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  isBusy: boolean;
  error: string | null;
  onSave: (id: string, newMessage: string) => void;
}

const Conversations: React.FC<Props> = ({
  conversations,
  isEditingMessageRef,
  bottomRef,
  isBusy,
  error,
  onSave,
}) => {
  const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);
  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null);

  const handlePencilClick = (conversationId: string) => {
    setEditingConversationId(conversationId);
    if (isEditingMessageRef.current !== null) {
      isEditingMessageRef.current = true;
    }
  };

  const handleCancelEdit = () => {
    if (isEditingMessageRef.current !== null) {
      isEditingMessageRef.current = false;
    }
    setEditingConversationId(null);
  };

  const handleSaveEdit = (id: string, newMessage: string) => {
    if (isEditingMessageRef.current !== null) {
      isEditingMessageRef.current = false;
    }
    setEditingConversationId(null);

    onSave(id, newMessage);
  };

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
          screenHeight={screenHeight}
          conversation={conversation}
          isEditingMessageRef={isEditingMessageRef}
          isEditing={conversation.id === editingConversationId}
          isLastIndex={index === conversations.length - 1}
          isBusy={isBusy}
          error={error}
          onPencilClick={() => handlePencilClick(conversation.id)}
          cancelEdit={handleCancelEdit}
          saveEdit={(id, newMessage) => handleSaveEdit(id, newMessage)}
        />
      ))}
      <div ref={bottomRef} className="pb-20" />
    </div>
  );
};

export default Conversations;
