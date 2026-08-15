export async function apiFetch(path: string, init?: RequestInit) {
  const response = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
