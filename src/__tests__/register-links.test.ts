import { describe, expect, it } from "vitest";

import { LINKS, registerUrl } from "@/lib/constants";

describe("sign-up links", () => {
  it("send a plan button to the hosted register page with that plan", () => {
    expect(registerUrl("pro")).toBe("https://web.synaplan.com/register?plan=PRO");
    expect(registerUrl("team")).toBe("https://web.synaplan.com/register?plan=TEAM");
    expect(registerUrl("business")).toBe("https://web.synaplan.com/register?plan=BUSINESS");
  });

  it("no longer point at the old app", () => {
    expect(Object.values(LINKS).join(" ")).not.toContain("app.synaplan.com");
  });
});
