"use client";

import { STATIONS } from "@/templates";

interface StationPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export default function StationPicker({ value, onChange }: StationPickerProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-neutral-300">
        Station
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        {STATIONS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </label>
  );
}
