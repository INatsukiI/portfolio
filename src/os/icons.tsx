import type { CSSProperties, ReactNode } from 'react'
import { OS } from './theme'

interface OSIconProps {
  p: string
  legend: Record<string, string>
  size?: number
  style?: CSSProperties
}

export function OSIcon({ p, legend, size = 48, style }: OSIconProps) {
  const lines = p.trim().split('\n')
  const rects: ReactNode[] = []
  for (let y = 0; y < lines.length; y++) {
    let runStart = -1, runColor: string | null = null
    for (let x = 0; x < lines[y].length; x++) {
      const c = lines[y][x]
      const col = legend[c]
      if (col === runColor) {
        // extend run
      } else {
        if (runColor) rects.push(<rect key={`${y}-${runStart}`} x={runStart} y={y} width={x - runStart} height={1} fill={runColor} />)
        runColor = col || null
        runStart = x
      }
    }
    if (runColor) rects.push(<rect key={`${y}-${runStart}-end`} x={runStart} y={y} width={lines[y].length - runStart} height={1} fill={runColor} />)
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', display: 'block', ...style }} shapeRendering="crispEdges">
      {rects}
    </svg>
  )
}

export const ICONS = {
  about: {
    p: `
................
......aabb......
.....abbbba.....
....abbbbbba....
....abbccbba....
.....abccba.....
......addda.....
....eeeeeee.....
...effdddffe....
...effdddffe....
...effdddffe....
...effdddffe....
...effdddffe....
....fffffff.....
....fff.fff.....
....ff...ff.....
`,
    legend: { a: OS.chrome, b: OS.bodyEdge, c: OS.ink, d: OS.red, e: OS.chromeLite, f: OS.blue },
  },
  skills: {
    p: `
.aaaaaaaaaaaaaa.
.a............a.
.a..bb........a.
.a..bb..cc....a.
.a..bb..cc..dd a.
.a..bb..cc..dd.a.
.a..bb..cc..dd.a.
.a..bb..cc..dd.a.
.a..bb..cc..dd.a.
.a..bb..cc..dd.a.
.a..bb..cc..dd.a.
.a............a.
.a............a.
.a............a.
.aaaaaaaaaaaaaa.
................
`,
    legend: { a: OS.chrome, b: OS.red, c: OS.yellow, d: OS.blue },
  },
  projects: {
    p: `
................
....aaaaa.......
....a...aaaaaaa.
....bbbbbbbbbba.
....bccccccccba.
....bcddddddcba.
....bcdeeeedcba.
....bcdeffedcba.
....bcdeffedcba.
....bcdeeeedcba.
....bcddddddcba.
....bccccccccba.
....bbbbbbbbbba.
....aaaaaaaaaa..
................
................
`,
    legend: { a: OS.chrome, b: OS.yellowDark, c: OS.yellow, d: OS.bodyEdge, e: OS.body, f: OS.blue },
  },
  career: {
    p: `
................
.aaaaaaaaaaaaa..
.abbbbbbbbbbba..
.abccccccccccba.
.abc...c....cba.
.abcccccccccccb.
.abc...c....cba.
.abcccccccccccb.
.abc...c....cba.
.abcccccccccccb.
.abc...c....cba.
.abcccccccccccb.
.abbbbbbbbbbbba.
.aaaaaaaaaaaaaa.
.deeeeeeeeeeeed.
.aaaaaaaaaaaaaa.
`,
    legend: { a: OS.chrome, b: OS.bodyEdge, c: OS.ink, d: OS.chromeLite, e: OS.red },
  },
  contact: {
    p: `
................
.aaaaaaaaaaaaa..
.abbbbbbbbbbba..
.acbbbbbbbbbca..
.aaccbbbbbbcca..
.aaaccbbbbcca a.
.aaa accccca aa.
.aaa..aaaaa..aa.
.aaa.........aa.
.aaa.........aa.
.aaaaaaaaaaaaaa.
.aaaaaaaaaaaaaa.
................
................
................
................
`,
    legend: { a: OS.chrome, b: OS.bodyEdge, c: OS.red },
  },
  readme: {
    p: `
................
..aaaaaaaaaaa...
..abbbbbbbbba...
..abcccccccba...
..abccdccccba...
..abccccccccba..
..abccdcccdcba..
..abccccccccba..
..abccdccccba...
..abccccccccba..
..abccdccccba...
..abccccdccba...
..abbbbbbbbba...
..aaaaaaaaaaa...
................
................
`,
    legend: { a: OS.chrome, b: OS.body, c: OS.bodyEdge, d: OS.ink },
  },
  trash: {
    p: `
................
.....aaaaaa.....
....abbbbbba....
.....aaaaaa.....
.acaaaaaaaaca a.
.acdaaaaaaaca a.
.acdedededcca a.
.acdedededcca a.
.acdedededcca a.
.acdedededcca a.
.acdedededcca a.
.acdedededcca a.
.aaccdedccccaaa.
.aaaaccccaaaaa..
................
................
`,
    legend: { a: OS.chrome, b: OS.bodyEdge, c: OS.chromeLite, d: OS.body, e: OS.bodyEdge },
  },
  cpu: {
    p: `
................
....aaaaaaaa....
.a..a......a..a.
.a..aabbbba..a..
.a..ab....ba.a..
.aaaab.cc.baaa..
....ab.cc.ba....
.aaaab....baaa..
.a..ab.cc.ba.a..
.a..aabbbba..a..
.a..a......a..a.
....aaaaaaaa....
................
................
................
................
`,
    legend: { a: OS.chrome, b: OS.bodyEdge, c: OS.blue },
  },
} as const

export type IconKey = keyof typeof ICONS
