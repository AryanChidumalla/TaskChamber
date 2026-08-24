function getApiBaseUrl() {
  let url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  // Trim whitespace and trailing slashes
  url = url.trim().replace(/\/+$/, "");

  // If the user provided the root domain (e.g. https://my-backend.vercel.app) without /api, append it
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
}

const API_URL = getApiBaseUrl();

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // Ensure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_URL}${formattedEndpoint}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    console.error("Network Fetch Error:", networkError);
    throw new Error(
      `Failed to connect to backend server at ${API_URL}. Please verify your backend is running and CORS is enabled.`
    );
  }

  const contentType = response.headers.get("content-type");
  let data = null;

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMessage =
      data?.message || `Request failed with status ${response.status} (${response.statusText})`;
    throw new Error(errorMessage);
  }

  return data;
}
