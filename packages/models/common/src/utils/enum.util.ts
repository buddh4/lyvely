export function getNumberEnumValues(obj: any): number[] {
  return Object.keys(obj)
    .filter((value) => isNaN(Number(value)) === false)
    .map((key) => parseInt(key));
}

export function getNumberEnumKeys(obj: any): string[] {
  return Object.values(obj).filter((value) => typeof value === 'string') as string[];
}

export function getStringEnumValues(obj: any): string[] {
  return Object.values(obj).filter((value) => typeof value === 'string') as string[];
}

export function getStringEnumKeys(obj: any): string[] {
  return Object.keys(obj).filter((value) => typeof value === 'string') as string[];
}
