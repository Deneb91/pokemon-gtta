// Data types for the Pokémon tidy-up SPA

import type { Pokemon } from "./pokedex";
import type { Task } from "./tasks";

export interface AppState {
  tasks: Task[];
  pokemons: Pokemon[];
  totalTasksCompleted: number;
}

/**
 * Base interface for objects that include a user-friendly message, typically used for errors or status updates.
 */
export interface HasUserMessage {
  userMessage: string;
}

export function hasUserMessage(obj: any): obj is HasUserMessage {
  return obj && typeof obj.userMessage === "string";
}
