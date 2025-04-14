import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
  const isEditingMessageRef = useRef<boolean>(false);
  const shouldScrollDownRef = useRef<boolean>(false);
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

  const handleSaveEdit = (id: string, newMessage: string) => {
    if (isBusy) return;

    if (!connection) {
      setError("You are disconnected.");
      return;
    }

    setIsBusy(true);
    setError(null);

    shouldScrollDownRef.current = true;
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
        complete: () => {
          setIsBusy(false);
        },
        error: (err) => {
          console.error("Stream error:", err);
          setError("An error occurred while generating the response.");
          setIsBusy(false);
        },
      });
    } catch (error) {
      console.error("Error sending message: ", error);
      setError("An error occurred while generating the response.");
      setIsBusy(false);
    }
  };

  const handleSubmit = async (message: string) => {
    if (isBusy) return;

    if (!connection) {
      setError("You are disconnected.");
      return;
    }

    setIsBusy(true);
    setError(null);

    const newId = uuidv4();
    const newConversation: ConversationModel = {
      id: newId,
      message,
      response: undefined,
    };

    shouldScrollDownRef.current = true;
    setConversations((prev) => [...prev, newConversation]);

    const chatRequest: ChatRequestModel = {
      input: message,
      previousConversations: conversations.map(({ message, response }) => ({
        message,
        response,
      })),
    };

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
        complete: () => {
          setIsBusy(false);
        },
        error: (err) => {
          console.error("Stream error:", err);
          setError("An error occurred while generating the response.");
          setIsBusy(false);
        },
      });
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
        else if (!isBusy) setIsModalOpen((prev) => !prev);
      }

      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "l") {
        event.preventDefault();
        toggleTheme();
      }

      if (
        event.key === "Enter" &&
        !isEditingMessageRef.current &&
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
  }, [toggleTheme, isBusy]);

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (shouldScrollDownRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      shouldScrollDownRef.current = false;
    }
  });

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onTrashClick={() => {
            if (!isBusy) setIsModalOpen((prev) => !prev);
          }}
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
                isEditingMessageRef={isEditingMessageRef}
                bottomRef={bottomRef}
                isBusy={isBusy}
                error={error}
                onSave={(id, newMessage) => handleSaveEdit(id, newMessage)}
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
          isBusy={isBusy}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            if (!isBusy) {
              setConversations([]);
              setIsModalOpen(false);
            }
          }}
        />
      )}
    </>
  );
};

export default ChatPage;
