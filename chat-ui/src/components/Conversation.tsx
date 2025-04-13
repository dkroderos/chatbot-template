import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ConversationModel } from "../models";

interface Props {
  conversation: ConversationModel;
  isLastIndex: boolean;
  screenHeight: number;
  isBusy: boolean;
}

const Conversation: React.FC<Props> = ({
  conversation,
  isLastIndex,
  screenHeight,
  isBusy,
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
      .writeText(conversation.response)
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
        <div className="flex justify-end my-4 group-hover:visible invisible">
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
          <ReactMarkdown>{conversation.response}</ReactMarkdown>
          {!isBusy && (
            <div
              className={`mt-4 ${
                isLastIndex ? "visible" : "group-hover:visible invisible"
              }`}
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
