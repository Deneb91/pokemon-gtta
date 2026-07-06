export type IDEntry = string;
export type ID = string;
export interface EventInfo {
  generation: number;
  level?: number;
  /** true: always shiny, 1: sometimes shiny, false | undefined: never shiny */
  shiny?: boolean | 1;
  gender?: GenderName;
  nature?: string;
  ivs?: SparseStatsTable;
  perfectIVs?: number;
  /** true: has hidden ability, false | undefined: never has hidden ability */
  isHidden?: boolean;
  abilities?: IDEntry[];
  maxEggMoves?: number;
  moves?: IDEntry[];
  pokeball?: IDEntry;
  from?: string;
  /** Japan-only events can't be transferred to international games in Gen 1 */
  japan?: boolean;
  /** For Emerald event eggs to allow Pomeg glitched moves */
  emeraldEventEgg?: boolean;
  source?: string;
}
export type GenderName = "M" | "F" | "N" | "";
export type SparseStatsTable = Partial<StatsTable>;
export type StatsTable = { [stat in StatID]: number };
export type StatIDExceptHP = "atk" | "def" | "spa" | "spd" | "spe";
export type StatID = "hp" | StatIDExceptHP;
// eslint-disable-next-line  @typescript-eslint/no-namespace
export namespace TierTypes {
  export type Singles =
    | "AG"
    | "Uber"
    | "(Uber)"
    | "OU"
    | "(OU)"
    | "UUBL"
    | "UU"
    | "RUBL"
    | "RU"
    | "NUBL"
    | "NU"
    | "(NU)"
    | "PUBL"
    | "PU"
    | "(PU)"
    | "ZUBL"
    | "ZU"
    | "NFE"
    | "LC";
  export type Doubles =
    | "DUber"
    | "(DUber)"
    | "DOU"
    | "(DOU)"
    | "DBL"
    | "DUU"
    | "(DUU)"
    | "NFE"
    | "LC";
  export type Other = "Unreleased" | "Illegal" | "CAP" | "CAP NFE" | "CAP LC";
}

export interface EventInfo {
  generation: number;
  level?: number;
  /** true: always shiny, 1: sometimes shiny, false | undefined: never shiny */
  shiny?: boolean | 1;
  gender?: GenderName;
  nature?: string;
  ivs?: SparseStatsTable;
  perfectIVs?: number;
  /** true: has hidden ability, false | undefined: never has hidden ability */
  isHidden?: boolean;
  abilities?: IDEntry[];
  maxEggMoves?: number;
  moves?: IDEntry[];
  pokeball?: IDEntry;
  from?: string;
  /** Japan-only events can't be transferred to international games in Gen 1 */
  japan?: boolean;
  /** For Emerald event eggs to allow Pomeg glitched moves */
  emeraldEventEgg?: boolean;
  source?: string;
}

export type Nonstandard =
  | "Past"
  | "Future"
  | "Unobtainable"
  | "CAP"
  | "LGPE"
  | "Custom"
  | "Gigantamax";

export type EffectType =
  | "Condition"
  | "Pokemon"
  | "Move"
  | "Item"
  | "Ability"
  | "Format"
  | "Nature"
  | "Ruleset"
  | "Weather"
  | "Status"
  | "Terrain"
  | "Rule"
  | "ValidatorRule";

export interface EffectData {
  name?: string;
  desc?: string;
  duration?: number;
  effectType?: string;
  infiltrates?: boolean;
  isNonstandard?: Nonstandard | null;
  shortDesc?: string;
}
export interface BasicEffect extends EffectData {
  id: ID;
  effectType: EffectType;
  exists: boolean;
  fullname: string;
  gen: number;
  sourceEffect: string;
  toString: () => string;
}
