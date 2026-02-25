export type LocationFilter = "all" | "domestic" | "international";

const US_STATES = new Set([
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
]);

/**
 * Extracts country from a location string like "Tokyo, Japan" or "Denver, CO".
 * US state abbreviations are mapped to "United States".
 */
export function extractCountry(location: string): string {
  const parts = location.split(",").map((s) => s.trim());
  if (parts.length < 2) return location.trim();
  const last = parts[parts.length - 1];
  if (US_STATES.has(last.toUpperCase())) return "United States";
  return last;
}

/**
 * Returns true if the profile should be shown given the filter.
 */
export function matchesLocationFilter(
  profileCountry: string,
  userCountry: string,
  filter: LocationFilter,
): boolean {
  if (filter === "all") return true;
  const same = profileCountry.toLowerCase() === userCountry.toLowerCase();
  return filter === "domestic" ? same : !same;
}
