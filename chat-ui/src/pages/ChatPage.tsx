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
  const { connection, isBusy, setIsBusy, error, setError } =
    useSignalR(setConversations);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDownArrowVisible, setIsDownArrowVisible] = useState<boolean>(true);
  const subscriptionRef = useRef<signalR.ISubscription<string> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleStop = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.dispose();
      subscriptionRef.current = null;
      setIsBusy(false);
    }
  };

  const handleSubmit = async (message: string) => {
    if (!connection) return;

    setIsBusy(true);
    setError(null);

    const newConversation: ConversationModel = {
      message,
      response: undefined,
    };

    setConversations((prev) => [...prev, newConversation]);

    const chatRequest: ChatRequestModel = {
      input: message,
      previousConversations: conversations,
    };

    try {
      const stream = connection.stream("StreamChat", chatRequest);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });

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
        complete: () => {
          setIsBusy(false);
        },
        error: (err) => {
          console.error("Stream error:", err);
          setError("An error occurred while generating the response.");
          setIsBusy(false);
        },
      });

      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message: ", error);
      setError("An error occurred while generating the response.");
      setIsBusy(false);
    }
  };

  const isEmpty = conversations.length === 0;

  const checkIfAtBottom = () => {
    if (bottomRef.current) {
      const isAtBottom =
        bottomRef.current.getBoundingClientRect().top <= window.innerHeight;
      setIsDownArrowVisible(!isAtBottom);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        if (event.shiftKey) toggleTheme();
        else setIsModalOpen((prev) => !prev);
      }

      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "l") {
        event.preventDefault();
        toggleTheme();
      }

      if (
        event.key === "Enter" &&
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
    window.addEventListener("scroll", checkIfAtBottom);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("scroll", checkIfAtBottom);
    };
  }, [toggleTheme]);

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.dispose();
      }
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
                error={error}
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
            textareaRef={textareaRef}
            onSubmit={handleSubmit}
            onStop={handleStop}
            isDownArrowVisible={isDownArrowVisible}
            onDownArrowClick={() => {
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
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
