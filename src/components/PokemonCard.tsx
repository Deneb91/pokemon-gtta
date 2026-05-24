import {
  getRequiredXpForNextLevel,
  getTypes,
  getXpForCurrentLevel,
  type Pokemon,
} from "../lib/pokedex";

interface PokemonCardProps {
  pokemon: Pokemon;
  onTrain: (pokemonId: string) => void;
}

const getPokemonEmoji = (name: string): string => {
  const emojiMap: { [key: string]: string } = {
    Bulbasaur: "🌱",
    Charmander: "🔥",
    Squirtle: "💧",
    Pikachu: "⚡",
    Psyduck: "🦆",
    Growlithe: "🐕",
    Oddish: "👽",
    Poliwag: "🐸",
    Abra: "✨",
    Machop: "💪",
  };

  return emojiMap[name] || "👾";
};

export const PokemonCard = ({ pokemon, onTrain }: PokemonCardProps) => {
  const currentLevelExp = getXpForCurrentLevel(pokemon);
  const expToNextLevel = getRequiredXpForNextLevel(pokemon);
  const levelProgress = currentLevelExp / expToNextLevel;
  return (
    <div className="pokemon-card">
      <div className="pokemon-emoji">{getPokemonEmoji(pokemon.name)}</div>
      <div className="pokemon-info">
        <h3>{pokemon.name}</h3>
        <p className="pokemon-type">Type: {getTypes(pokemon).join(" / ")}</p>
        <p className="pokemon-level">Level {pokemon.level}</p>
        <div className="exp-bar">
          <div
            className="exp-fill"
            style={{
              width: `${(levelProgress * 100).toFixed(0)}%`,
            }}
          ></div>
        </div>
        <p className="pokemon-exp">{currentLevelExp} XP</p>
      </div>
      <button onClick={() => onTrain(pokemon.id)} className="train-btn">
        Train (+10 XP)
      </button>
    </div>
  );
};
