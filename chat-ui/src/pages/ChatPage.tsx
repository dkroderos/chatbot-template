import { useEffect, useRef, useState } from "react";
import ChatInput from "../components/ChatInput";
import ClearConversations from "../components/ClearConversations";
import Conversations from "../components/Conversations";
import Header from "../components/Header";
import useConversations from "../hooks/useConversations";
import useSignalR from "../hooks/useSignalR";
import useTheme from "../hooks/useTheme";
import { ChatRequestModel, ConversationModel } from "../models";

const ChatPage: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { conversations, setConversations } = useConversations();
  const { connection, isBusy, setIsBusy } = useSignalR(setConversations);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const shouldScrollDownRef = useRef<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (message: string) => {
    if (!connection) return;

    setIsBusy(true);

    const newConversation: ConversationModel = {
      message,
      response: "",
    };

    shouldScrollDownRef.current = true;
    setConversations((prev) => [...prev, newConversation]);

    const chatRequest: ChatRequestModel = {
      input: message,
      previousConversations: conversations,
    };

    try {
      await connection.send("SendChat", chatRequest);
    } catch (error) {
      console.error("Error sending message: ", error);
      setIsBusy(false);
    }
  };

  const isEmpty = conversations.length === 0;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onTrashClick={() => setIsModalOpen((prev) => !prev)}
        />
        <div
          className={`flex-grow flex px-4 py-6 ${
            isEmpty ? "items-center justify-center" : "justify-center"
          }`}
        >
          <div className="w-full max-w-3xl space-y-4">
            {!isEmpty && (
              <Conversations
                conversations={conversations}
                bottomRef={bottomRef}
                isBusy={isBusy}
              />
            )}
          </div>
        </div>
        <div
          className={
            isEmpty ? "absolute bottom-1/2 translate-y-1/2 w-full" : ""
          }
        >
          <ChatInput
            conversations={conversations}
            isBusy={isBusy}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {isModalOpen && (
        <ClearConversations
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            setConversations([]);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ChatPage;
