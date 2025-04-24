import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ConversationModel } from "../models";
import EditableMessage from "./EditableMessage";
import Message from "./Message";
import Response from "./Response";

interface Props {
  conversations: ConversationModel[];
  isBusy: boolean;
  error: string | null;
  editingConversationId: string | null;
  shouldScrollDownRef: React.RefObject<boolean>;
  setEditingConversationId: (id: string | null) => void;
  onSave: (id: string, newMessage: string) => void;
}

const Conversations: React.FC<Props> = ({
  conversations,
  isBusy,
  error,
  editingConversationId,
  shouldScrollDownRef,
  setEditingConversationId,
  onSave,
}) => {
  const [isDownArrowVisible, setIsDownArrowVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const checkIfAtBottom = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 50;
      setIsDownArrowVisible(!isAtBottom);
    }
  };

  const isLastConversation = (index: number) => {
    return index === conversations.length - 1;
  };

  useEffect(() => {
    if (shouldScrollDownRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      shouldScrollDownRef.current = false;
    }
  }, [conversations, shouldScrollDownRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkIfAtBottom);
      return () => container.removeEventListener("scroll", checkIfAtBottom);
    }
  }, []);

  useEffect(() => {
    checkIfAtBottom();
  }, [conversations]);

  return (
    <>
      <div className="relative flex-1 min-h-0">
        <div className="overflow-y-auto h-full" ref={containerRef}>
          <div className="max-w-3xl mx-auto mt-5 px-2">
            {conversations.map((conversation, index) => (
              <div key={index}>
                {conversation.id === editingConversationId ? (
                  <>
                    <EditableMessage
                      message={conversation.message}
                      isSaveEnabled={!isBusy}
                      onCancel={() => setEditingConversationId(null)}
                      onSave={(newMessage) => {
                        setEditingConversationId(null);
                        onSave(conversation.id, newMessage);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Message
                      message={conversation.message}
                      showPencilButton={editingConversationId === null}
                      onPencilClick={() =>
                        setEditingConversationId(conversation.id)
                      }
                    />
                  </>
                )}
                <div
                  style={{
                    minHeight: isLastConversation(index)
                      ? `${window.innerHeight * 0.7}px`
                      : "auto",
                  }}
                >
                  <Response
                    response={conversation.response}
                    error={isLastConversation(index) ? error : null}
                    showCopyButton={!isLastConversation(index) || !isBusy}
                  />
                </div>
              </div>
            ))}

            <div ref={bottomRef} className="pb-20" />
          </div>
        </div>

        <div
          onClick={() =>
            bottomRef.current?.scrollIntoView({
              behavior: "smooth",
            })
          }
          className={`absolute bottom-1 left-1/2 -translate-x-1/2 -translate-y-1/2 z-2 bg-neutral-200 dark:bg-neutral-950 border-gray-300 dark:border-gray-700 rounded-full p-1 transition-opacity cursor-pointer
              ${
                isDownArrowVisible
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={24} className="text-black dark:text-white" />
        </div>
      </div>
    </>
  );
};

export default Conversations;
