
export function separationFactor(separation: number, firstObjectAngularSize: number, secondObjectAngluarSize?: number): number {
  const averageAngularSize = secondObjectAngluarSize ? (firstObjectAngularSize + secondObjectAngluarSize) / 2 : firstObjectAngularSize;
  return separation / averageAngularSize;
}