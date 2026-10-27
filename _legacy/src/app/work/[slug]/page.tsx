import { notFound } from "next/navigation";
import { PageTransition } from "@/components/PageTransition";
import { ProjectDetail } from "@/components/ProjectDetail";
import { getNextProject, getPreviousProject, getProject, projects } from "@/data/projects";
import { getVolumeTwoAdjacent, getVolumeTwoProject, volumeTwoProjects } from "@/data/volumeTwo";

export function generateStaticParams() {
  return [...new Set([...volumeTwoProjects, ...projects].map((project) => project.slug))]
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getVolumeTwoProject(slug) ?? getProject(slug);
  return {
    title: project ? `${project.title} / NODO STUDIO` : "Project / NODO STUDIO",
    description: project?.shortDescription,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const featuredProject = getVolumeTwoProject(slug);
  const project = featuredProject ?? getProject(slug);
  if (!project) notFound();
  const featuredAdjacent = featuredProject ? getVolumeTwoAdjacent(slug) : undefined;

  return (
    <PageTransition>
      <ProjectDetail
        project={project}
        total={featuredProject ? volumeTwoProjects.length : projects.length}
        previous={featuredAdjacent?.previous ?? getPreviousProject(project.slug)}
        next={featuredAdjacent?.next ?? getNextProject(project.slug)}
        showResponse={!featuredProject || !["mahou-dilo-como-madrid", "beefeater-light", "airbnb"].includes(project.slug)}
      />
    </PageTransition>
  );
}
