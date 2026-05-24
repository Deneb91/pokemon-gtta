export function EnglishNameToId(name: string): string {
  return name
    .replaceAll(/[' ._:-]/g, "")
    .replaceAll(/[éèê]/g, "e")
    .replaceAll("♂", "m")
    .replaceAll("♀", "f")
    .toLowerCase();
}
