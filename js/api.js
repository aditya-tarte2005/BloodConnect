(() => {
  const apiBase =
    window.location.port === "8080"
      ? `${window.location.origin}/api`
      : "http://localhost:8080/api";


  async function request(path, options = {}) {

    const response = await fetch(`${apiBase}${path}`, {
      ...options,

      headers: {
        Accept: "application/json",

        ...(options.body
          ? {
              "Content-Type": "application/json"
            }
          : {}),

        ...(options.headers || {})
      }
    });


    const payload =
      response.status === 204
        ? null
        : await response
            .json()
            .catch(() => null);


    if (!response.ok) {

      throw new Error(
        payload?.message ||
        payload?.error ||
        `API request failed (${response.status})`
      );

    }


    return payload;
  }



  /* =====================================================
     GENERIC API METHODS
     ===================================================== */

  const api = {

    health: () =>
      request("/health"),


    get: (path) =>
      request(path),


    post: (path, value) =>
      request(path, {
        method: "POST",
        body: JSON.stringify(value)
      }),


    put: (path, value) =>
      request(path, {
        method: "PUT",
        body: JSON.stringify(value)
      }),


    delete: (path) =>
      request(path, {
        method: "DELETE"
      }),



    /* ===================================================
       DONORS
       =================================================== */

    getDonors: () =>
      request("/donors"),


    createDonor: (value) =>
      request("/donors", {
        method: "POST",
        body: JSON.stringify(value)
      }),


    updateDonor: (id, value) =>
      request(
        `/donors/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(value)
        }
      ),


    deleteDonor: (id) =>
      request(
        `/donors/${encodeURIComponent(id)}`,
        {
          method: "DELETE"
        }
      ),



    /* ===================================================
       HOSPITALS
       =================================================== */

    getHospitals: () =>
      request("/hospitals"),


    createHospital: (value) =>
      request("/hospitals", {
        method: "POST",
        body: JSON.stringify(value)
      }),


    updateHospital: (id, value) =>
      request(
        `/hospitals/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(value)
        }
      ),


    deleteHospital: (id) =>
      request(
        `/hospitals/${encodeURIComponent(id)}`,
        {
          method: "DELETE"
        }
      ),



    /* ===================================================
       BLOOD REQUESTS
       =================================================== */

    getRequests: () =>
      request("/requests"),


    createRequest: (value) =>
      request("/requests", {
        method: "POST",
        body: JSON.stringify(value)
      }),


    updateRequest: (id, value) =>
      request(
        `/requests/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(value)
        }
      ),


    deleteRequest: (id) =>
      request(
        `/requests/${encodeURIComponent(id)}`,
        {
          method: "DELETE"
        }
      ),



    /* ===================================================
       INVENTORY
       =================================================== */

    getInventory: () =>
      request("/inventory"),


    createInventory: (value) =>
      request("/inventory", {
        method: "POST",
        body: JSON.stringify(value)
      }),


    updateInventory: (id, value) =>
      request(
        `/inventory/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(value)
        }
      ),


    deleteInventory: (id) =>
      request(
        `/inventory/${encodeURIComponent(id)}`,
        {
          method: "DELETE"
        }
      ),



    /* ===================================================
       TRANSACTIONS
       =================================================== */

    getTransactions: () =>
      request("/transactions"),


    createTransaction: (value) =>
      request("/transactions", {
        method: "POST",
        body: JSON.stringify(value)
      }),


    updateTransaction: (id, value) =>
      request(
        `/transactions/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(value)
        }
      ),


    deleteTransaction: (id) =>
      request(
        `/transactions/${encodeURIComponent(id)}`,
        {
          method: "DELETE"
        }
      ),



    /* ===================================================
       DASHBOARD
       =================================================== */

    getDashboard: () =>
      request("/dashboard"),



    /* ===================================================
       NOTIFICATIONS
       =================================================== */

    getNotifications: () =>
      request("/notifications"),



    /* ===================================================
       REPORTS
       =================================================== */

    getReportSummary: () =>
      request("/reports/summary"),



    /* ===================================================
       SETTINGS
       =================================================== */

    getSettings: () =>
      request("/settings"),


    updateSettings: (value) =>
      request("/settings", {
        method: "PUT",
        body: JSON.stringify(value)
      })

  };


  window.BloodConnectApi = api;


  console.log(
    `BloodConnect API initialized: ${apiBase}`
  );

})();