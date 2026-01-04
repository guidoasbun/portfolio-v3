"use client";

import { ProjectCard } from "@/components/ui/ProjectCard";
import { mockProjects } from "@/data/projects";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects?: Project[];
}

export function ProjectsSection({
  projects = mockProjects,
}: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-12 sm:py-20 lg:py-32">
      <h1>Projects Section</h1>
    </section>
  );
}
