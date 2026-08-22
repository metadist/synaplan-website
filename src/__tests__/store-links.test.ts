import { describe, expect, it } from "vitest";
import { storeLinksFor } from "@/lib/constants";

describe("storeLinksFor", () => {
  it("returns German store listings for de locales", () => {
    const links = storeLinksFor("de");
    expect(links.appStore).toContain("apps.apple.com/de/");
    expect(links.playStore).toContain("hl=de");
  });

  it("returns English store listings for other locales", () => {
    const links = storeLinksFor("en");
    expect(links.appStore).toContain("apps.apple.com/us/");
    expect(links.playStore).toContain("hl=en");
  });
});
