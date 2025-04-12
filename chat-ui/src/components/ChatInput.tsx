import React, { useEffect, useRef, useState } from "react";

interface Props {
  placeholder?: string;
  onSubmit?: (message: string) => void;
}

const ChatInput: React.FC<Props> = ({
  placeholder = "Type a message...",
  onSubmit,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (!message.trim()) return;
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
      className="transition-colors duration-300 fixed bottom-0 left-0 w-full px-4 py-3 bg-white dark:bg-black z-50"
    >
      <div className="w-full max-w-3xl mx-auto flex items-end relative">
        <textarea
          ref={textareaRef}
          rows={1}
          className="transition-colors duration-300 w-full resize-none rounded-xl border border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-neutral-600"
          style={{
            overflow: "hidden",
            maxHeight: "200px",
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 transparent',
          }}
          placeholder={placeholder}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </form>
  );
};

export default ChatInput;
