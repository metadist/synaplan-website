import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { decodeOliverUsEmail } from "@/components/oliver-us-email";

const ADDRESS = "obiewald@tds.net";

const PUBLIC_SOURCES = [
  "src/components/oliver-us-email.tsx",
  "src/app/[locale]/(site)/about/team/page.tsx",
  "src/app/[locale]/(site)/contact/page.tsx",
  "src/messages/en.json",
  "src/messages/de.json",
];

describe("US representative email", () => {
  it("decodes to Oliver Biewald's address", () => {
    expect(decodeOliverUsEmail()).toBe(ADDRESS);
  });

  it("does not put that address in the pages or the component source", () => {
    for (const file of PUBLIC_SOURCES) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(source, file).not.toContain(ADDRESS);
    }
  });
});
