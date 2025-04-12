import React, { useState, useRef, useEffect } from "react";

interface TextAreaProps {
  placeholder?: string;
  onSubmit?: (message: string) => void;
  className?: string;
}

const ChatInput: React.FC<TextAreaProps> = ({
  placeholder = "Send a message...",
  onSubmit,
  className = "",
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (message.trim() && onSubmit) {
      onSubmit(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full min-h-[24px] max-h-[calc(75dvh)] py-3 px-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto bg-white text-gray-800 placeholder-gray-400 transition-all duration-200"
        rows={1}
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim()}
        className="absolute right-3 bottom-3 p-1 rounded-md text-gray-400 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      ></button>
    </div>
  );
};

export default ChatInput;
