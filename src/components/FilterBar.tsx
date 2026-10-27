"use client";

import type { Role } from "@/data/projects";
import { ROLES } from "@/data/projects";
import { cn } from "@/lib/utils";

type FilterBarProps = {
  role: Role | "ALL";
  onRoleChange: (value: Role | "ALL") => void;
};

export function FilterBar({ role, onRoleChange }: FilterBarProps) {
  return (
    <div className="grid gap-4 border-y border-black/10 py-5 md:grid-cols-[0.5fr_1fr]">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">All Work / Filter Archive</p>
      <div className="space-y-3">
        <FilterGroup
          label="Role"
          values={["ALL", ...ROLES]}
          active={role}
          onChange={(value) => onRoleChange(value as Role | "ALL")}
        />
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  values,
  active,
  onChange,
}: {
  label: string;
  values: readonly string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="mr-3 inline font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500">{label}</legend>
      {values.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={active === value}
          onClick={() => onChange(value)}
          className={cn(
            "border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]",
            active === value
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-black/10 text-neutral-600 hover:border-black/35 hover:text-neutral-950",
          )}
        >
          {value === "ALL" ? "All Work" : value}
        </button>
      ))}
    </fieldset>
  );
}
