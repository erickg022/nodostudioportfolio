import { Suspense } from "react";
import { PageTransition } from "@/components/PageTransition";
import { WorkIndex } from "@/components/WorkIndex";
import { volumeTwoProjects } from "@/data/volumeTwo";

export default function WorkPage() {
  return (
    <PageTransition>
      <Suspense>
        <WorkIndex projects={volumeTwoProjects} />
      </Suspense>
    </PageTransition>
  );
}
