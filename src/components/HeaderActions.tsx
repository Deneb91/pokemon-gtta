import { useEffect, useRef, type ChangeEvent } from "react";
import { downloadStateAsFile, importState } from "../lib/storage/storage";
import type { AppState } from "../lib/types";
import { KebabMenu } from "./KebabMenu";
import { formatErrorForUser, hasUserMessage } from "../lib/errors";

interface HeaderActionsProps {
  state: AppState;
  onStatusMessage: (
    message: {
      type: "success" | "error";
      text: string;
    } | null,
  ) => void;
}

export function useImportedState(setState: (s: AppState) => void) {
  useEffect(() => {
    const handleImportState = (event: Event) => {
      if (event instanceof CustomEvent) {
        setState(event.detail);
      }
    };

    window.addEventListener("import-state", handleImportState);
    return () => {
      window.removeEventListener("import-state", handleImportState);
    };
  }, []);
}
export function HeaderActions({ state, onStatusMessage }: HeaderActionsProps) {
  const setErrorStatus = (context: string, error: unknown) => {
    const errorMessage = formatErrorForUser(error);
    onStatusMessage({
      type: "error",
      text: `${context}: ${errorMessage}`,
    });
    // If the error has a user-friendly message, we let the user close it at their pace.
    const autoDismiss = !hasUserMessage(error);
    if (autoDismiss) {
      setTimeout(() => onStatusMessage(null), 5000);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportState = () => {
    try {
      downloadStateAsFile(state);
      onStatusMessage({
        type: "success",
        text: "Game state exported successfully!",
      });
      setTimeout(() => onStatusMessage(null), 3000);
    } catch (error) {
      setErrorStatus("Export failed", error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedState = importState(content);

        // Show confirmation before overwriting
        const confirmed = window.confirm(
          "This will replace your current game state. Are you sure?",
        );
        if (confirmed) {
          // Trigger state update through parent
          window.dispatchEvent(
            new CustomEvent("import-state", { detail: importedState }),
          );
          onStatusMessage({
            type: "success",
            text: "Game state imported successfully!",
          });
          setTimeout(() => onStatusMessage(null), 3000);
        }
      } catch (error) {
        setErrorStatus("Import failed", error);
      }
    };

    reader.onerror = () => {
      setErrorStatus("Failed to read file", new Error("Failed to read file."));
    };

    reader.readAsText(file);

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <KebabMenu>
      <button className="action-btn export-btn" onClick={handleExportState}>
        💾 Export
      </button>
      <button className="action-btn import-btn" onClick={handleImportClick}>
        📂 Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />
    </KebabMenu>
  );
}
