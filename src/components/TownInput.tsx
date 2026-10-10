"use client";

interface Props {
  value: string;
  onChange: (town: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

/** Town is free text in the schema, so this is a plain input. (Typos and spelling variants are a known 50-towns weakness.) */
export function TownInput({ value, onChange, label = "Town", required, placeholder = "e.g. Mamelodi" }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} maxLength={60}
        placeholder={placeholder} autoComplete="off" />
    </label>
  );
}
