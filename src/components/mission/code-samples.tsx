import { Terminal } from "./primitives";

/** Real commands — these match the public README / Helm chart docs. */

export function ComposeSample() {
  return (
    <Terminal title="laptop · docker compose">
      <span className="mc-tok-dim">$ </span>
      <span className="mc-tok-cmd">git clone</span> https://github.com/metadist/synaplan.git{"\n"}
      <span className="mc-tok-dim">$ </span>
      <span className="mc-tok-cmd">cd</span> synaplan{"\n"}
      <span className="mc-tok-dim">$ </span>
      <span className="mc-tok-cmd">docker compose</span> up -d{"\n"}
      {"\n"}
      <span className="mc-tok-dim"># optional: local models on your own hardware</span>
      {"\n"}
      <span className="mc-tok-dim">$ </span>
      <span className="mc-tok-key">COMPOSE_PROFILES</span>=local-ai <span className="mc-tok-cmd">docker compose</span> up -d{"\n"}
      {"\n"}
      <span className="mc-tok-str">→ http://localhost:5173</span>
      <span className="mc-cursor" />
    </Terminal>
  );
}

export function HelmSample() {
  return (
    <Terminal title="cluster · kubernetes / helm">
      <span className="mc-tok-dim">$ </span>
      <span className="mc-tok-cmd">helm install</span> synaplan \{"\n"}
      {"    "}oci://ghcr.io/metadist/synaplan-charts/synaplan \{"\n"}
      {"    "}--namespace synaplan --create-namespace \{"\n"}
      {"    "}-f values.yaml{"\n"}
      {"\n"}
      <span className="mc-tok-dim"># GPU inference sidecar (optional)</span>
      {"\n"}
      <span className="mc-tok-dim">$ </span>
      <span className="mc-tok-cmd">helm install</span> triton oci://ghcr.io/metadist/synaplan-charts/triton{"\n"}
      {"\n"}
      <span className="mc-tok-str">→ deployment/synaplan-web  3/3 ready</span>
      <span className="mc-cursor" />
    </Terminal>
  );
}

export function InspectSample({ title, rows }: { title: string; rows: { key: string; value: string }[] }) {
  const width = Math.max(...rows.map((r) => r.key.length)) + 2;
  return (
    <Terminal title="engineer mode">
      <span className="mc-tok-dim">$ </span>
      <span className="mc-tok-cmd">{title}</span>
      {"\n\n"}
      {rows.map((r) => (
        <span key={r.key}>
          <span className="mc-tok-key">{r.key.padEnd(width, " ")}</span>
          <span className={r.key === "lock-in" ? "mc-tok-warn" : r.key === "parrot" ? "mc-tok-str" : undefined}>{r.value}</span>
          {"\n"}
        </span>
      ))}
    </Terminal>
  );
}

export function ApiSample() {
  return (
    <Terminal title="api · anthropic-compatible gateway">
      <span className="mc-tok-dim">$ </span>
      <span className="mc-tok-cmd">curl</span> https://your-synaplan.example/api/v1/messages \{"\n"}
      {"    "}-H <span className="mc-tok-str">&quot;Authorization: Bearer $SYNAPLAN_KEY&quot;</span> \{"\n"}
      {"    "}-d <span className="mc-tok-str">&apos;{`{"model":"default","messages":[{"role":"user","content":"Summarise /contracts/2026-Q3"}]}`}&apos;</span>
      {"\n\n"}
      <span className="mc-tok-dim">{`{ "role": "assistant", "content": "...", "sources": [ "contracts/2026-Q3/frame-agreement.pdf#p4" ] }`}</span>
    </Terminal>
  );
}
