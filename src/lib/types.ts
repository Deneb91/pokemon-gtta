// Data types for the Pokémon tidy-up SPA

import type { Pokemon } from "./pokedex";
import type { Task } from "./tasks";

export interface AppState {
  tasks: Task[];
  pokemons: Pokemon[];
  totalTasksCompleted: number;
}
