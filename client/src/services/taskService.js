import { apiFetch } from "./api";

export async function getTasks(projectId) {
  return apiFetch(`/tasks/project/${projectId}`);
}

export async function createTask(projectId, taskData) {
  return apiFetch(`/tasks/project/${projectId}`, {
    method: "POST",
    body: JSON.stringify(taskData),
  });
}

export async function updateTask(taskId, taskData) {
  return apiFetch(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(taskData),
  });
}

export async function moveTask(taskId, sectionId, position) {
  return apiFetch(`/tasks/${taskId}/move`, {
    method: "PATCH",
    body: JSON.stringify({ sectionId, position }),
  });
}

export async function deleteTask(taskId) {
  return apiFetch(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}
