import { useEffect } from "react";
import "../styles/ErrorRecoveryModal.css";
import { hasUserMessage } from "../lib/types";

interface ErrorRecoveryModalProps {
  isOpen: boolean;
  error: Error | null;
  onDismiss: () => void;
  onDownload: () => void;
}

export function ErrorRecoveryModal({
  isOpen,
  error,
  onDismiss,
  onDownload,
}: ErrorRecoveryModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  const handleDownload = () => {
    onDownload();
    // Auto-dismiss after a short delay to show visual feedback
    setTimeout(onDismiss, 500);
  };

  const errorMessage = hasUserMessage(error)
    ? error.userMessage
    : error?.message || "Unknown error";
  return (
    <div className="error-recovery-overlay" onClick={onDismiss}>
      <div
        className="error-recovery-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="error-recovery-header">
          <h2>Save File Corrupted</h2>
          <button
            className="error-recovery-close"
            onClick={onDismiss}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="error-recovery-body">
          <p className="error-recovery-message">
            We encountered an error while loading your save file:
          </p>
          <div className="error-recovery-details">
            <code>{errorMessage}</code>
          </div>

          <p className="error-recovery-instructions">
            You can download your save file below. Once downloaded, you can try
            to manually fix the JSON and import it back using the Import button.
          </p>
        </div>

        <div className="error-recovery-actions">
          <button
            className="error-recovery-download-btn"
            onClick={handleDownload}
          >
            💾 Download Save File
          </button>
          <button className="error-recovery-dismiss-btn" onClick={onDismiss}>
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
}
