import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { ConversationModel } from "../models";

const useSignalR = (
  setConversations: React.Dispatch<React.SetStateAction<ConversationModel[]>>
) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

    hubConnection.on("ReceiveError", (errorMessage: string) => {
      setError(errorMessage);
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
  }, [setConversations]);

  return { connection, isBusy, setIsBusy, error, setError };
};

export default useSignalR;
