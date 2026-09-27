(() => {
  const apiBase = window.location.port === "8080"
    ? `${window.location.origin}/api`
    : "http://localhost:8080/api";

  async function request(path, options = {}) {
    const response = await fetch(`${apiBase}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      }
    });

    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(payload?.message || payload?.error || `API request failed (${response.status})`);
    }

    return payload;
  }

  window.BloodConnectApi = {
    health: () => request("/health"),
    get: path => request(path),
    post: (path, value) => request(path, { method: "POST", body: JSON.stringify(value) }),
    put: (path, value) => request(path, { method: "PUT", body: JSON.stringify(value) }),
    delete: path => request(path, { method: "DELETE" })
  };
})();
