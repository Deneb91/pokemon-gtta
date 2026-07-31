import { useState } from "react";
import { formatErrorForUser } from "../lib/errors";
import "../styles/ErrorRecoveryModal.css";

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
  const [hasDownloaded, setHasDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    onDownload();
    setHasDownloaded(true);
  };

  const errorMessage = formatErrorForUser(error);
  return (
    <div className="error-recovery-overlay" onClick={onDismiss}>
      <div
        className="error-recovery-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="error-recovery-header">
          <h2>Save File Corrupted</h2>
        </div>

        <div className="error-recovery-body">
          <p className="error-recovery-message">
            We encountered an error while loading your save file:
          </p>
          <div className="error-recovery-details">
            <code>{errorMessage}</code>
          </div>

          <p className="error-recovery-instructions">
            Do not panic! Your data is likely still intact. You can try to
            recover it by downloading the save file, fixing the issue manually,
            and re-importing it.
            <br />
            If you're not sure how to fix it, feel free to reach out with the
            error details and the file.
          </p>
        </div>

        <div className="error-recovery-actions">
          <button
            className="error-recovery-download-btn"
            onClick={handleDownload}
          >
            💾 {hasDownloaded ? "Redownload" : "Download"} Save File
          </button>
          <button
            className={`error-recovery-dismiss-btn${hasDownloaded ? " error-recovery-dismiss-btn--safe" : ""}`}
            onClick={onDismiss}
          >
            Start Fresh{hasDownloaded ? "" : " ( ⚠️ Data will be lost if you didn't download it )"}
          </button>
        </div>
      </div>
    </div>
  );
}
