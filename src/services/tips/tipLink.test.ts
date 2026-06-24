import { describe, expect, test } from 'bun:test'
import { renderSponsorLink } from './tipLink.js'

// OSC 8 control bytes.
const ESC = ']'
const BEL = ''

describe('renderSponsorLink', () => {
  test('no url → plain name, nothing trailing, no escapes', () => {
    const r = renderSponsorLink('Vultr', undefined)
    expect(r.display).toBe('Vultr')
    expect(r.trailing).toBe('')
    expect(r.display).not.toContain(ESC)
  })

  test('blank url is treated as no url', () => {
    expect(renderSponsorLink('Vultr', '   ')).toEqual({ display: 'Vultr', trailing: '' })
  })

  test('with a url, the destination is always reachable (link or fallback)', () => {
    const url = 'https://api.trygravity.ai/track/click?p=loooong'
    const r = renderSponsorLink('Vultr', url)
    if (r.display.includes(ESC)) {
      // OSC 8 supported: name is wrapped as a hyperlink to the full url, no
      // trailing raw url, and the long url is NOT shown as visible text.
      expect(r.display).toBe(`${ESC}8;;${url}${BEL}Vultr ↗${ESC}8;;${BEL}`)
      expect(r.trailing).toBe('')
    } else {
      // Fallback: plain name + dimmed raw url at the end (current behavior).
      expect(r.display).toBe('Vultr')
      expect(r.trailing).toContain(url)
    }
  })
})
