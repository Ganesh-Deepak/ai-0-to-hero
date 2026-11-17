export function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
