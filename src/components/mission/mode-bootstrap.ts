/**
 * Server-safe constants for the Marketing/Engineer mode bootstrap.
 * Kept free of React imports so the layout (a Server Component) can inline it.
 */
export const MODE_STORAGE_KEY = "mc-mode";

/** Inline bootstrap — runs before paint, so engineer mode never flashes. */
export const MODE_BOOTSTRAP_SCRIPT = `(function(){try{if(localStorage.getItem("${MODE_STORAGE_KEY}")==="engineer"){document.documentElement.setAttribute("data-mc-mode","engineer")}}catch(e){}})();`;
