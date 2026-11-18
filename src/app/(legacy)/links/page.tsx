import type { Metadata } from "next";
import { LinkStack } from "@/components/links/LinkStack";
import styles from "@/components/links/LinkStack.module.css";
import { bioLinks } from "@/data/links";

export const metadata: Metadata = {
  title: "Links / NODO STUDIO",
  description: "Cursos, recursos gratis e Instagram de NODO STUDIO.",
  robots: { index: false, follow: true },
};

export default function LinksPage() {
  return (
    <section className={styles.wrap}>
      <div className={`${styles.meta} font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500`}>
        <span>(Links)</span>
        <span>Creative technology + IA</span>
      </div>
      <LinkStack links={bioLinks} />
      <div className={`${styles.foot} font-mono text-[11px] uppercase tracking-[0.18em]`}>
        <span>nodostudio.dev</span>
        <span>(C) 2026</span>
      </div>
    </section>
  );
}
