import { apiFetch } from "./api";

export async function getProjects() {
  return apiFetch("/projects");
}

export async function getProject(projectId) {
  return apiFetch(`/projects/${projectId}`);
}

export async function createProject(projectData) {
  return apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

export async function updateProject(projectId, projectData) {
  return apiFetch(`/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(projectData),
  });
}

export async function deleteProject(projectId) {
  return apiFetch(`/projects/${projectId}`, {
    method: "DELETE",
  });
}
