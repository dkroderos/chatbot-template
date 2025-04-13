import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ConversationModel } from "../models";

interface Props {
  conversation: ConversationModel;
  isLastIndex: boolean;
  screenHeight: number;
  isBusy: boolean;
  error: string | null;
}

const Conversation: React.FC<Props> = ({
  conversation,
  isLastIndex,
  screenHeight,
  isBusy,
  error,
}) => {
  const [isCopyingMessage, setIsCopyingMessage] = useState<boolean>(false);
  const [isCopyingResponse, setIsCopyingResponse] = useState<boolean>(false);

  const handleCopyMessage = () => {
    if (isCopyingMessage || isBusy) return;

    setIsCopyingMessage(true);
    navigator.clipboard
      .writeText(conversation.message)
      .then(() => {
        setTimeout(() => {
          setIsCopyingMessage(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setIsCopyingMessage(false);
      });
  };

  const handleCopyResponse = () => {
    if (isCopyingMessage || isBusy) return;

    setIsCopyingResponse(true);
    navigator.clipboard
      .writeText(conversation.response || "")
      .then(() => {
        setTimeout(() => {
          setIsCopyingResponse(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        setIsCopyingResponse(false);
      });
  };

  return (
    <>
      <div className="group">
        <div className="flex justify-end">
          <div className="whitespace-pre-wrap px-5 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white max-w-[80%] break-words">
            {conversation.message}
          </div>
        </div>
        <div
          className={`flex justify-end my-4 transition-opacity duration-300 ${
            isCopyingMessage ? "opacity-100" : "opacity-0"
          } group-hover:opacity-100`}
          title="Copy message"
        >
          {isCopyingMessage ? (
            <Check className="h-4 w-4 text-neutral-500 dark:text-neutral-200" />
          ) : (
            <Copy
              className="h-4 w-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
              onClick={() => handleCopyMessage()}
            />
          )}
        </div>
      </div>

      <div
        className="flex justify-start group"
        style={{
          minHeight: isLastIndex ? `${screenHeight * 0.75}px` : "auto",
        }}
      >
        <div className="whitespace-pre-wrap max-w-[80%] break-words prose prose-neutral dark:prose-invert">
          {conversation?.response ? (
            <ReactMarkdown>{conversation.response}</ReactMarkdown>
          ) : !error ? (
            <div className="flex justify-center items-center mx-1">
              <div className="w-4 h-4 rounded-full bg-black dark:bg-white animate-expand-contract" />
            </div>
          ) : null}
          {error && isLastIndex && (
            <div className="flex justify-start pt-4">
              <div className="border border-red-500 rounded-md px-4 py-2 text-red-500 bg-red-500/10 w-full">
                {error}
              </div>
            </div>
          )}

          {!isBusy && (
            <div
              className={`mt-4 transition-opacity duration-300 ${
                isLastIndex || isBusy ? "opacity-100" : "opacity-0"
              } group-hover:opacity-100`}
              title="Copy response"
            >
              {isCopyingResponse ? (
                <Check className="h-4 w-4 text-neutral-500 dark:text-neutral-200" />
              ) : (
                <Copy
                  className="h-4 w-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                  onClick={handleCopyResponse}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Conversation;
