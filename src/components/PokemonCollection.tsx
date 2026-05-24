import { PokemonCard } from "./PokemonCard";
import "../styles/PokemonCollection.css";
import type { Pokemon } from "../lib/pokedex";

interface PokemonCollectionProps {
  pokemons: Pokemon[];
  onTrain: (pokemonId: string) => void;
  onUpdateName: (pokemonId: string, newName: string) => void;
}

export const PokemonCollection = ({
  pokemons,
  onTrain,
  onUpdateName,
}: PokemonCollectionProps) => {
  const getTotalExp = () => {
    return pokemons.reduce((total, p) => total + p.experience, 0);
  };

  return (
    <div className="pokemon-collection-container">
      <div className="collection-header">
        <h2>My Pokémon Collection</h2>
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Total Pokémon:</span>
            <span className="stat-value">{pokemons.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Experience:</span>
            <span className="stat-value">{getTotalExp()}</span>
          </div>
        </div>
      </div>

      {pokemons.length === 0 ? (
        <div className="empty-collection">
          <p>No Pokémon caught yet!</p>
          <p>Complete cleaning tasks to earn Pokémon.</p>
        </div>
      ) : (
        <div className="pokemon-grid">
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onTrain={onTrain}
              onUpdateName={onUpdateName}
            />
          ))}
        </div>
      )}
    </div>
  );
};
