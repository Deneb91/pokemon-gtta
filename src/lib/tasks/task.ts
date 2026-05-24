import {
  createPokemon,
  getSpeciesByName,
  type PokemonSpecies,
} from "../pokedex";
import type { IDEntry } from "../pokedex/misc-types";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  reward: IDEntry; // Pokémon type earned on completion
  createdAt: number;
  completedAt?: number;
}

export function getSpeciesForTask(task: Task): PokemonSpecies {
  return getSpeciesByName(task.reward);
}

export function createTaskRewardPokemon(task: Task) {
  return createPokemon({ species: task.reward });
}
