"use client";

import type { ReactNode } from "react";
import type { Project } from "@/data/projects";

type ProjectResponseMetric = {
  index: string;
  value: string;
  label: string;
  description: string;
  compact?: boolean;
  emphasis?: boolean;
  breakAfterArrow?: boolean;
};

type ProjectResponseStrip = {
  label: string;
  secondaryLabel?: string;
  text: string;
};

type ProjectResponseConfig = {
  eyebrow: string;
  intro: string;
  metrics: ProjectResponseMetric[];
  recognition?: ProjectResponseStrip;
  annotation?: ProjectResponseStrip;
  variant?: "metrics" | "system";
};

const projectResponses: Record<string, ProjectResponseConfig> = {
  "lacoste-roland-garros": {
    eyebrow: "CULTURAL RESPONSE",
    intro:
      "An independent speculative concept that generated organic attention across fashion, design, and creative culture.",
    metrics: [
      {
        index: "01",
        value: "242K",
        label: "PROJECT VIEWS",
        description: "Organic views across social platforms",
        emphasis: true,
      },
      {
        index: "02",
        value: "14K",
        label: "LIKES",
        description: "Organic likes across social platforms",
      },
      {
        index: "03",
        value: "170K",
        label: "ACCOUNTS REACHED",
        description: "Organic social reach",
      },
    ],
    recognition: {
      label: "RECOGNITION",
      secondaryLabel: "FEATURED BY",
      text: "ELLE NETHERLANDS — CREATIVE DIRECTOR ACCOUNT",
    },
  },
  ginebra: {
    eyebrow: "CULTURAL RESPONSE",
    intro: "A jewelry campaign concept that travelled organically across fashion, design, and visual culture.",
    metrics: [
      {
        index: "01",
        value: "950K+",
        label: "PROJECT VIEWS",
        description: "Organic views across social platforms",
        compact: true,
      },
      {
        index: "02",
        value: "20K+",
        label: "LIKES",
        description: "Organic likes across social platforms",
      },
    ],
    recognition: {
      label: "RECOGNITION",
      secondaryLabel: "FEATURED IN",
      text: "VOGUE BRITAIN — JUNE 2026 EDITION",
    },
  },
  twojeys: {
    eyebrow: "CULTURAL RESPONSE",
    intro: "A visual campaign concept that generated organic engagement across fashion, jewelry, and digital culture.",
    metrics: [
      {
        index: "01",
        value: "10K+",
        label: "PROJECT VIEWS",
        description: "Organic visualizations across social platforms",
      },
      {
        index: "02",
        value: "5K+",
        label: "ACCOUNTS ENGAGED",
        description: "Organic audience engagement across social platforms",
      },
    ],
  },
  "gdl-movilidad": {
    eyebrow: "PUBLIC RESPONSE",
    intro: "A public-facing digital experience that generated immediate participation during its first days live.",
    metrics: [
      {
        index: "01",
        value: "30K+",
        label: "PUBLIC TRIES",
        description: "Recorded within the first 5 days of launch",
      },
      {
        index: "02",
        value: "6K+",
        label: "AVERAGE DAILY TRIES",
        description: "Based on participation during the first 5 days live",
      },
      {
        index: "03",
        value: "05 DAYS",
        label: "LAUNCH WINDOW",
        description: "Measured from the project's initial public release",
        compact: true,
      },
    ],
  },
  "eat-nudes": {
    eyebrow: "AUDIENCE GROWTH",
    intro:
      "An ongoing social-first visual system that expanded the EAT NUDES audience through campaign films, product imagery, and recurring creative content.",
    metrics: [
      {
        index: "01",
        value: "19K → 26K+",
        label: "AUDIENCE SIZE",
        description: "Account growth during less than 2 months of content direction",
        compact: true,
        breakAfterArrow: true,
      },
      {
        index: "02",
        value: "7K+",
        label: "NEW FOLLOWERS",
        description: "Added during the project period",
      },
      {
        index: "03",
        value: "1.8K+",
        label: "PEAK POST LIKES",
        description: "Individual content pieces reached more than 1,800 organic likes",
      },
    ],
  },
  "nike-world-cup": {
    eyebrow: "WORLD-BUILDING SYSTEM",
    intro:
      "An independent speculative retail world built to explore how Nike Football could occupy the World Cup 2026 through architecture, product storytelling, immersive environments, and street-level cultural presence.",
    variant: "system",
    metrics: [
      {
        index: "01",
        value: "01",
        label: "FLAGSHIP FACADE",
        description:
          "A high-impact street intervention designed to transform the storefront into a physical expression of Nike Football energy, movement, and tournament anticipation.",
        compact: true,
      },
      {
        index: "02",
        value: "02",
        label: "IMMERSIVE JOURNEY",
        description:
          "A sequence of spatial environments spanning tunnel entry, product display, installation moments, broadcast nostalgia, and football-led social space.",
        compact: true,
      },
      {
        index: "03",
        value: "03",
        label: "CAMPAIGN LANGUAGE",
        description:
          "A complete visual system connecting architecture, materiality, lighting, typography, product storytelling, and editorial campaign imagery.",
        compact: true,
      },
    ],
    annotation: {
      label: "INDUSTRY INTEREST",
      text: "The project generated organic conversations with international architecture, creative, and experiential studios.",
    },
  },
  "play-in-motion": {
    eyebrow: "LIVE PARTICIPATION",
    intro:
      "A game-led brand activation designed to turn curiosity into product interaction across two days of live exhibition activity.",
    metrics: [
      {
        index: "01",
        value: "200+",
        label: "DAILY PARTICIPANTS",
        description: "More than 200 users engaged with the installation each day of the expo",
      },
      {
        index: "02",
        value: "03 HRS",
        label: "PRIZES FULLY CLAIMED",
        description: "All available prizes from the first game were gone within the first three hours of the exhibition",
        compact: true,
      },
      {
        index: "03",
        value: "02 DAYS",
        label: "ACTIVE GAMEPLAY",
        description:
          "A second game experience repeated the same pattern: visitors arrived to play, then stayed to explore the product experience",
        compact: true,
      },
    ],
    annotation: {
      label: "PRODUCT INTERACTION",
      text: "The AR nutritional-information experience was used by every visitor who scanned a product during the expo.",
    },
  },
};

export function ProjectResponseSection({ project }: { project: Project }) {
  const config = projectResponses[project.slug] ?? createFallbackResponse(project);
  const cells: Array<ProjectResponseMetric | null> = [
    config.metrics[0] ?? null,
    config.metrics[1] ?? null,
    config.metrics[2] ?? null,
  ];
  const strip = config.recognition ?? config.annotation;

  return (
    <section className="px-4 pb-20 pt-16 sm:px-6">
      <div className="mx-auto max-w-[1800px] border-y border-black/15">
        <div className="grid box-border md:grid-cols-2 xl:grid-cols-4 xl:[grid-template-columns:repeat(4,minmax(0,1fr))]">
          <div className="box-border min-w-0 border-b border-black/15 p-5 md:col-span-2 xl:col-span-1 xl:min-h-[360px] xl:border-b-0 xl:border-r">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">{config.eyebrow}</p>
            <p className="mt-8 max-w-[38ch] text-xl leading-tight text-neutral-950 md:text-2xl xl:text-[clamp(1.35rem,1.7vw,2rem)]">
              {config.intro}
            </p>
          </div>
          {cells.map((metric, index) =>
            metric ? (
              <MetricCell key={`${metric.index}-${metric.label}`} metric={metric} variant={config.variant} isLast={index === cells.length - 1} />
            ) : (
              <div
                key={`empty-${index}`}
                className="hidden box-border min-w-0 overflow-hidden border-black/15 p-5 xl:block xl:min-h-[360px] xl:border-r last:xl:border-r-0"
                aria-hidden="true"
              />
            ),
          )}
        </div>
        {strip ? <ResponseStrip strip={strip} /> : null}
      </div>
    </section>
  );
}

function MetricCell({
  metric,
  variant,
  isLast,
}: {
  metric: ProjectResponseMetric;
  variant?: ProjectResponseConfig["variant"];
  isLast?: boolean;
}) {
  return (
    <div
      className={[
        "box-border min-w-0 overflow-hidden border-b border-black/15 p-5 md:min-h-[320px] md:border-r xl:min-h-[360px] xl:border-b-0",
        isLast ? "xl:border-r-0" : "xl:border-r",
      ].join(" ")}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">{metric.index}</p>
      {variant === "system" ? null : (
        <p
          className={[
            "mt-10 w-full max-w-full overflow-hidden font-sans font-black uppercase leading-[0.86] tracking-[-0.06em] [font-variant-numeric:tabular-nums] [overflow-wrap:anywhere]",
            metric.emphasis ? "text-neutral-950" : "text-neutral-900",
            metric.compact ? "text-[clamp(2.9rem,3.5vw,4.5rem)]" : "text-[clamp(4rem,5.2vw,5.75rem)]",
          ].join(" ")}
        >
          {renderMetricValue(metric)}
        </p>
      )}
      <p
        className={[
          "max-w-[18ch] font-mono uppercase leading-tight tracking-[0.2em] text-neutral-950",
          variant === "system" ? "mt-16 text-[clamp(1.45rem,2vw,2.3rem)] font-sans font-black tracking-[-0.03em]" : "mt-6 text-[11px]",
        ].join(" ")}
      >
        {metric.label}
      </p>
      <p className="mt-5 max-w-[30ch] text-sm leading-snug text-neutral-600">{metric.description}</p>
    </div>
  );
}

function renderMetricValue(metric: ProjectResponseMetric): ReactNode {
  if (!metric.breakAfterArrow) return metric.value;

  return (
    <>
      <span className="hidden 2xl:inline">{metric.value}</span>
      <span className="2xl:hidden">
        19K →<br />
        26K+
      </span>
    </>
  );
}

function ResponseStrip({ strip }: { strip: ProjectResponseStrip }) {
  return (
    <div className="grid box-border border-t border-black/15 md:grid-cols-2 xl:grid-cols-4 xl:[grid-template-columns:repeat(4,minmax(0,1fr))]">
      <div className="box-border min-w-0 border-b border-black/15 p-5 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 md:border-r xl:border-b-0">
        {strip.label}
      </div>
      <div className="box-border min-w-0 border-b border-black/15 p-5 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 md:border-b-0 xl:border-r">
        {strip.secondaryLabel ?? ""}
      </div>
      <div className="box-border min-w-0 p-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-neutral-950 md:col-span-2 xl:col-span-2">
        {strip.text}
      </div>
    </div>
  );
}

function createFallbackResponse(project: Project): ProjectResponseConfig {
  const systemLabels =
    project.contentMode === "system"
      ? [
          ["01", "INPUT", project.systemContent.input],
          ["02", "SYSTEM", project.systemContent.system],
          ["03", "FEEDBACK", project.systemContent.feedback],
        ]
      : [
          ["01", "CONCEPT", project.systemContent.concept],
          ["02", "WORLD", project.systemContent.world],
          ["03", "OUTPUT", project.systemContent.output],
        ];

  return {
    eyebrow: "WORLD-BUILDING SYSTEM",
    intro: project.shortDescription,
    variant: "system",
    metrics: systemLabels.map(([index, label, description]) => ({
      index: index ?? "",
      value: index ?? "",
      label: label ?? "",
      description: description ?? "",
      compact: true,
    })),
  };
}
