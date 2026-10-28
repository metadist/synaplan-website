"use client";

import { useSyncExternalStore } from "react";

/**
 * ASCII codes for the US representative's address.
 * Assembled in the browser so the static HTML has no literal address.
 */
const EMAIL_CODES = [111, 98, 105, 101, 119, 97, 108, 100, 64, 116, 100, 115, 46, 110, 101, 116] as const;

export function decodeOliverUsEmail(): string {
  return String.fromCharCode(...EMAIL_CODES);
}

function subscribe(): () => void {
  return () => {};
}

function addressOnClient(): string {
  return decodeOliverUsEmail();
}

function addressOnServer(): null {
  return null;
}

const controlReset =
  "inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-left font-[inherit]";

/**
 * Clickable email for the US representative.
 * The server HTML shows `label`. After hydration the control shows the
 * address and opens a mailto link.
 */
export function OliverUsEmailLink({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  const address = useSyncExternalStore(subscribe, addressOnClient, addressOnServer);

  if (!address) {
    return (
      <button
        type="button"
        className={`${controlReset} ${className}`}
        onClick={() => {
          window.location.href = `mailto:${decodeOliverUsEmail()}`;
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <a href={`mailto:${address}`} className={`${controlReset} ${className}`}>
      {address}
    </a>
  );
}
