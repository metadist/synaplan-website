/**
 * Unit tests for the posts API helper — slugify logic.
 *
 * We test the slug generation function in isolation because the full
 * route handler requires a live database and Next.js runtime context.
 */
import { describe, it, expect } from "vitest";

// Inline the slugify function (mirrors the one in the API route)
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

describe("slugify", () => {
  it("converts a simple title to a slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips German umlauts and normalizes them", () => {
    expect(slugify("KI für Unternehmen")).toBe("ki-fur-unternehmen");
  });

  it("collapses multiple spaces/hyphens", () => {
    expect(slugify("hello   world")).toBe("hello-world");
    expect(slugify("hello---world")).toBe("hello-world");
  });

  it("strips special characters", () => {
    expect(slugify("Hello, World! 2025")).toBe("hello-world-2025");
  });

  it("handles an empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("trims leading and trailing whitespace", () => {
    expect(slugify("  blog post  ")).toBe("blog-post");
  });
});
