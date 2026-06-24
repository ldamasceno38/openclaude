import chalk from 'chalk'
import { supportsHyperlinks } from '../../ink/supports-hyperlinks.js'

// OSC 8 hyperlink escape. Empty params (;;) is the exact prefix ansi-tokenize
// recognizes (see ink/render-node-to-output.ts), so Ink preserves it through
// the spinner's <Text> and the terminal renders it clickable.
const OSC = ']'
const BEL = ''

export type SponsorLink = {
  /** Sponsor name to show in the badge — a clickable hyperlink when supported. */
  display: string
  /**
   * Trailing text appended after the tip body. Empty when the name is already
   * a working hyperlink; otherwise the dimmed raw URL so the destination is
   * still reachable on terminals without OSC 8 support.
   */
  trailing: string
}

/**
 * Render a sponsor/advertiser name as a clickable link to its click URL (an ad
 * tracker like trygravity, or the sponsor's site). The long URL becomes the
 * hidden link target so the status line stays clean while clicks still hit the
 * tracker that records them — attribution and payout are unchanged.
 *
 * Degrades gracefully:
 *   - no url           → plain name, nothing trailing
 *   - OSC 8 supported  → "Name ↗" hyperlinked to url, nothing trailing
 *   - no OSC 8 support → plain name + the dimmed raw url at the end of the line
 *                        (current behavior — never lose the click target)
 */
export function renderSponsorLink(name: string, url: string | undefined): SponsorLink {
  const link = url?.trim()
  if (!link) return { display: name, trailing: '' }
  if (supportsHyperlinks()) {
    return { display: `${OSC}8;;${link}${BEL}${name} ↗${OSC}8;;${BEL}`, trailing: '' }
  }
  return { display: name, trailing: ` ${chalk.dim(link)}` }
}
