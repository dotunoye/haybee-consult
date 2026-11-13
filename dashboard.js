(() => {
  const STORAGE_KEY = "haybee-tenancies-v1";
  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const save = (items) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); return true; }
    catch { return false; }
  };
  const offsetDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(value)) return value;
    } catch { /* Start with sample records if storage is unavailable. */ }
    const examples = [
      { id: "example-ikoyi", accessToken: secureToken() || "example-ikoyi-access", name: "Mariam Adebayo", email: "mariam@example.com", phone: "+234 800 000 1201", address: "14 Bourdillon Road, Flat 4", location: "Ikoyi, Lagos", rent: "₦8,500,000 / year", startDate: offsetDate(-330), renewalDate: offsetDate(35), lastPaid: offsetDate(-330), payments: [{ date: offsetDate(-330), amount: "₦8,500,000", status: "Paid", note: "Annual rent" }, { date: offsetDate(-695), amount: "₦8,000,000", status: "Paid", note: "Annual rent" }], complaints: [{ id: "example-request", date: offsetDate(-2), subject: "Water pressure", message: "The water pressure has been low in the upstairs bathroom.", status: "Open" }] },
      { id: "example-lekki", accessToken: secureToken() || "example-lekki-access", name: "Chinedu Okafor", email: "chinedu@example.com", phone: "+234 800 000 1202", address: "6A Admiralty Way, Apartment 3B", location: "Lekki Phase 1, Lagos", rent: "₦5,200,000 / year", startDate: offsetDate(-180), renewalDate: offsetDate(185), lastPaid: offsetDate(-180), payments: [{ date: offsetDate(-180), amount: "₦5,200,000", status: "Paid", note: "Annual rent" }], complaints: [] }
    ];
    save(examples);
    return examples;
  };
  const dateText = (value) => {
    if (!value) return "Not recorded";
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? "Not recorded" : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
  };
  const daysUntil = (value) => value ? Math.ceil((new Date(`${value}T00:00:00`) - new Date(new Date().toDateString())) / 86400000) : null;
  const renewalText = (value) => {
    const days = daysUntil(value);
    if (days === null) return "Date not set";
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    return days === 0 ? "Due today" : `${days} days remaining`;
  };
  const secureToken = () => {
    if (!window.crypto?.getRandomValues) return null;
    const bytes = new Uint8Array(24);
    window.crypto.getRandomValues(bytes);
    return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  };
  const tenantLink = (token) => {
    const url = new URL("tenant.html", window.location.href);
    url.searchParams.set("access", token);
    return url.href;
  };

  function setupLandlord() {
    if (document.body.dataset.dashboard !== "landlord") return;
    const list = document.querySelector("[data-managed-list]");
    const detail = document.querySelector("[data-landlord-detail]");
    const panel = document.querySelector("[data-tenant-form-panel]");
    const form = document.querySelector("[data-tenant-form]");
    let tenancies = read();
    let activeId = tenancies[0]?.id;

    function renderDetail() {
      const item = tenancies.find((entry) => entry.id === activeId);
      if (!item) {
        detail.innerHTML = '<div class="detail-empty"><span class="eyebrow">Tenancy overview</span><h2>Select a property</h2><p>Choose a tenancy to view its records and private tenant link.</p></div>';
        return;
      }
      const open = item.complaints.filter((request) => request.status === "Open").length;
      const paymentRows = item.payments.length ? item.payments.map((payment) => `<div class="record-row"><div><strong>${escapeHTML(payment.amount)}</strong><span>${escapeHTML(payment.note || "Rent payment")}</span></div><div><strong>${escapeHTML(payment.status)}</strong><span>${dateText(payment.date)}</span></div></div>`).join("") : '<p class="dashboard-muted">No payment records have been added yet.</p>';
      const requests = item.complaints.length ? item.complaints.map((request) => `<article class="request-row"><div class="request-row-top"><span class="eyebrow">${dateText(request.date)}</span><span class="status-pill ${request.status === "Open" ? "status-open" : "status-resolved"}">${escapeHTML(request.status)}</span></div><h3>${escapeHTML(request.subject)}</h3><p>${escapeHTML(request.message)}</p>${request.status === "Open" ? `<button type="button" class="quiet-button" data-resolve="${escapeHTML(request.id)}">Mark resolved</button>` : ""}</article>`).join("") : '<p class="dashboard-muted">No questions or complaints recorded.</p>';
      detail.innerHTML = `<div class="tenant-detail-head"><p class="eyebrow">Tenancy record</p><h2>${escapeHTML(item.name)}</h2><p>${escapeHTML(item.address)}<br>${escapeHTML(item.location)}</p><span class="rent-countdown${daysUntil(item.renewalDate) <= 60 ? " countdown-soon" : ""}">${renewalText(item.renewalDate)}</span></div><dl class="tenancy-facts"><div><dt>Rent</dt><dd>${escapeHTML(item.rent)}</dd></div><div><dt>Last paid</dt><dd>${dateText(item.lastPaid)}</dd></div><div><dt>Tenancy began</dt><dd>${dateText(item.startDate)}</dd></div><div><dt>Next renewal</dt><dd>${dateText(item.renewalDate)}</dd></div><div><dt>Tenant contact</dt><dd><a href="mailto:${encodeURIComponent(item.email)}">${escapeHTML(item.email)}</a></dd></div><div><dt>Phone</dt><dd>${escapeHTML(item.phone || "Not provided")}</dd></div></dl><section class="private-link-box"><div><p class="eyebrow">Private tenant access</p><p class="private-link-url">${escapeHTML(tenantLink(item.accessToken))}</p></div><button type="button" class="button button-outline-dark" data-copy="${escapeHTML(item.id)}">Copy link</button></section><section class="detail-subsection"><div class="dashboard-section-heading"><div><p class="eyebrow">Payment history</p><h3>Rent record</h3></div></div>${paymentRows}</section><section class="detail-subsection"><div class="dashboard-section-heading"><div><p class="eyebrow">Tenant questions</p><h3>Requests</h3></div><span class="status-pill ${open ? "status-open" : "status-resolved"}">${open} open</span></div>${requests}</section><div class="tenant-action-row"><a class="button button-outline-dark" href="mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent("Rent renewal reminder")}&body=${encodeURIComponent(`Hello ${item.name}, your tenancy at ${item.address} is due for renewal on ${dateText(item.renewalDate)}. Please contact us to discuss next steps.`)}">Email renewal reminder</a><button type="button" class="quiet-button quiet-danger" data-delete="${escapeHTML(item.id)}">Remove tenancy</button></div>`;
    }

    function render() {
      const open = tenancies.reduce((sum, item) => sum + item.complaints.filter((request) => request.status === "Open").length, 0);
      const renewals = tenancies.filter((item) => daysUntil(item.renewalDate) >= 0 && daysUntil(item.renewalDate) <= 60).length;
      document.querySelector('[data-stat="homes"]').textContent = String(tenancies.length).padStart(2, "0");
      document.querySelector('[data-stat="renewals"]').textContent = String(renewals).padStart(2, "0");
      document.querySelector('[data-stat="complaints"]').textContent = String(open).padStart(2, "0");
      document.querySelector("[data-tenancy-count]").textContent = `${tenancies.length} ${tenancies.length === 1 ? "home" : "homes"}`;
      list.innerHTML = tenancies.length ? tenancies.map((item) => {
        const days = daysUntil(item.renewalDate);
        const requests = item.complaints.filter((request) => request.status === "Open").length;
        return `<button class="managed-card${activeId === item.id ? " selected" : ""}" type="button" data-select="${escapeHTML(item.id)}"><span class="managed-card-top"><span class="eyebrow">${escapeHTML(item.location)}</span>${requests ? `<span class="request-indicator">${requests} request${requests === 1 ? "" : "s"}</span>` : ""}</span><strong>${escapeHTML(item.name)}</strong><span class="managed-address">${escapeHTML(item.address)}</span><span class="managed-card-bottom"><span>Renewal ${dateText(item.renewalDate)}</span><span class="days-chip${days <= 60 ? " countdown-soon" : ""}">${renewalText(item.renewalDate)}</span></span></button>`;
      }).join("") : '<div class="list-empty"><h3>No tenancies yet</h3><p>Add your first tenant to start a private record.</p></div>';
      renderDetail();
      if (activeId) {
        detail.insertAdjacentHTML("beforeend", '<section class="payment-entry-wrapper"><button type="button" class="quiet-button" data-toggle-payment>Record a payment +</button><form class="payment-entry-form" data-payment-form hidden><label>Amount received<input name="amount" required placeholder="₦4,500,000"></label><label>Payment date<input name="date" required type="date"></label><label>Note<input name="note" placeholder="Annual rent"></label><button type="submit" class="button button-dark">Save payment</button></form></section>');
        detail.querySelector('[data-payment-form] [name="date"]').value = new Date().toISOString().slice(0, 10);
      }
    }

    list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-select]");
      if (!button) return;
      activeId = button.dataset.select;
      render();
      if (matchMedia("(max-width: 860px)").matches) detail.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    detail.addEventListener("click", async (event) => {
      const copy = event.target.closest("[data-copy]");
      const resolve = event.target.closest("[data-resolve]");
      const remove = event.target.closest("[data-delete]");
      const togglePayment = event.target.closest("[data-toggle-payment]");
      if (togglePayment) {
        const entry = detail.querySelector("[data-payment-form]");
        entry.hidden = !entry.hidden;
      }
      if (copy) {
        const item = tenancies.find((entry) => entry.id === copy.dataset.copy);
        try {
          await navigator.clipboard.writeText(tenantLink(item.accessToken));
          copy.textContent = "Copied";
          setTimeout(() => { if (copy.isConnected) copy.textContent = "Copy link"; }, 1800);
        } catch { window.prompt("Copy this private tenant link", tenantLink(item.accessToken)); }
      }
      if (resolve) {
        const item = tenancies.find((entry) => entry.id === activeId);
        const request = item.complaints.find((entry) => entry.id === resolve.dataset.resolve);
        if (request) request.status = "Resolved";
        save(tenancies); render();
      }
      if (remove && confirm("Remove this tenancy and its local records?")) {
        tenancies = tenancies.filter((entry) => entry.id !== remove.dataset.delete);
        activeId = tenancies[0]?.id;
        save(tenancies); render();
      }
    });
    detail.addEventListener("submit", (event) => {
      const paymentForm = event.target.closest("[data-payment-form]");
      if (!paymentForm) return;
      event.preventDefault();
      const data = new FormData(paymentForm);
      const item = tenancies.find((entry) => entry.id === activeId);
      if (!item) return;
      item.payments.unshift({ date: data.get("date"), amount: data.get("amount").trim(), status: "Paid", note: data.get("note").trim() || "Rent payment" });
      item.lastPaid = data.get("date");
      save(tenancies);
      render();
    });
    document.querySelector("[data-open-tenant-form]").addEventListener("click", () => {
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
      form.elements.name.focus();
    });
    document.querySelector("[data-close-tenant-form]").addEventListener("click", () => { panel.hidden = true; });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const token = secureToken();
      const message = document.querySelector("[data-form-message]");
      if (!token) { message.textContent = "Secure link generation requires a modern browser on HTTPS or localhost."; return; }
      const data = new FormData(form);
      const item = { id: `tenant-${token.slice(0, 12)}`, accessToken: token, name: data.get("name").trim(), email: data.get("email").trim(), phone: data.get("phone").trim(), address: data.get("address").trim(), location: data.get("location").trim(), rent: data.get("rent").trim(), startDate: data.get("startDate"), renewalDate: data.get("renewalDate"), lastPaid: data.get("lastPaid"), payments: [], complaints: [] };
      tenancies.unshift(item);
      if (!save(tenancies)) { tenancies.shift(); message.textContent = "Could not save this tenancy in browser storage."; return; }
      activeId = item.id;
      form.reset();
      message.textContent = "Tenant created. Copy the private link from the tenancy details.";
      render();
      setTimeout(() => { panel.hidden = true; message.textContent = ""; }, 2200);
    });
    render();
  }

  function setupTenant() {
    if (document.body.dataset.dashboard !== "tenant") return;
    const root = document.querySelector("[data-tenant-view]");
    const token = new URLSearchParams(location.search).get("access");
    const item = read().find((entry) => entry.accessToken === token);
    if (!item) {
      root.innerHTML = '<section class="tenant-access-message"><p class="eyebrow">Private tenant access</p><h1>This link is unavailable.</h1><p>Ask your property manager to share the current tenant link with you.</p><a class="text-link" href="index.html">Return to Haybee <span aria-hidden="true">↗</span></a><p class="prototype-caption">This preview stores records in one browser. A connected service is needed for private links to work across devices.</p></section>';
      return;
    }
    const payments = item.payments || [];
    const complaints = item.complaints || [];
    const mostRecent = payments[0];
    const days = daysUntil(item.renewalDate);
    root.innerHTML = `<div class="tenant-welcome"><p class="eyebrow">Your Haybee tenancy</p><h1>Welcome, ${escapeHTML(item.name.split(" ")[0])}.</h1><p class="dashboard-lead">Your rental details and support, all in one place.</p></div><div class="tenant-overview-card"><div><p class="eyebrow">Your home</p><h2>${escapeHTML(item.address)}</h2><p>${escapeHTML(item.location)}</p></div><div class="tenant-renewal"><span>Next renewal</span><strong>${days === null ? "—" : days < 0 ? `${Math.abs(days)} days overdue` : `${days} days`}</strong><span>${dateText(item.renewalDate)}</span></div></div><section class="dashboard-stats tenant-stats"><article><span>Rent</span><strong>${escapeHTML(item.rent)}</strong></article><article><span>Last payment</span><strong>${mostRecent ? dateText(mostRecent.date) : dateText(item.lastPaid)}</strong></article><article><span>Payment status</span><strong>${escapeHTML(mostRecent?.status || "Awaiting record")}</strong></article></section><div class="tenant-page-grid"><section class="tenant-history"><p class="eyebrow">Payment record</p><h2>Your payments</h2>${payments.length ? payments.map((payment) => `<div class="record-row"><div><strong>${escapeHTML(payment.amount)}</strong><span>${escapeHTML(payment.note || "Rent payment")}</span></div><div><strong>${escapeHTML(payment.status)}</strong><span>${dateText(payment.date)}</span></div></div>`).join("") : '<p class="dashboard-muted">Your payment history will appear here once it has been added by property management.</p>'}</section><section class="tenant-request-section"><p class="eyebrow">Property support</p><h2>Send a question or report an issue</h2><p class="dashboard-muted">Your message will be saved to this tenancy for management to review.</p><form class="tenant-request-form"><label>Subject<input name="subject" required maxlength="100" placeholder="e.g. Maintenance request"></label><label>Your message<textarea name="message" required maxlength="1500" rows="5" placeholder="Tell us what you need help with"></textarea></label><button class="button button-dark" type="submit">Send request <span aria-hidden="true">↗</span></button><p class="form-message" data-request-message role="status"></p></form><div class="tenant-request-history"><h3>Previous requests</h3>${complaints.length ? complaints.map((request) => `<article class="request-row"><div class="request-row-top"><span class="eyebrow">${dateText(request.date)}</span><span class="status-pill ${request.status === "Open" ? "status-open" : "status-resolved"}">${escapeHTML(request.status)}</span></div><h3>${escapeHTML(request.subject)}</h3><p>${escapeHTML(request.message)}</p></article>`).join("") : '<p class="dashboard-muted">You have not sent any requests.</p>'}</div></section></div><p class="prototype-caption">Preview workspace: requests are saved in this browser. Email delivery to property management requires the connected service.</p>`;
    root.querySelector(".tenant-request-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      item.complaints.unshift({ id: `request-${Date.now()}`, date: new Date().toISOString().slice(0, 10), subject: data.get("subject").trim(), message: data.get("message").trim(), status: "Open" });
      const all = read();
      const index = all.findIndex((entry) => entry.accessToken === token);
      if (index >= 0) all[index] = item;
      save(all);
      setupTenant();
    });
  }

  document.addEventListener("DOMContentLoaded", () => { setupLandlord(); setupTenant(); });
})();
