/**
 * Env-var-gated Synaplan chat widget loader.
 *
 * Renders nothing when SYNAPLAN_WIDGET_ID is unset (open-source default).
 * When set, injects the widget ES module script into the page.
 *
 * Env vars:
 *   SYNAPLAN_WIDGET_ID         — widget ID (gate; if empty, widget is disabled)
 *   SYNAPLAN_WIDGET_API_URL    — base URL for widget.js (default: https://web.synaplan.com)
 *   SYNAPLAN_WIDGET_CONFIG     — optional JSON string with extra init options
 */
export function SynaplanWidget() {
  const widgetId = process.env.SYNAPLAN_WIDGET_ID
  if (!widgetId) return null

  const apiUrl = (
    process.env.SYNAPLAN_WIDGET_API_URL || 'https://web.synaplan.com'
  ).replace(/\/+$/, '')

  let extraConfig: Record<string, unknown> = {}
  if (process.env.SYNAPLAN_WIDGET_CONFIG) {
    try {
      extraConfig = JSON.parse(process.env.SYNAPLAN_WIDGET_CONFIG)
    } catch {
      console.error('[SynaplanWidget] Invalid JSON in SYNAPLAN_WIDGET_CONFIG')
    }
  }

  const config = { widgetId, ...extraConfig }

  const script = [
    `import SynaplanWidget from '${apiUrl}/widget.js'`,
    `SynaplanWidget.init(${JSON.stringify(config)})`,
  ].join('\n')

  return (
    <script
      type="module"
      dangerouslySetInnerHTML={{ __html: script }}
    />
  )
}
