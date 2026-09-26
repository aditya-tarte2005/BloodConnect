(() => {
  const api = window.BloodConnectApi;
  const icon = document.querySelector(".top-user .notification, .topbar-right .notification");
  if (!icon) return;

  let area = icon.closest(".notification-area");
  if (!area) {
    area = document.createElement("div");
    area.className = "notification-area";
    icon.parentNode.insertBefore(area, icon);
    area.append(icon);
  }

  let menu = document.getElementById("notificationMenu");
  if (!menu) {
    menu = document.createElement("div");
    menu.id = "notificationMenu";
    menu.className = "notification-menu";
    menu.setAttribute("role", "region");
    menu.setAttribute("aria-label", "Notifications");
    area.append(menu);
  }

  icon.setAttribute("role", "button");
  icon.setAttribute("tabindex", "0");
  icon.setAttribute("aria-label", "Notifications");
  icon.setAttribute("aria-haspopup", "true");
  icon.setAttribute("aria-expanded", "false");

  const make = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };

  async function refresh() {
    const header = make("div", null, "notification-header");
    header.append(make("strong", "Notifications"));
    let items = [];
    try {
      if (!api) throw new Error("The notification service is unavailable.");
      items = await api.get("/notifications");
    } catch (error) {
      menu.replaceChildren(header, make("p", error.message || "Could not load notifications.", "notification-empty"));
      return;
    }

    const badge = icon.querySelector("b") || icon.appendChild(make("b"));
    badge.textContent = String(items.length);
    badge.hidden = items.length === 0;
    header.append(make("span", items.length ? `${items.length} active` : "All clear"));
    const children = [header, make("hr")];
    if (!items.length) {
      children.push(make("p", "You’re all caught up.", "notification-empty"));
    } else {
      items.forEach(item => {
        const entry = make("div", null, `notification-item notification-${item.type}`);
        entry.append(make("strong", item.title), make("small", item.message), make("span", item.time));
        children.push(entry);
      });
    }
    menu.replaceChildren(...children);
  }

  function toggle() {
    const open = !menu.classList.contains("show");
    menu.classList.toggle("show", open);
    icon.setAttribute("aria-expanded", String(open));
    if (open) refresh();
  }

  window.toggleNotificationMenu = toggle;
  icon.addEventListener("click", event => { event.stopPropagation(); toggle(); });
  icon.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); }
  });
  document.addEventListener("click", event => {
    if (!area.contains(event.target)) {
      menu.classList.remove("show");
      icon.setAttribute("aria-expanded", "false");
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      menu.classList.remove("show");
      icon.setAttribute("aria-expanded", "false");
    }
  });
  refresh();
})();
