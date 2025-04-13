import React, { useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
}

const ClearConversations: React.FC<Props> = ({ onClose, onConfirm }) => {
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (document.activeElement === yesButtonRef.current) {
            noButtonRef.current?.focus();
          }
          break;
        case "ArrowRight":
          if (document.activeElement === noButtonRef.current) {
            yesButtonRef.current?.focus();
          }
          break;
        case "Enter":
          if (document.activeElement === noButtonRef.current) {
            onClose();
          } else if (document.activeElement === yesButtonRef.current) {
            onConfirm();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    yesButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onConfirm]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-neutral-900/40 z-2"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-black text-black dark:text-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Clear Conversations</h2>
        <p className="mb-6">Are you sure you want to clear conversations?</p>
        <div className="flex justify-end space-x-4">
          <button
            ref={noButtonRef}
            onClick={onClose}
            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 rounded hover:outline hover:outline-2 hover:outline-black dark:hover:outline-white"
          >
            No
          </button>
          <button
            ref={yesButtonRef}
            onClick={onConfirm}
            className="px-4 py-2 bg-neutral-300 dark:bg-neutral-700 text-black dark:text-white rounded transition-colors duration-200 hover:outline hover:outline-2 hover:outline-black dark:hover:outline-white"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearConversations;