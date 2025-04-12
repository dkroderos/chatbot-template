import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import ChatInput from "../components/ChatInput";
import Conversations from "../components/Conversations";
import Header from "../components/Header";
import { ChatRequest, Conversation } from "../models";

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("/hubs/chat-hub")
      .configureLogging(signalR.LogLevel.None)
      .withAutomaticReconnect()
      .build();

    hubConnection.on("ReceiveResponse", (message: string) => {
      setConversations((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        updated[updated.length - 1] = {
          ...last,
          response: (last.response ?? "") + message,
        };
        return updated;
      });
    });

    hubConnection.on("NotifyDone", () => {
      setIsBusy(false);
    });

    hubConnection
      .start()
      .catch((err) => console.error("Connection failed: ", err));
    setConnection(hubConnection);

    return () => {
      if (hubConnection) {
        hubConnection.stop();
      }
    };
  }, []);

  const handleSubmit = async (message: string) => {
    if (!connection) return;

    setIsBusy(true);

    const newConversation: Conversation = {
      message,
      response: "",
    };

    setConversations((prev) => [...prev, newConversation]);

    const chatRequest: ChatRequest = {
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
      <div
        className={isEmpty ? "absolute bottom-1/2 translate-y-1/2 w-full" : ""}
      >
        <ChatInput isBusy={isBusy} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ChatPage;
