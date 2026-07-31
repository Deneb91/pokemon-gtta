import { useRef, useState } from "react";
import { Pokedex, type PokemonSpecies, type SpeciesId } from "../lib/pokedex";
import "../styles/PokemonAutocomplete.css";

interface PokemonAutocompleteProps {
  value: SpeciesId | undefined;
  onChange: (value: SpeciesId) => void;
}

export const PokemonAutocomplete = ({
  value,
  onChange,
}: PokemonAutocompleteProps) => {
  const [searchTerm, setSearchTerm] = useState(
    (value && Pokedex.get(value)?.name) ?? "",
  );
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = searchTerm
    ? Array.from(
        Pokedex.filter(
          (species) =>
            species.name.toLowerCase().includes(searchTerm) ||
            species.id.toLowerCase().includes(searchTerm),
        ),
      )
    : [];
  const isOpen = hasFocus && filteredOptions.length > 1;
  if (!value && filteredOptions.length === 1) {
    onChange(filteredOptions[0].id);
  }
  const handleSelect = (species: PokemonSpecies) => {
    onChange(species.id);
    setSearchTerm(species.name);
  };

  const handleBlur = () => {
    setTimeout(() => setHasFocus(false), 300);
  };

  return (
    <div ref={containerRef} className="pokemon-autocomplete-container">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a Pokemon..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value.toLocaleLowerCase().trim())
        }
        onFocus={() => setHasFocus(true)}
        onBlur={handleBlur}
        className="pokemon-autocomplete-input"
      />
      {isOpen && (
        <ul className="pokemon-autocomplete-options">
          {filteredOptions.slice(0, 10).map((species) => (
            <li key={species.id}>
              <button
                type="button"
                onClick={() => handleSelect(species)}
                className="pokemon-option-btn"
              >
                {species.name}
              </button>
            </li>
          ))}
          {filteredOptions.length > 10 && (
            <li className="pokemon-option-more">
              +{filteredOptions.length - 10} more...
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
