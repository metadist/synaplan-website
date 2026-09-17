/** Classic-menu routes whose content now lives on a Mission Control page. */
export const LEGACY_REDIRECTS = [
  { source: "/features", destination: "/product" },
  { source: "/features/connections", destination: "/connect" },
  { source: "/features/mcp", destination: "/connect" },
  { source: "/solutions/companies", destination: "/product" },
  { source: "/solutions/developers", destination: "/source" },
  { source: "/solutions/memories", destination: "/features/memories" },
] as const;

export function nextConfigLegacyRedirects() {
  return LEGACY_REDIRECTS.flatMap(({ source, destination }) => [
    { source, destination, permanent: true as const },
    { source: `/de${source}`, destination: `/de${destination}`, permanent: true as const },
  ]);
}
