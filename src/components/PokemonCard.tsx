import { useState } from "react";
import {
  getRequiredXpForNextLevel,
  getTypes,
  getXpForCurrentLevel,
  type Pokemon,
} from "../lib/pokedex";
import { PokemonSprite } from "./PokemonSprite";

interface PokemonCardProps {
  pokemon: Pokemon;
  onTrain: (pokemonId: string) => void;
  onUpdateName: (pokemonId: string, newName: string) => void;
}

export const PokemonCard = ({
  pokemon,
  onTrain,
  onUpdateName,
}: PokemonCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(pokemon.name);

  const currentLevelExp = getXpForCurrentLevel(pokemon);
  const expToNextLevel = getRequiredXpForNextLevel(pokemon);
  const levelProgress = currentLevelExp / expToNextLevel;

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== pokemon.name) {
      onUpdateName(pokemon.id, editedName.trim());
    } else {
      setEditedName(pokemon.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      setEditedName(pokemon.name);
      setIsEditing(false);
    }
  };
  return (
    <div className="pokemon-card">
      <div className="pokemon-sprite-container">
        <PokemonSprite pokemon={pokemon} />
      </div>
      <div className="pokemon-info">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={handleKeyDown}
            autoFocus
            className="pokemon-name-input"
          />
        ) : (
          <h3
            onClick={() => setIsEditing(true)}
            className="pokemon-name-editable"
          >
            {pokemon.name}
          </h3>
        )}
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
