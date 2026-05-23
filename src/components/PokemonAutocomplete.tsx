import { useEffect, useRef, useState } from "react";
import type { PokemonSpecies } from "../lib/pokedex";
import { Pokedex } from "../lib/pokedex";
import type { IDEntry } from "../lib/pokedex/misc-types";
import "../styles/PokemonAutocomplete.css";

interface PokemonAutocompleteProps {
  value: IDEntry | undefined;
  onChange: (value: IDEntry) => void;
}

export const PokemonAutocomplete = ({
  value,
  onChange,
}: PokemonAutocompleteProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<
    [string, PokemonSpecies][]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter Pokemon based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOptions([]);
      setIsOpen(false);
      return;
    }

    const filtered = Object.entries<PokemonSpecies>(
      Pokedex as { [s: IDEntry]: PokemonSpecies },
    ).filter(
      ([id, species]) =>
        species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        id.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredOptions(filtered);
    setIsOpen(filtered.length > 0);
  }, [searchTerm]);

  // Set initial search term from value
  useEffect(() => {
    if (value && Pokedex[value]) {
      setSearchTerm(Pokedex[value].name);
    }
  }, [value]);

  const handleSelect = (id: IDEntry) => {
    onChange(id);
    setSearchTerm(Pokedex[id].name);
    setIsOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div ref={containerRef} className="pokemon-autocomplete-container">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a Pokemon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => searchTerm.trim() && setIsOpen(true)}
        onBlur={handleBlur}
        className="pokemon-autocomplete-input"
      />
      {isOpen && filteredOptions.length > 0 && (
        <ul className="pokemon-autocomplete-options">
          {filteredOptions.slice(0, 10).map(([id, species]) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => handleSelect(id as IDEntry)}
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
