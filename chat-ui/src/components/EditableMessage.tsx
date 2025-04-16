import { PencilOff, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  message: string;
  isSaveEnabled: boolean;
  onCancel: () => void;
  onSave: (newMessage: string) => void;
}

const EditableMessage: React.FC<Props> = ({
  message,
  isSaveEnabled,
  onCancel,
  onSave,
}) => {
  const editMessageTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [newMessage, setNewMessage] = useState<string>(message);

  useEffect(() => {
    if (editMessageTextareaRef.current) {
      editMessageTextareaRef.current.style.height = "auto";
      const newHeight = Math.min(
        editMessageTextareaRef.current.scrollHeight,
        250
      );
      editMessageTextareaRef.current.style.height = `${newHeight}px`;
      editMessageTextareaRef.current.style.overflowY =
        newHeight >= 250 ? "auto" : "hidden";
    }
  }, [newMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="w-full py-3 bg-white dark:bg-black z-1"
      >
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex flex-col gap-2 rounded-xl border border-neutral-700 bg-neutral-100 dark:bg-neutral-900 p-3">
            <textarea
              ref={editMessageTextareaRef}
              rows={1}
              className="w-full resize-none bg-transparent text-black dark:text-white focus:outline-none"
              style={{
                overflow: "hidden",
                maxHeight: "250px",
                scrollbarWidth: "thin",
                scrollbarColor: "#888 transparent",
              }}
              value={newMessage}
              onChange={handleChange}
            />

            <div className="flex justify-between items-center p-1">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                title="Cancel"
              >
                <PencilOff size={20} className="text-black dark:text-white" />
              </button>
              <button
                type="button"
                onClick={() => onSave(newMessage.trim())}
                disabled={!isSaveEnabled || !newMessage.trim()}
                className="rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-800 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                title="Save"
              >
                <Save size={20} className="text-black dark:text-white" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditableMessage;
