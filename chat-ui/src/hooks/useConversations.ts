import { useEffect, useState } from "react";
import { ConversationModel } from "../models";

const useConversations = () => {
  const [conversations, setConversations] = useState<ConversationModel[]>([]);

  useEffect(() => {
    const savedConversations = sessionStorage.getItem("conversations");
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  return { conversations, setConversations };
};

export default useConversations;
