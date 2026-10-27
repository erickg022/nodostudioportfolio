import { clsx, type ClassValue } from "clsx";
import type { Project } from "@/data/projects";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function projectIndex(project: Project) {
  return project.index;
}

export function mediaGradient(accentColor: string) {
  return {
    background:
      `radial-gradient(circle at 72% 28%, ${accentColor}36, transparent 30%), ` +
      `linear-gradient(135deg, #ebe6d9 0%, #f7f4ec 42%, ${accentColor}18 68%, #d8d2c5 100%)`,
  };
}
