import type { AppState } from "../types";

export interface SaveFileData {
  /**
   * Version of the save file format. This can be used to handle migrations in future updates.
   */
  version: string;
  exportedAt: number;
  state: AppState;
}
