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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex justify-center px-4 py-6">
        <div className="w-full max-w-3xl space-y-4">
          <Conversations conversations={conversations} />
        </div>
      </div>
      <ChatInput onSubmit={handleSubmit} />
    </div>
  );
};

export default ChatPage;
