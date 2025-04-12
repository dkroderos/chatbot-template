import { useState } from "react";
import ChatInput from "../components/ChatInput";
import Conversations from "../components/Conversations";
import Header from "../components/Header";
import { Conversation } from "../models";

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const handleSubmit = (message: string) => {
    const newConversation: Conversation = {
      message,
      response: message,
    };
    setConversations((prev) => [...prev, newConversation]);
  };

  const isEmpty = conversations.length === 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div
        className={`flex-grow flex px-4 py-6 ${
          isEmpty ? "items-center justify-center" : "justify-center"
        }`}
      >
        <div className="w-full max-w-3xl space-y-4">
          {!isEmpty && <Conversations conversations={conversations} />}
        </div>
      </div>
      <div className={isEmpty ? "absolute bottom-1/2 translate-y-1/2 w-full" : ""}>
        <ChatInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ChatPage;
