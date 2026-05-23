// Data types for the Pokémon tidy-up SPA

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  reward?: string; // Pokémon type earned on completion
  createdAt: number;
  completedAt?: number;
}

export interface Pokemon {
  id: string;
  name: string;
  type: string;
  level: number;
  experience: number;
  imageUrl?: string;
  capturedAt: number;
}

export interface AppState {
  tasks: Task[];
  pokemons: Pokemon[];
  totalTasksCompleted: number;
}

export const POKEMON_TYPES = [
  "Bulbasaur",
  "Charmander",
  "Squirtle",
  "Pikachu",
  "Psyduck",
  "Growlithe",
  "Oddish",
  "Poliwag",
  "Abra",
  "Machop",
];
