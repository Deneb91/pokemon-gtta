import { useEffect, useRef, type ChangeEvent } from "react";
import { downloadStateAsFile, importState } from "../lib/storage";
import type { AppState } from "../lib/types";
import { KebabMenu } from "./KebabMenu";

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
      onStatusMessage({
        type: "error",
        text: `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      setTimeout(() => onStatusMessage(null), 5000);
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
        onStatusMessage({
          type: "error",
          text: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
        setTimeout(() => onStatusMessage(null), 5000);
      }
    };

    reader.onerror = () => {
      onStatusMessage({
        type: "error",
        text: "Failed to read file.",
      });
      setTimeout(() => onStatusMessage(null), 5000);
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
