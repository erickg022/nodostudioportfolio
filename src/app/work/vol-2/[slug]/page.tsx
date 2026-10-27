import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/PageTransition";
import { ProjectDetail } from "@/components/ProjectDetail";
import { getVolumeTwoAdjacent, getVolumeTwoProject, volumeTwoProjects } from "@/data/volumeTwo";

export function generateStaticParams() {
  return volumeTwoProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getVolumeTwoProject(slug);
  return {
    title: project ? `${project.title} / Work / NODO STUDIO` : "Work / NODO STUDIO",
    description: project?.shortDescription,
    robots: { index: false, follow: false },
  };
}

export default async function VolumeTwoProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getVolumeTwoProject(slug);
  if (!project) notFound();
  const { previous, next } = getVolumeTwoAdjacent(slug);

  return (
    <PageTransition>
      <ProjectDetail
        project={project}
        total={volumeTwoProjects.length}
        previous={previous}
        next={next}
        hrefBase="/work/vol-2"
        showResponse={project.slug !== "mahou-dilo-como-madrid" && project.slug !== "beefeater-light" && project.slug !== "airbnb"}
      />
    </PageTransition>
  );
}
