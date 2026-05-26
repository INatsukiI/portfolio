export const OS = {
  // backgrounds
  desktop:     '#080c14',
  desktopDark: '#050810',
  wallDot:     'rgba(0,212,255,0.06)',

  // glass surfaces
  chrome:      'rgba(8,20,40,0.85)',
  chromeLite:  'rgba(255,255,255,0.06)',
  chromeHi:    'rgba(0,212,255,0.12)',
  chromeFg:    '#c8d8e8',

  // content area
  body:        'rgba(6,14,28,0.9)',
  bodyAlt:     'rgba(10,24,48,0.8)',
  bodyEdge:    'rgba(0,212,255,0.15)',
  bodyShade:   'rgba(0,0,0,0.4)',

  // text
  ink:         '#0a0f1a',
  inkSoft:     'rgba(200,216,232,0.5)',

  // accent
  accent:      '#00d4ff',
  accentDim:   'rgba(0,212,255,0.15)',

  // status colors
  red:         '#ff4d6a',
  redDark:     '#cc2a44',
  yellow:      '#ffd23f',
  yellowDark:  '#cc9a00',
  blue:        '#4d9fff',
  blueDark:    '#2a6acc',
  teal:        '#00d4ff',
  green:       '#00ff9f',
  greenDark:   '#00cc7a',
  white:       '#e8f4ff',

  // shadow/glow
  shadow:      'rgba(0,212,255,0.08)',
} as const

export type OSKey = keyof typeof OS
