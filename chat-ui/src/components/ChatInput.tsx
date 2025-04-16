import { Send, StopCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Props {
  placeholder?: string;
  isBusy: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onSubmit: (message: string) => void;
  onStop: () => void;
}

const ChatInput: React.FC<Props> = ({
  placeholder = "Type a message...",
  isBusy,
  textareaRef,
  onSubmit,
  onStop,
}) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY =
        newHeight >= 200 ? "auto" : "hidden";
    }
  }, [message, textareaRef]);

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
    <>
      <div className="w-full z-1">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="p-3"
            onClick={() => textareaRef.current?.focus()}
          >
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
                  onClick={!isBusy ? handleSubmit : onStop}
                  disabled={!isBusy && !message.trim()}
                  className="rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  title="Send"
                >
                  {isBusy ? (
                    <StopCircle
                      size={20}
                      className="text-black dark:text-white"
                    />
                  ) : (
                    <Send size={20} className="text-black dark:text-white" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
