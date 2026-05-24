import { XPCurves, type XpCurve, type XpCurveName } from "../training";
import { isCosmeticFormeData } from "./dex-species";
import type {
  GenderName,
  ID,
  Nonstandard,
  StatsTable,
  TierTypes,
} from "./misc-types";
import { Pokedex } from "./pokedex";

export interface PokemonSpecies {
  types: string[];
  name: string;
  num: number;
  baseStats: StatsTable;
  eggGroups: string[];
  weightkg: number;
  effectType?: "Pokemon" | undefined;
  id?: ID | undefined;
  baseSpecies: string;
  forme?: string | undefined;
  baseForme?: string | undefined;
  cosmeticFormes?: string[] | undefined;
  otherFormes?: string[] | undefined;
  formeOrder?: string[] | undefined;
  spriteid?: string | undefined;
  addedType?: string | undefined;
  prevo?: string | undefined;
  evos?: string[] | undefined;
  evoType?:
    | "trade"
    | "useItem"
    | "levelMove"
    | "levelExtra"
    | "levelFriendship"
    | "levelHold"
    | "other"
    | undefined;
  evoCondition?: string | undefined;
  evoItem?: string | undefined;
  evoMove?: string | undefined;
  evoRegion?: "Alola" | "Galar" | undefined;
  evoLevel?: number | undefined;
  nfe?: boolean | undefined;
  canHatch?: boolean | undefined;
  isCosmeticForme: boolean;
  gender?: GenderName | undefined;
  genderRatio?: { M: number; F: number } | undefined;
  maxHP?: number | undefined;
  bst?: number | undefined;
  weighthg?: number | undefined;
  heightm?: number | undefined;
  tags?:
    | (
        | "Mythical"
        | "Restricted Legendary"
        | "Sub-Legendary"
        | "Ultra Beast"
        | "Paradox"
      )[]
    | undefined;
  unreleasedHidden?: boolean | "Past" | undefined;
  maleOnlyHidden?: boolean | undefined;
  mother?: string | undefined;
  isMega?: boolean | undefined;
  isPrimal?: boolean | undefined;
  canGigantamax?: string | undefined;
  gmaxUnreleased?: boolean | undefined;
  cannotDynamax?: boolean | undefined;
  requiredTeraType?: string | undefined;
  battleOnly?: string | string[] | undefined;
  requiredItem?: string | undefined;
  requiredMove?: string | undefined;
  requiredAbility?: string | undefined;
  requiredItems?: string[] | undefined;
  changesFrom?: string | undefined;
  pokemonGoData?: string[] | undefined;
  tier?: TierTypes.Other | TierTypes.Singles | undefined;
  doublesTier?: TierTypes.Doubles | TierTypes.Other | undefined;
  natDexTier?: TierTypes.Other | TierTypes.Singles | undefined;
  exists?: boolean | undefined;
  fullname?: string | undefined;
  gen?: number | undefined;
  sourceEffect?: string | undefined;
  toString?: (() => string) | undefined;
  desc?: string | undefined;
  duration?: number | undefined;
  infiltrates?: boolean | undefined;
  isNonstandard?: Nonstandard | null | undefined;
  shortDesc?: string | undefined;
  color: string;
  xpCurveName: XpCurveName;
}

const SPECIES_CACHE: Record<string, PokemonSpecies> = {};
export function getSpeciesByName(speciesName: string): PokemonSpecies {
  if (!SPECIES_CACHE[speciesName]) {
    const base = Pokedex[speciesName];
    const newSpecies = {} as Partial<PokemonSpecies>;
    if (isCosmeticFormeData(base)) {
      Object.assign(newSpecies, Pokedex[base.baseSpecies]);
    }
    Object.assign(newSpecies, base);
    SPECIES_CACHE[speciesName] = newSpecies as PokemonSpecies;
  }
  return SPECIES_CACHE[speciesName];
}

export function getXpCurve(species: PokemonSpecies): XpCurve {
  return XPCurves[species.xpCurveName];
}

export function getExpectedLevelForXp(
  species: PokemonSpecies,
  xp: number,
): number {
  return (
    getXpCurve(species).findIndex((xpThreshold) => xp < xpThreshold) ?? 100
  );
}

export function getTotalXpForLevel(
  species: PokemonSpecies,
  level: number,
): number {
  return getXpCurve(species)[level - 1] ?? 0;
}

export function getXpForNextLevel(
  species: PokemonSpecies,
  currentLevel: number,
): number {
  return (
    getTotalXpForLevel(species, currentLevel + 1) -
    getTotalXpForLevel(species, currentLevel)
  );
}
