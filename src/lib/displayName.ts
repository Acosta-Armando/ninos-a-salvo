export function getDisplayName(
  fullname: string | null | undefined,
  id: string,
): string {
  if (fullname?.trim()) {
    return fullname.trim();
  }
  const suffix = id.replace(/-/g, "").slice(-4).toUpperCase();
  return `Niño desconocido #${suffix}`;
}
