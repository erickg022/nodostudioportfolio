"use client";

import { m } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Project, Role } from "@/data/projects";
import { ROLES } from "@/data/projects";
import { FilterBar } from "@/components/FilterBar";
import { WorkGrid } from "@/components/WorkGrid";

function readRole(value: string | null): Role | "ALL" {
  return ROLES.includes(value as Role) ? (value as Role) : "ALL";
}

export function WorkIndex({ projects, hrefBase = "/work" }: { projects: Project[]; hrefBase?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const role = readRole(searchParams.get("role"));

  const updateRole = (value: Role | "ALL") => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("discipline");
    params.delete("q");
    if (value === "ALL") params.delete("role");
    else params.set("role", value);
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const filtered = useMemo(
    () => projects.filter((project) => role === "ALL" || project.roles.includes(role)),
    [projects, role],
  );

  return (
    <section id="work-index" className="px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-neutral-500">Work Index</p>
            <h1 className="mt-3 text-6xl uppercase leading-none text-neutral-950 sm:text-8xl">Work</h1>
          </div>
        </div>
        <FilterBar role={role} onRoleChange={updateRole} />
        <m.div layout className="mt-10">
          {filtered.length ? (
            <WorkGrid projects={filtered} hrefBase={hrefBase} />
          ) : (
            <div className="border border-black/10 px-6 py-20 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">No matching archive entries</p>
              <p className="mt-3 text-xl text-neutral-900">Try clearing the role filter.</p>
            </div>
          )}
        </m.div>
      </div>
    </section>
  );
}
