import { Check, Copy, Pencil } from "lucide-react";
import { useState } from "react";

interface Props {
  message: string;
  showPencilButton: boolean;
  onPencilClick: () => void;
}

const Message: React.FC<Props> = ({
  message,
  showPencilButton,
  onPencilClick,
}) => {
  const [isCopyingMessage, setIsCopyingMessage] = useState<boolean>(false);

  const handleCopyMessage = () => {
    if (isCopyingMessage) return;

    setIsCopyingMessage(true);
    navigator.clipboard
      .writeText(message)
      .then(() => {
        setTimeout(() => {
          setIsCopyingMessage(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy message: ", err);
        setIsCopyingMessage(false);
      });
  };

  return (
    <>
      <div className="group">
        <div className="flex justify-end">
          <div className="whitespace-pre-wrap px-5 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white max-w-[80%] break-words">
            {message}
          </div>
        </div>

        <div className="flex justify-end my-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <div title="Copy message">
            {isCopyingMessage ? (
              <Check className="h-4 w-4 text-neutral-500 dark:text-neutral-200" />
            ) : (
              <Copy
                className="h-4 w-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                onClick={() => handleCopyMessage()}
              />
            )}
          </div>

          <div title="Edit message">
            {showPencilButton && (
              <Pencil
                className="ml-2 h-4 w-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
                onClick={onPencilClick}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
