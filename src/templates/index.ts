import type { StationTemplate } from "./types";
import { wtvj } from "./wtvj";
import { wscv } from "./wscv";
import { knsd } from "./knsd";
import { wnbc } from "./wnbc";
import { nbcGeneric } from "./nbc-generic";
import { telemundoGeneric } from "./telemundo-generic";

// Registry of all station templates. To add a station: create a
// `src/templates/<station-id>.ts` config (+ a logo in /public/logos), import it
// here, and add it to this array. No renderer changes required.
export const STATIONS: StationTemplate[] = [
  wtvj,
  wscv,
  knsd,
  wnbc,
  nbcGeneric,
  telemundoGeneric,
];

export function getStation(id: string): StationTemplate | undefined {
  return STATIONS.find((s) => s.id === id);
}

export * from "./types";
