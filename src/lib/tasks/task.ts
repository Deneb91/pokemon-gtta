import {
  createPokemon,
  Pokedex,
  type PokemonSpecies,
  type SpeciesId,
} from "../pokedex";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  reward: SpeciesId; // Pokémon type earned on completion
  createdAt: number;
  completedAt?: number;
}

export function getSpeciesForTask(task: Task): PokemonSpecies {
  return Pokedex.get(task.reward);
}

export function createTaskRewardPokemon(task: Task) {
  return createPokemon({ species: task.reward });
}
