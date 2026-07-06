import Ajv, { type ErrorObject } from "ajv";
import { addXp } from "../pokedex";
import { createTaskRewardPokemon, type Task } from "../tasks";
import type { AppState } from "../types";
import schema from "./schema.generated.json";
import type { SaveFileData } from "./types";
import { useEffect } from "react";

const STORAGE_KEY = "pokemon-gtta-state";
const SAVE_FORMAT_VERSION = "1.0.0";

const saveDataValidator = new Ajv().compile<SaveFileData>(schema);

export const getInitialState = (): AppState => ({
  tasks: [],
  pokemons: [],
  totalTasksCompleted: 0,
});

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
  }, [setState]);
}
function deserializeState(serialized: string): SaveFileData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized);
  } catch (error) {
    throw new InvalidSaveFileError(
      "Failed to parse save file: invalid JSON format.",
      null,
      error,
    );
  }
  const valid = saveDataValidator(parsed);
  if (!valid) {
    throw new InvalidSaveFileError(
      "Invalid save file format.",
      saveDataValidator.errors,
    );
  }
  return parsed as SaveFileData;
}

export const loadState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? deserializeState(stored).state : getInitialState();
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: SAVE_FORMAT_VERSION,
        exportedAt: Date.now(),
        state,
      }),
    );
  } catch (error) {
    console.error("Failed to save state:", error);
  }
};

export const addTask = (state: AppState, task: Task): AppState => {
  return {
    ...state,
    tasks: [...state.tasks, task],
  };
};

export const completeTask = (state: AppState, taskId: string): AppState => {
  const updatedTasks = state.tasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: true, completedAt: Date.now() }
      : task,
  );

  // Add a Pokémon reward for completing a task
  const task = state.tasks.find((t) => t.id === taskId);
  const newPokemons = [...state.pokemons];

  if (task && !task.completed) {
    const newPokemon = createTaskRewardPokemon(task);
    newPokemons.push(newPokemon);
  }

  return {
    ...state,
    tasks: updatedTasks,
    pokemons: newPokemons,
    totalTasksCompleted: state.totalTasksCompleted + 1,
  };
};

export const trainPokemon = (
  state: AppState,
  pokemonId: string,
  experience: number,
): AppState => {
  const updatedPokemons = state.pokemons.map((pokemon) => {
    if (pokemon.id === pokemonId) {
      return addXp(pokemon, experience);
    }
    return pokemon;
  });

  return {
    ...state,
    pokemons: updatedPokemons,
  };
};

export const deleteTask = (state: AppState, taskId: string): AppState => {
  return {
    ...state,
    tasks: state.tasks.filter((task) => task.id !== taskId),
  };
};

export const updatePokemonName = (
  state: AppState,
  pokemonId: string,
  newName: string,
): AppState => {
  const updatedPokemons = state.pokemons.map((pokemon) => {
    if (pokemon.id === pokemonId) {
      return { ...pokemon, name: newName };
    }
    return pokemon;
  });

  return {
    ...state,
    pokemons: updatedPokemons,
  };
};

/**
 * Exports the current state to a JSON object suitable for downloading
 */
export const exportState = (state: AppState): SaveFileData => {
  return {
    version: SAVE_FORMAT_VERSION,
    exportedAt: Date.now(),
    state,
  };
};

/**
 * Imports and validates a state from a JSON object
 * @throws Error if the file format is invalid or incompatible
 */
export const importState = (jsonString: string): AppState => {
  try {
    const data = deserializeState(jsonString);

    // Check version compatibility (warn but don't block)
    if (data.version !== SAVE_FORMAT_VERSION) {
      console.warn(
        `Save file version (${data.version}) does not match app version (${SAVE_FORMAT_VERSION}). There may be compatibility issues.`,
      );
    }

    return data.state;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to parse save file: invalid JSON format.", {
      cause: error,
    });
  }
};

/**
 * Downloads state as a JSON file with a timestamped filename
 */
export const downloadStateAsFile = (state: AppState): void => {
  const data = exportState(state);
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const filename = `pokemon-gtta-save-${date}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Downloads the corrupted save file from localStorage for manual recovery
 * @param storedJsonString - The raw JSON string from localStorage
 */
export const downloadSaveFileForRecovery = (storedJsonString: string): void => {
  const blob = new Blob([storedJsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const filename = `pokemon-gtta-corrupted-save-${date}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export class InvalidSaveFileError extends Error {
  readonly errors: ErrorObject[] | null;
  readonly userMessage: string;
  constructor(
    message: string,
    errors: ErrorObject[] | null = null,
    cause?: unknown,
  ) {
    super(message + (errors?.length ? errors.join(", ") : ""), { cause });
    this.name = "InvalidSaveFileError";
    this.errors = errors;
    this.userMessage = InvalidSaveFileError.formatErrors(
      message,
      errors,
      cause,
    );
  }

  private static formatErrors(
    message: string,
    errors: ErrorObject[] | null = null,
    cause?: unknown,
  ): string {
    let fullMessage = message;
    if (errors && errors.length > 0) {
      fullMessage +=
        " Validation errors: " +
        errors.map((e) => `  ${e.instancePath} ${e.message}`).join(";\n  ");
    }
    if (cause instanceof Error) {
      fullMessage += ` \nCause: ${cause.message}`;
    }

    return fullMessage;
  }
}
