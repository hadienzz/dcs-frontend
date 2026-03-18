import {
  createSeedProjects,
  normalizeProjectRecord,
  type SdgDashboardProjectRecord,
} from "@/components/sdg-dashboard/dashboard-data";

export const SDG_DASHBOARD_PROJECTS_STORAGE_KEY = "sdg-dashboard-projects";
export const SDG_DASHBOARD_PROJECTS_UPDATED_EVENT =
  "sdg-dashboard-projects-updated";

function canUseStorage() {
  return typeof window !== "undefined";
}

function sortProjects(projects: SdgDashboardProjectRecord[]) {
  return [...projects].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

function normalizeProjects(projects: Partial<SdgDashboardProjectRecord>[]) {
  const slugs: string[] = [];

  return projects.map((project) => {
    const normalizedProject = normalizeProjectRecord(project, slugs);
    slugs.push(normalizedProject.slug);
    return normalizedProject;
  });
}

export function saveSdgDashboardProjects(
  projects: SdgDashboardProjectRecord[],
) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    SDG_DASHBOARD_PROJECTS_STORAGE_KEY,
    JSON.stringify(sortProjects(projects)),
  );
  window.dispatchEvent(new Event(SDG_DASHBOARD_PROJECTS_UPDATED_EVENT));
}

export function ensureSdgDashboardProjects() {
  if (!canUseStorage()) {
    return createSeedProjects();
  }

  const rawProjects = window.localStorage.getItem(
    SDG_DASHBOARD_PROJECTS_STORAGE_KEY,
  );

  if (!rawProjects) {
    const seededProjects = createSeedProjects();
    saveSdgDashboardProjects(seededProjects);
    return seededProjects;
  }

  try {
    const parsedProjects = JSON.parse(rawProjects);

    if (!Array.isArray(parsedProjects) || parsedProjects.length === 0) {
      const seededProjects = createSeedProjects();
      saveSdgDashboardProjects(seededProjects);
      return seededProjects;
    }

    const normalizedProjects = sortProjects(
      normalizeProjects(parsedProjects as Partial<SdgDashboardProjectRecord>[]),
    );
    const normalizedProjectsJson = JSON.stringify(normalizedProjects);

    if (normalizedProjectsJson !== rawProjects) {
      window.localStorage.setItem(
        SDG_DASHBOARD_PROJECTS_STORAGE_KEY,
        normalizedProjectsJson,
      );
    }

    return normalizedProjects;
  } catch {
    const seededProjects = createSeedProjects();
    saveSdgDashboardProjects(seededProjects);
    return seededProjects;
  }
}

export function getSdgDashboardProjectBySlug(slug: string) {
  return (
    ensureSdgDashboardProjects().find((project) => project.slug === slug) ?? null
  );
}

export function createAndStoreSdgDashboardProject(input: {
  id?: string;
  slug?: string;
  invitationCode?: string | null;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  externalName: string;
}) {
  const projects = ensureSdgDashboardProjects();
  const remainingProjects = projects.filter(
    (project) =>
      (input.id ? project.id !== input.id : true) &&
      (input.slug ? project.slug !== input.slug : true),
  );
  const project = normalizeProjectRecord(
    {
      id: input.id,
      slug: input.slug,
      invitationCode: input.invitationCode ?? undefined,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      name: input.name,
      externalName: input.externalName,
    },
    remainingProjects.map((item) => item.slug),
  );

  saveSdgDashboardProjects([project, ...remainingProjects]);

  return project;
}

export function updateSdgDashboardProject(
  updatedProject: SdgDashboardProjectRecord,
) {
  const projects = ensureSdgDashboardProjects();
  const nextProjects = projects.some((project) => project.id === updatedProject.id)
    ? projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      )
    : [updatedProject, ...projects];

  const normalizedProject = normalizeProjectRecord(updatedProject, []);

  saveSdgDashboardProjects(
    nextProjects.map((project) =>
      project.id === normalizedProject.id ? normalizedProject : project,
    ),
  );

  return normalizedProject;
}
