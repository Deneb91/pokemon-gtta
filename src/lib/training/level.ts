import { type XpCurve } from "./xp-curves";

export function computeLevelFromXp(xp: number, xpCurveName: XpCurve): number {
  return xpCurveName.findIndex((xpThreshold) => xp < xpThreshold) ?? 100;
}
