import type { StationTemplate } from "./types";
import { nbcGeneric } from "./nbc-generic";
import { telemundoGeneric } from "./telemundo-generic";

// Registry of all station templates. To add a station: create a
// `src/templates/<station-id>.ts` config (+ a logo in /public/logos), import it
// here, and add it to this array. No renderer changes required.
export const STATIONS: StationTemplate[] = [nbcGeneric, telemundoGeneric];

export function getStation(id: string): StationTemplate | undefined {
  return STATIONS.find((s) => s.id === id);
}

export * from "./types";
