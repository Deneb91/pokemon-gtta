import { addXp } from "./pokedex";
import { createTaskRewardPokemon, type Task } from "./tasks";
import type { AppState } from "./types";

const STORAGE_KEY = "pokemon-gtta-state";
const APP_VERSION = "1.0.0";

export interface SaveFileData {
  version: string;
  exportedAt: number;
  state: AppState;
}

export const getInitialState = (): AppState => ({
  tasks: [],
  pokemons: [],
  totalTasksCompleted: 0,
});

function deserializeState(serialized: string): AppState {
  return JSON.parse(serialized);
}
export const loadState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? deserializeState(stored) : getInitialState();
  } catch {
    return getInitialState();
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
    version: APP_VERSION,
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
    const parsed: unknown = JSON.parse(jsonString);

    // Validate structure
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("version" in parsed) ||
      !parsed.version ||
      !("state" in parsed)
    ) {
      throw new Error(
        "Invalid save file format. Missing version or state property.",
      );
    }

    const data = parsed as SaveFileData;

    // Validate state structure
    if (
      !data.state ||
      typeof data.state !== "object" ||
      !Array.isArray((data.state as any).tasks) ||
      !Array.isArray((data.state as any).pokemons) ||
      typeof (data.state as any).totalTasksCompleted !== "number"
    ) {
      throw new Error(
        "Invalid save file: state does not have the correct structure.",
      );
    }

    // Check version compatibility (warn but don't block)
    if (data.version !== APP_VERSION) {
      console.warn(
        `Save file version (${data.version}) does not match app version (${APP_VERSION}). There may be compatibility issues.`,
      );
    }

    return data.state;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to parse save file: invalid JSON format.");
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
