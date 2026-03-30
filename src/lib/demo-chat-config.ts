/** Max user messages per browser session (server-enforced; align with Cloudflare rules). */
export const DEMO_CHAT_MESSAGE_LIMIT = 10;

/** Hard cap on streamed request size (backend uses GET query for /messages/stream). */
export const DEMO_CHAT_MAX_MESSAGE_CHARS = 2000;

export const DEMO_CHAT_COOKIE = "sp_demo_chat";

/** Session cookie max-age (seconds). */
export const DEMO_CHAT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
