import type { Pokemon } from '../lib/types';
import '../styles/PokemonCollection.css';

interface PokemonCollectionProps {
  pokemons: Pokemon[];
  onTrain: (pokemonId: string) => void;
}

export const PokemonCollection = ({
  pokemons,
  onTrain,
}: PokemonCollectionProps) => {
  const getTotalExp = () => {
    return pokemons.reduce((total, p) => total + p.experience, 0);
  };

  const getPokemonEmoji = (name: string): string => {
    const emojiMap: { [key: string]: string } = {
      Bulbasaur: '🌱',
      Charmander: '🔥',
      Squirtle: '💧',
      Pikachu: '⚡',
      Psyduck: '🦆',
      Growlithe: '🐕',
      Oddish: '👽',
      Poliwag: '🐸',
      Abra: '✨',
      Machop: '💪',
    };
    return emojiMap[name] || '👾';
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
            <div key={pokemon.id} className="pokemon-card">
              <div className="pokemon-emoji">
                {getPokemonEmoji(pokemon.name)}
              </div>
              <div className="pokemon-info">
                <h3>{pokemon.name}</h3>
                <p className="pokemon-type">Type: {pokemon.type}</p>
                <p className="pokemon-level">Level {pokemon.level}</p>
                <div className="exp-bar">
                  <div
                    className="exp-fill"
                    style={{
                      width: `${((pokemon.experience % 100) / 100) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="pokemon-exp">{pokemon.experience} XP</p>
              </div>
              <button
                onClick={() => onTrain(pokemon.id)}
                className="train-btn"
              >
                Train (+10 XP)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
