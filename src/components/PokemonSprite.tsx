import type { Pokemon } from "../lib/pokedex";

export interface PokemonSpriteProps {
  pokemon: Pokemon;
}

export const PokemonSprite = ({ pokemon }: PokemonSpriteProps) => {
  const pokemonName = pokemon.name;
  const pokemonSpecies = pokemon.species;
  const spriteUrl = `https://play.pokemonshowdown.com/sprites/ani/${pokemonSpecies}.gif`;

  return (
    <img
      src={spriteUrl}
      alt={pokemonName}
      className="pokemon-sprite"
      onError={(e) => {
        // Fallback if sprite fails to load
        const img = e.target as HTMLImageElement;
        img.style.display = "none";
      }}
    />
  );
};
