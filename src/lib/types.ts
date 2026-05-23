// Data types for the Pokémon tidy-up SPA

import type { PokemonSpecies } from "./pokedex/pokemon-species";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  reward: PokemonSpecies; // Pokémon type earned on completion
  createdAt: number;
  completedAt?: number;
}

export interface Pokemon {
  id: string;
  name: string;
  level: number;
  experience: number;
  capturedAt: number;
  species: PokemonSpecies;
}

export interface AppState {
  tasks: Task[];
  pokemons: Pokemon[];
  totalTasksCompleted: number;
}
