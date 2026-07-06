import { Pokedex } from "./pokedex";
import {
  getExpectedLevelForXp,
  getTotalXpForLevel,
  type PokemonSpecies,
  type SpeciesId,
} from "./pokemon-species";

import { v4 as uuid } from "uuid";

export interface Pokemon {
  id: string;
  name: string;
  level: number;
  experience: number;
  capturedAt: number;
  species: SpeciesId;
}
export interface NewPokemon extends Partial<Pokemon> {
  species: SpeciesId;
}
export function createPokemon(newPokemon: NewPokemon): Pokemon {
  const species = Pokedex.get(newPokemon.species);
  if (!species) {
    throw new PokemonSpeciesNotFoundError(newPokemon);
  }
  return {
    id: uuid(),
    name: species.name,
    level: 1,
    experience: 0,
    capturedAt: Date.now(),
    ...newPokemon,
  };
}
export function getSpecies(pokemon: Pokemon): PokemonSpecies {
  return Pokedex.get(pokemon.species);
}

export function getExpectedLevel(pokemon: Pokemon): number {
  return getExpectedLevelForXp(getSpecies(pokemon), pokemon.experience);
}

export function getXpForCurrentLevel(pokemon: Pokemon): number {
  return (
    pokemon.experience - getTotalXpForLevel(getSpecies(pokemon), pokemon.level)
  );
}

export function getRequiredXpForNextLevel(pokemon: Pokemon): number {
  return (
    getTotalXpForLevel(getSpecies(pokemon), pokemon.level + 1) -
    getTotalXpForLevel(getSpecies(pokemon), pokemon.level)
  );
}

export function addXp(pokemon: Pokemon, xpGained: number): Pokemon {
  const newExp = pokemon.experience + xpGained;
  const newLevel = getExpectedLevelForXp(getSpecies(pokemon), newExp);
  return {
    ...pokemon,
    experience: newExp,
    level: newLevel,
  };
}

export function getTypes(pokemon: Pokemon): string[] {
  return getSpecies(pokemon).types;
}

export class PokemonCreationError extends Error {
  readonly creationData;
  constructor(creationData: NewPokemon, message: string) {
    super(message);
    this.name = "PokemonCreationError";
    this.creationData = creationData;
  }
}

export class PokemonSpeciesNotFoundError extends PokemonCreationError {
  constructor(creationData: NewPokemon) {
    super(creationData, `Species not found: ${creationData.species}`);
  }
}
