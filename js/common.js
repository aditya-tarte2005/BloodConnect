/* =========================================================
   BLOODCONNECT COMMON JAVASCRIPT
   ========================================================= */


/* =========================================================
   SIDEBAR / HAMBURGER MENU
   ========================================================= */

function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle("open");
}


/* Close sidebar when clicking outside on mobile */

document.addEventListener(
    "click",
    function (event) {

        const sidebar =
            document.querySelector(".sidebar");

        const menuButton =
            document.querySelector(".menu-btn");

        if (!sidebar || !menuButton) {
            return;
        }

        if (window.innerWidth <= 950) {

            if (
                sidebar.classList.contains("open") &&
                !sidebar.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                sidebar.classList.remove("open");

            }

        }

    }
);


/* Close sidebar with Escape */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            const sidebar =
                document.querySelector(".sidebar");

            if (sidebar) {

                sidebar.classList.remove("open");

            }

        }

    }
);


/* =========================================================
   NOTIFICATION SYSTEM
   ========================================================= */

(() => {

    const api =
        window.BloodConnectApi;


    const icon =
        document.querySelector(
            ".top-user .notification, .topbar-right .notification"
        );


    if (!icon) {
        return;
    }


    /* =====================================================
       CREATE NOTIFICATION AREA
       ===================================================== */

    let area =
        icon.closest(".notification-area");


    if (!area) {

        area =
            document.createElement("div");

        area.className =
            "notification-area";

        icon.parentNode.insertBefore(
            area,
            icon
        );

        area.append(icon);

    }


    /* =====================================================
       CREATE NOTIFICATION MENU
       ===================================================== */

    let menu =
        document.getElementById(
            "notificationMenu"
        );


    if (!menu) {

        menu =
            document.createElement("div");

        menu.id =
            "notificationMenu";

        menu.className =
            "notification-menu";

        menu.setAttribute(
            "role",
            "region"
        );

        menu.setAttribute(
            "aria-label",
            "Notifications"
        );

        area.append(menu);

    }


    /* =====================================================
       ACCESSIBILITY
       ===================================================== */

    icon.setAttribute(
        "role",
        "button"
    );

    icon.setAttribute(
        "tabindex",
        "0"
    );

    icon.setAttribute(
        "aria-label",
        "Notifications"
    );

    icon.setAttribute(
        "aria-haspopup",
        "true"
    );

    icon.setAttribute(
        "aria-expanded",
        "false"
    );


    /* =====================================================
       CREATE ELEMENT HELPER
       ===================================================== */

    const make =
        (
            tag,
            text,
            className
        ) => {

            const node =
                document.createElement(tag);


            if (text) {

                node.textContent =
                    text;

            }


            if (className) {

                node.className =
                    className;

            }


            return node;

        };


    /* =====================================================
       LOAD NOTIFICATIONS
       ===================================================== */

    async function refresh() {

        const header =
            make(
                "div",
                null,
                "notification-header"
            );


        header.append(
            make(
                "strong",
                "Notifications"
            )
        );


        let items = [];


        try {

            if (!api) {

                throw new Error(
                    "Notification service unavailable."
                );

            }


            items =
                await api.get(
                    "/notifications"
                );


            /*
             * Make sure API response is an array.
             */

            if (!Array.isArray(items)) {

                items = [];

            }


        } catch (error) {

            /*
             * Backend is currently unavailable.
             * We DO NOT close the menu.
             * We simply show a friendly message.
             */

            menu.replaceChildren(

                header,

                make(
                    "p",
                    "Notifications are unavailable while the backend is offline.",
                    "notification-empty"
                )

            );


            /*
             * Keep the notification badge visible
             * with demo count.
             */

            const badge =
                icon.querySelector("b") ||
                icon.appendChild(
                    make("b")
                );


            badge.textContent =
                "3";

            badge.hidden =
                false;


            return;

        }


        /* =================================================
           BADGE
           ================================================= */

        const badge =
            icon.querySelector("b") ||
            icon.appendChild(
                make("b")
            );


        badge.textContent =
            String(items.length);


        badge.hidden =
            items.length === 0;


        /* =================================================
           HEADER
           ================================================= */

        header.append(

            make(
                "span",
                items.length
                    ? `${items.length} active`
                    : "All clear"
            )

        );


        const children = [

            header,

            make(
                "hr"
            )

        ];


        /* =================================================
           EMPTY
           ================================================= */

        if (!items.length) {

            children.push(

                make(
                    "p",
                    "You're all caught up.",
                    "notification-empty"
                )

            );

        }


        /* =================================================
           NOTIFICATION ITEMS
           ================================================= */

        else {

            items.forEach(
                item => {

                    const entry =
                        make(
                            "div",
                            null,
                            `notification-item notification-${item.type || "info"}`
                        );


                    entry.append(

                        make(
                            "strong",
                            item.title || "Notification"
                        ),

                        make(
                            "small",
                            item.message || ""
                        ),

                        make(
                            "span",
                            item.time || ""
                        )

                    );


                    children.push(
                        entry
                    );

                }
            );

        }


        menu.replaceChildren(
            ...children
        );

    }


    /* =====================================================
       TOGGLE NOTIFICATION MENU
       ===================================================== */

    function toggleNotificationMenu() {

        const open =
            !menu.classList.contains(
                "show"
            );


        menu.classList.toggle(
            "show",
            open
        );


        icon.setAttribute(
            "aria-expanded",
            String(open)
        );


        if (open) {

            /*
             * Load notifications after menu opens.
             * If backend is offline, refresh() handles it.
             */

            refresh();

        }

    }


    /*
     * Make function globally available.
     *
     * This is important because some pages already use:
     *
     * onclick="toggleNotificationMenu()"
     */

    window.toggleNotificationMenu =
        toggleNotificationMenu;


    /* =====================================================
       IMPORTANT:
       ONLY ADD OUR OWN CLICK HANDLER IF THE PAGE DOES NOT
       ALREADY HAVE onclick="toggleNotificationMenu()"
       ===================================================== */

    const hasInlineHandler =
        icon.hasAttribute(
            "onclick"
        );


    if (!hasInlineHandler) {

        icon.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                toggleNotificationMenu();

            }
        );

    }


    /* =====================================================
       KEYBOARD SUPPORT
       ===================================================== */

    icon.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                toggleNotificationMenu();

            }

        }
    );


    /* =====================================================
       CLOSE WHEN CLICKING OUTSIDE
       ===================================================== */

    document.addEventListener(
        "click",
        function (event) {

            if (
                !area.contains(
                    event.target
                )
            ) {

                menu.classList.remove(
                    "show"
                );

                icon.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* =====================================================
       CLOSE WITH ESCAPE
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                menu.classList.remove(
                    "show"
                );

                icon.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    refresh();

})();