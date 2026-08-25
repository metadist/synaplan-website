import { LINKS } from "@/lib/constants";

type OsbaMemberBadgeProps = {
  hint: string;
};

/** OSBA membership mark + localized hint, linking to osb-alliance.de. */
export function OsbaMemberBadge({ hint }: OsbaMemberBadgeProps) {
  return (
    <a
      href={LINKS.osba}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex max-w-md items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12141f]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/osba-member.png"
        alt=""
        width={400}
        height={200}
        decoding="async"
        className="h-14 w-auto rounded-md bg-white shadow-sm"
      />
      <span className="text-left text-sm leading-snug text-neutral-400 transition-colors group-hover:text-white">
        {hint}
      </span>
    </a>
  );
}
