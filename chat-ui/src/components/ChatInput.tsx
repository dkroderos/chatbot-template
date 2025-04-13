import { Send, StopCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ConversationModel } from "../models";

interface Props {
  placeholder?: string;
  conversations: ConversationModel[];
  isBusy: boolean;
  onSubmit?: (message: string) => void;
}

const ChatInput: React.FC<Props> = ({
  placeholder = "Type a message...",
  conversations,
  isBusy,
  onSubmit,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY =
        newHeight >= 200 ? "auto" : "hidden";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (isBusy || !message.trim()) return;
    onSubmit?.(message.trim());
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className={`w-full px-4 py-3 bg-white dark:bg-black z-1 ${
        conversations.length === 0
          ? "h-screen flex items-center justify-center"
          : "fixed bottom-0 left-0"
      }`}
      onClick={() => textareaRef.current?.focus()}
    >
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col gap-2 rounded-xl border border-neutral-700 bg-neutral-100 dark:bg-neutral-900 p-3">
          <textarea
            ref={textareaRef}
            disabled={false}
            rows={1}
            className="w-full resize-none bg-transparent text-black dark:text-white focus:outline-none"
            style={{
              overflow: "hidden",
              maxHeight: "200px",
              scrollbarWidth: "thin",
              scrollbarColor: "#888 transparent",
            }}
            placeholder={placeholder}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <div className="flex justify-between items-center">
            <div className="text-sm text-neutral-500">
              {isBusy ? "Generating..." : "Press Enter to send"}
            </div>
            <button
              type="button"
              onClick={!isBusy ? handleSubmit : undefined}
              disabled={!isBusy && !message.trim()}
              className="rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              {isBusy ? (
                <StopCircle size={20} className="text-black dark:text-white" />
              ) : (
                <Send size={20} className="text-black dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
