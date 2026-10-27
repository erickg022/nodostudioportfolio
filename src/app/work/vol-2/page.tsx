import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTransition } from "@/components/PageTransition";
import { WorkIndex } from "@/components/WorkIndex";
import { volumeTwoProjects } from "@/data/volumeTwo";

export const metadata: Metadata = {
  title: "Work / NODO STUDIO",
  description: "An audiovisual edit of selected NODO STUDIO work.",
  robots: { index: false, follow: false },
};

export default function VolumeTwoPage() {
  return (
    <PageTransition>
      <Suspense>
        <WorkIndex projects={volumeTwoProjects} hrefBase="/work/vol-2" />
      </Suspense>
    </PageTransition>
  );
}
