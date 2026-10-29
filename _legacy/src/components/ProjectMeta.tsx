import type { Project } from "@/data/projects";

const rowClass = "border-t border-black/10 py-4";

export function ProjectMeta({ project }: { project: Project }) {
  return (
    <aside className="sticky top-20 hidden self-start border-b border-black/10 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600 lg:block">
      <MetaRow label="Role" values={project.roles} />
      <MetaRow label="Collaborators" values={project.collaborationCredits} />
      <MetaRow label="Deliverables" values={project.deliverables} />
      <MetaRow label="Tools / Methods" values={project.toolsMethods} />
    </aside>
  );
}

export function ProjectMetaMobile({ project }: { project: Project }) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:hidden">
      <div className="grid gap-4 border-b border-black/10 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600 sm:grid-cols-2">
        <MetaRow label="Role" values={project.roles} />
        <MetaRow label="Collaborators" values={project.collaborationCredits} />
        <MetaRow label="Deliverables" values={project.deliverables} />
        <MetaRow label="Tools / Methods" values={project.toolsMethods} />
      </div>
    </section>
  );
}

function MetaRow({ label, values }: { label: string; values: string[] | readonly string[] }) {
  return (
    <div className={rowClass}>
      <p className="mb-3 text-neutral-500">{label}</p>
      <div className="space-y-2 text-neutral-900">
        {values.map((value) => (
          <p key={value}>{value}</p>
        ))}
      </div>
    </div>
  );
}
