import {
  isCosmeticFormeData,
  type CosmeticFormeData,
  type SpeciesData,
} from "./dex-species";
import type {
  StatsTable,
  ID,
  GenderName,
  TierTypes,
  Nonstandard,
} from "./misc-types";
import { Pokedex } from "./pokedex";

export class PokemonSpecies {
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

  constructor(base: SpeciesData | CosmeticFormeData) {
    if (isCosmeticFormeData(base)) {
      Object.assign(this, Pokedex[base.baseSpecies]);
    }
    Object.assign(this, base);
  }
}
