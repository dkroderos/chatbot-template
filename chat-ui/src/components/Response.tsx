import { Check, Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  response: string | undefined;
  error: string | null;
  showCopyButton: boolean;
}

const Response: React.FC<Props> = ({ response, error, showCopyButton }) => {
  const [isCopyingResponse, setIsCopyingResponse] = useState<boolean>(false);

  const handleCopyResponse = () => {
    if (isCopyingResponse) return;

    setIsCopyingResponse(true);
    navigator.clipboard
      .writeText(response || "")
      .then(() => {
        setTimeout(() => {
          setIsCopyingResponse(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy response: ", err);
        setIsCopyingResponse(false);
      });
  };

  return (
    <>
      <div className="group">
        <div className="whitespace-pre-wrap max-w-[80%] break-words prose prose-neutral dark:prose-invert">
          {response ? (
            <ReactMarkdown>{response}</ReactMarkdown>
          ) : !error ? (
            <div className="flex justify-center items-center mx-1">
              <div className="w-4 h-4 rounded-full bg-black dark:bg-white animate-expand-contract" />
            </div>
          ) : null}

          {error && (
            <div className="flex justify-start pt-4">
              <div className="border border-red-500 rounded-md px-4 py-2 text-red-500 bg-red-500/10 w-full">
                {error}
              </div>
            </div>
          )}

          {showCopyButton && (
            <>
              <div
                className="my-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Response;
