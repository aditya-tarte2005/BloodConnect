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

    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }

    return response.json();
  }

  window.BloodConnectApi = {
    health: () => request("/health")
  };
})();
