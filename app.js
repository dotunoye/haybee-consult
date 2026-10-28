const properties = {
  crest: {
    name: "The Crest Residences",
    location: "Ikoyi, Lagos",
    price: "₦420M",
    purpose: "For sale",
    type: "Apartment",
    title: "Certificate of Occupancy",
    beds: "4 bedrooms",
    baths: "4 bathrooms",
    area: "3,800 sq ft",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=85",
    description: "A spacious private residence in one of Ikoyi's established neighbourhoods. Generous living areas, considered finishes, and excellent access to the island's business and leisure destinations.",
    features: ["Private balcony", "Secure parking", "Residents' gym", "24-hour security"]
  },
  vantage: {
    name: "Vantage Court",
    location: "Victoria Island, Lagos",
    price: "₦690M",
    purpose: "For sale",
    type: "Penthouse",
    title: "Governor's Consent",
    beds: "5 bedrooms",
    baths: "5 bathrooms",
    area: "5,200 sq ft",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=85",
    description: "A penthouse residence with expansive proportions and a central Victoria Island address. The home is suited to buyers seeking a private, full-service city residence.",
    features: ["Private terrace", "Lift access", "Dedicated parking", "Concierge service"]
  },
  azure: {
    name: "Azure Bay Villas",
    location: "Epe Express, Lagos",
    price: "₦550M",
    purpose: "For sale",
    type: "Villa",
    title: "Certificate of Occupancy",
    beds: "4 bedrooms",
    baths: "4 bathrooms",
    area: "4,600 sq ft",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85",
    description: "A contemporary four-bedroom villa in a growing Lagos corridor, offering a generous private footprint and easy access to the Lekki-Epe Expressway.",
    features: ["Private garden", "En-suite bedrooms", "Family lounge", "Gated community"]
  },
  saffron: {
    name: "Saffron Walk",
    location: "Guzape, Abuja",
    price: "₦38M / year",
    purpose: "For rent",
    type: "Townhouse",
    title: "Title verified",
    beds: "3 bedrooms",
    baths: "3 bathrooms",
    area: "2,900 sq ft",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=85",
    description: "An elegant townhouse in Guzape with practical family spaces and a calm residential setting, within easy reach of Abuja's central districts.",
    features: ["Fitted kitchen", "Private parking", "Gated estate", "Backup power"]
  },
  marina: {
    name: "Marina Terrace",
    location: "Lekki Phase 1, Lagos",
    price: "₦94M / year",
    purpose: "For rent",
    type: "Furnished apartment",
    title: "Title verified",
    beds: "2 bedrooms",
    baths: "2 bathrooms",
    area: "1,850 sq ft",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=85",
    description: "A furnished apartment in Lekki Phase 1 designed for comfortable, convenient city living, with nearby dining, retail, and business destinations.",
    features: ["Furnished", "Serviced building", "Secure parking", "Generator backup"]
  },
  autumn: {
    name: "Autumn Crown",
    location: "Asokoro, Abuja",
    price: "₦215M",
    purpose: "Sold",
    type: "Villa",
    title: "Transaction completed",
    beds: "5 bedrooms",
    baths: "4 bathrooms",
    area: "4,900 sq ft",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=85",
    description: "A substantial private villa in Asokoro, presented here as a representative example of our residential portfolio and completed transactions.",
    features: ["Private garden", "Five bedrooms", "Secure parking", "Gated residence"]
  },
  cedar: {
    name: "Cedar Heights",
    location: "Ikeja GRA, Lagos",
    price: "₦56M / year",
    purpose: "For rent",
    type: "Serviced apartment",
    title: "Title verified",
    beds: "3 bedrooms",
    baths: "3 bathrooms",
    area: "2,300 sq ft",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85",
    description: "A well-appointed serviced apartment in Ikeja GRA with easy access to the airport, commercial districts, and the area's established amenities.",
    features: ["Serviced residence", "On-site security", "Parking", "Backup power"]
  },
  northline: {
    name: "Northline Estate",
    location: "Gwarinpa, Abuja",
    price: "₦310M",
    purpose: "For sale",
    type: "Townhouse",
    title: "Certificate of Occupancy",
    beds: "4 bedrooms",
    baths: "3 bathrooms",
    area: "3,700 sq ft",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    description: "A family townhouse in a well-connected Gwarinpa neighbourhood, with a thoughtful layout and generous space for everyday living.",
    features: ["Private outdoor space", "Family lounge", "Secure estate", "Dedicated parking"]
  }
};

function setupNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const dropdown = document.querySelector(".nav-dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");

  const updateHeader = () => {
    if (header) {
      const alwaysGlass = document.body.classList.contains("property-page") || document.body.classList.contains("portal-page");
      header.classList.toggle("scrolled", window.scrollY > 24 || alwaysGlass);
    }
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    header?.classList.toggle("menu-open", !expanded);
  });

  dropdownToggle?.addEventListener("click", () => {
    const expanded = dropdownToggle.getAttribute("aria-expanded") === "true";
    dropdownToggle.setAttribute("aria-expanded", String(!expanded));
    dropdown?.classList.toggle("open", !expanded);
  });

  document.addEventListener("click", (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
      dropdownToggle?.setAttribute("aria-expanded", "false");
    }

    if (header && toggle && !header.contains(event.target) && header.classList.contains("menu-open")) {
      header.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      header?.classList.remove("menu-open");
      dropdown?.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
      dropdownToggle?.setAttribute("aria-expanded", "false");
    }
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header?.classList.remove("menu-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });
}

function setupReveals() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

function setupForms() {
  document.querySelectorAll("[data-feedback-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const message = form.querySelector(".form-message");
      if (!form.reportValidity()) return;

      if (message) {
        message.textContent = "Thank you. Your details are ready for our team. This preview does not send enquiries to a server yet.";
      }
      form.reset();
    });
  });
}

function setupPropertyFilters() {
  const cards = [...document.querySelectorAll("[data-property-card]")];
  if (!cards.length) return;

  const purpose = document.querySelector("[data-filter-purpose]");
  const type = document.querySelector("[data-filter-type]");
  const bedrooms = document.querySelector("[data-filter-beds]");
  const status = document.querySelector("[data-filter-status]");
  const price = document.querySelector("[data-filter-price]");
  const priceLabel = document.querySelector("[data-price-label]");
  const count = document.querySelector("[data-filter-count]");
  const emptyState = document.querySelector("[data-empty-state]");

  const applyFilters = () => {
    let visibleCount = 0;
    const maxPrice = Number(price?.value || 900);
    cards.forEach((card) => {
      const matchesPurpose = !purpose || purpose.value === "all" || card.dataset.purpose === purpose.value;
      const matchesType = !type || type.value === "all" || card.dataset.type === type.value;
      const matchesBeds = !bedrooms || Number(card.dataset.beds) >= Number(bedrooms.value);
      const matchesStatus = !status || status.value === "all" || card.dataset.status === status.value;
      const matchesPrice = !price || Number(card.dataset.price) <= maxPrice;
      const visible = matchesPurpose && matchesType && matchesBeds && matchesStatus && matchesPrice;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (count) count.textContent = `${visibleCount} ${visibleCount === 1 ? "property" : "properties"}`;
    if (emptyState) emptyState.hidden = visibleCount > 0;
    if (priceLabel) priceLabel.textContent = `Up to ₦${maxPrice}M`;
  };

  [purpose, type, bedrooms, status].forEach((filter) => filter?.addEventListener("change", applyFilters));
  price?.addEventListener("input", applyFilters);
  applyFilters();
}

function renderPropertyDetail() {
  const container = document.querySelector("[data-property-detail]");
  if (!container) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const property = id ? properties[id] : null;
  if (!property) {
    container.innerHTML = '<div class="detail-not-found"><h1>Property not found</h1><p>This listing may no longer be available.</p><a class="text-link" href="properties.html">Return to properties <span aria-hidden="true">↗</span></a></div>';
    return;
  }

  document.title = `${property.name} | Haybee Consults`;
  container.innerHTML = `
    <article class="detail-layout">
      <div class="detail-image"><img src="${property.image}" alt="${property.name} in ${property.location}"></div>
      <div class="detail-copy">
        <p class="eyebrow">${property.location} / ${property.purpose}</p>
        <h1>${property.name}</h1>
        <strong class="detail-price">${property.price}</strong>
        <p class="detail-description">${property.description}</p>
        <dl class="detail-facts">
          <div><dt>Property type</dt><dd>${property.type}</dd></div>
          <div><dt>Bedrooms</dt><dd>${property.beds}</dd></div>
          <div><dt>Bathrooms</dt><dd>${property.baths}</dd></div>
          <div><dt>Floor area</dt><dd>${property.area}</dd></div>
          <div><dt>Title status</dt><dd>${property.title}</dd></div>
          <div><dt>Location</dt><dd>${property.location}</dd></div>
        </dl>
        <p class="eyebrow">Property highlights</p>
        <ul class="dash-list detail-features">${property.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
        <div class="detail-cta-row">
          <a class="button button-dark" href="contact.html?property=${encodeURIComponent(property.name)}">Request a private viewing <span aria-hidden="true">↗</span></a>
          <a class="button button-outline-dark" href="https://wa.me/2347000000000?text=${encodeURIComponent(`Hello Haybee Consults, I would like more details about ${property.name}.`)}" target="_blank" rel="noopener noreferrer">WhatsApp the team</a>
        </div>
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupReveals();
  setupForms();
  setupPropertyFilters();
  renderPropertyDetail();

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const requestedProperty = new URLSearchParams(window.location.search).get("property");
  const messageField = document.querySelector('textarea[name="message"]');
  if (requestedProperty && messageField) {
    messageField.value = `I'm interested in ${requestedProperty}. Please contact me with more information.`;
  }
});
