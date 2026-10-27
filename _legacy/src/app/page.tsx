import { HomeAboutSection } from "@/components/HomeAboutSection";
import { PageTransition } from "@/components/PageTransition";
import { SelectedWorks } from "@/components/SelectedWorks";

export default function Home() {
  return (
    <PageTransition>
      <SelectedWorks />
      <HomeAboutSection />
    </PageTransition>
  );
}
