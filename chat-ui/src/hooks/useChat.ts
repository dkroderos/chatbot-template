import * as signalR from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import { ChatRequestModel, ConversationModel } from "../models";

const useChat = () => {
  const [conversations, setConversations] = useState<ConversationModel[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<signalR.ISubscription<string> | null>(null);

  const streamChat = (chatRequest: ChatRequestModel) => {
    if (!connection) {
      setError("You are disconnected.");
      return;
    }

    try {
      const stream = connection.stream("StreamChat", chatRequest);
      subscriptionRef.current = stream.subscribe({
        next: (chunk: string) => {
          setConversations((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = {
              ...last,
              response: (last.response ?? "") + chunk,
            };
            return updated;
          });
        },
        complete: () => setIsBusy(false),
        error: (err) => {
          console.error("Stream error:", err);
          setError("An error occurred while generating the response.");
          setIsBusy(false);
        },
      });
    } catch (err) {
      console.error("Error sending message: ", err);
      setError("An error occurred while generating the response.");
      setIsBusy(false);
    }
  };

  const handleSubmit = (
    message: string,
    conversations: ConversationModel[],
    newConversation: ConversationModel
  ) => {
    setIsBusy(true);
    setError(null);

    setConversations((prev) => [...prev, newConversation]);

    const chatRequest: ChatRequestModel = {
      input: message,
      previousConversations: conversations.map(({ message, response }) => ({
        message,
        response,
      })),
    };

    streamChat(chatRequest);
  };

  const handleStop = () => {
    subscriptionRef.current?.dispose();
    subscriptionRef.current = null;
    setIsBusy(false);
  };

  const handleSaveEdit = (
    id: string,
    newMessage: string,
    conversations: ConversationModel[]
  ) => {
    setIsBusy(true);
    setError(null);

    setConversations((prev) => {
      const index = prev.findIndex((conv) => conv.id === id);
      if (index === -1) return prev;

      const updated = [...prev.slice(0, index + 1)];
      updated[index] = {
        ...updated[index],
        message: newMessage,
        response: undefined,
      };
      return updated;
    });

    const chatRequest: ChatRequestModel = {
      input: newMessage,
      previousConversations: conversations
        .slice(0, -1)
        .map(({ message, response }) => ({
          message,
          response,
        })),
    };

    streamChat(chatRequest);
  };

  const handleClear = () => {
    setConversations([]);
  };

  useEffect(() => {
    const savedConversations = sessionStorage.getItem("conversations");
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    const hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("/hubs/chat-hub")
      .configureLogging(signalR.LogLevel.None)
      .withAutomaticReconnect()
      .build();

    hubConnection
      .start()
      .catch((err) => console.error("Connection failed: ", err));

    setConnection(hubConnection);

    return () => {
      subscriptionRef.current?.dispose();
      hubConnection.stop();
    };
  }, []);

  return {
    conversations,
    isBusy,
    error,
    handleSubmit,
    handleStop,
    handleSaveEdit,
    handleClear,
  };
};

export default useChat;
