import { describe, expect, it } from "vitest";
import { storeLinksFor, storeUrlWithCampaign } from "@/lib/constants";

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

  it("adds a campaign tag without dropping an existing query", () => {
    const tagged = storeUrlWithCampaign(
      "https://play.google.com/store/apps/details?id=com.synaplan.app&hl=de",
    );
    expect(tagged).toContain("id=com.synaplan.app");
    expect(tagged).toContain("hl=de");
    expect(tagged).toContain("ct=website-app");
  });
});
