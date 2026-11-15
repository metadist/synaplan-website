"use client";

/**
 * Public website widget. The id is the embed identifier from the snippet
 * on synaplan.com — it is meant to ship in page source, and it is not an
 * API key.
 */
const WIDGET_ID = "wdg_095ab093966991158f9957f42ae8b4f2";
const WIDGET_SRC = "https://web.synaplan.com/widget.js";
const API_URL = "https://web.synaplan.com";

const WIDGET_CONFIG = {
  widgetId: WIDGET_ID,
  apiUrl: API_URL,
  position: "bottom-right" as const,
  primaryColor: "#13224e",
  iconColor: "#ffffff",
  defaultTheme: "light" as const,
  autoOpen: false,
  autoMessage: "Hi, Hallo und guten Tag - I am the Synaplan AI support bot, how can I help?",
  messageLimit: 50,
  maxFileSize: 10,
  allowFileUpload: false,
  fileUploadLimit: 3,
  lazy: true,
  hideButton: true,
  buttonIconUrl:
    "https://web.synaplan.com/api/v1/files/uploads/widget-icons/02/000/00002/2026/03/wicon_85b9894bf6117c1c_1773235373.svg",
};

type WidgetApi = {
  init: (config: typeof WIDGET_CONFIG) => void;
  open: () => Promise<void> | void;
};

declare global {
  interface Window {
    __synaplanSupportWidget?: WidgetApi;
  }
}

export type OpenSupportWidgetResult = "opened" | "blocked" | "failed";

let loading: Promise<WidgetApi> | null = null;

function loadWidget(): Promise<WidgetApi> {
  if (window.__synaplanSupportWidget) return Promise.resolve(window.__synaplanSupportWidget);
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const ready = () => {
      cleanup();
      const api = window.__synaplanSupportWidget;
      if (api) resolve(api);
      else reject(new Error("Synaplan widget did not register"));
    };
    const fail = () => {
      cleanup();
      reject(new Error("Synaplan widget failed to load"));
    };
    const cleanup = () => {
      window.removeEventListener("synaplan-support-widget-ready", ready);
      window.removeEventListener("synaplan-support-widget-error", fail);
    };

    window.addEventListener("synaplan-support-widget-ready", ready);
    window.addEventListener("synaplan-support-widget-error", fail);

    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      try {
        const SynaplanWidget = (await import(${JSON.stringify(WIDGET_SRC)})).default
        window.__synaplanSupportWidget = SynaplanWidget
        SynaplanWidget.init(${JSON.stringify(WIDGET_CONFIG)})
        window.dispatchEvent(new Event("synaplan-support-widget-ready"))
      } catch (error) {
        window.dispatchEvent(new Event("synaplan-support-widget-error"))
      }
    `;
    document.head.appendChild(script);
  });

  loading.catch(() => {
    loading = null;
  });

  return loading;
}

/** Opens the website widget. A refused host is reported so the button can say why. */
export async function openSupportWidget(): Promise<OpenSupportWidgetResult> {
  try {
    const probe = await fetch(`${API_URL}/api/v1/widget/${WIDGET_ID}/config`, {
      headers: { "X-Widget-Host": window.location.host },
    });
    if (probe.status === 403) return "blocked";
    if (!probe.ok) return "failed";

    const api = await loadWidget();
    await api.open();
    return "opened";
  } catch {
    return "failed";
  }
}
