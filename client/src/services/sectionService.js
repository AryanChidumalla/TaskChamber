import { apiFetch } from "./api";

export async function getSections(projectId) {
  return apiFetch(`/sections/project/${projectId}`);
}

export async function createSection(projectId, name) {
  return apiFetch(`/sections/project/${projectId}`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateSection(sectionId, updateData) {
  return apiFetch(`/sections/${sectionId}`, {
    method: "PATCH",
    body: JSON.stringify(updateData),
  });
}

export async function deleteSection(sectionId) {
  return apiFetch(`/sections/${sectionId}`, {
    method: "DELETE",
  });
}
