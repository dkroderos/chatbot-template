import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "../components/ChatInput";
import ClearConversations from "../components/ClearConversations";
import Conversations from "../components/Conversations";
import Header from "../components/Header";
import useChat from "../hooks/useChat";

const ChatPage: React.FC = () => {
  const {
    conversations,
    isBusy,
    error,
    handleSubmit,
    handleStop,
    handleSaveEdit,
    handleClear,
  } = useChat();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null);
  const shouldScrollDownRef = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEmpty = conversations.length === 0;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        if (!isBusy && !isEmpty) setIsModalOpen((prev) => !prev);
      }

      if (
        event.key === "Enter" &&
        editingConversationId === null &&
        document.activeElement !== textareaRef.current
      ) {
        event.preventDefault();
        textareaRef.current?.focus();
      }

      if (
        event.key === "Escape" &&
        document.activeElement === textareaRef.current
      ) {
        event.preventDefault();
        textareaRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isBusy, editingConversationId, isEmpty]);

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header
          isTrashDisabled={isEmpty}
          onTrashClick={() => {
            if (!isBusy) setIsModalOpen((prev) => !prev);
          }}
        />

        {isEmpty ? (
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="text-3xl font-bold mb-2 text-neutral-700 dark:text-neutral-300">
              Chatbot Template
            </div>
            <ChatInput
              isBusy={isBusy}
              textareaRef={textareaRef}
              onSubmit={(message) => {
                shouldScrollDownRef.current = true;
                handleSubmit(message, conversations, {
                  id: uuidv4(),
                  message,
                  response: undefined,
                });
              }}
              onStop={handleStop}
            />
            <div className="text-center text-xs text-neutral-500 mb-2 mx-2">
              This software is released into the public domain and is free of
              restrictions under the terms of the{" "}
              <a
                href="https://unlicense.org/"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unlicense
              </a>
              .
              <br />
              Source available on{" "}
              <a
                href="https://github.com/dkroderos/chatbot-template"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </div>
          </div>
        ) : (
          <>
            <Conversations
              conversations={conversations}
              isBusy={isBusy}
              error={error}
              editingConversationId={editingConversationId}
              shouldScrollDownRef={shouldScrollDownRef}
              setEditingConversationId={setEditingConversationId}
              onSave={(id, newMessage) => {
                shouldScrollDownRef.current = true;
                handleSaveEdit(id, newMessage, conversations);
              }}
            />

            <ChatInput
              isBusy={isBusy}
              textareaRef={textareaRef}
              onSubmit={(message) => {
                shouldScrollDownRef.current = true;
                handleSubmit(message, conversations, {
                  id: uuidv4(),
                  message,
                  response: undefined,
                });
              }}
              onStop={handleStop}
            />
          </>
        )}

        {isModalOpen && (
          <ClearConversations
            isConfirmDisabled={isBusy}
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => {
              if (!isBusy) {
                handleClear();
                setIsModalOpen(false);
              }
            }}
          />
        )}
      </div>
    </>
  );
};

export default ChatPage;
