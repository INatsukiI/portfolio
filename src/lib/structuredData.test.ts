import { describe, it, expect } from 'vitest'
import { buildStructuredData, SITE_URL } from './structuredData'
import type { Profile } from '@/profile'

const baseProfile: Profile = {
  name: 'omu',
  handle: '@ooooomuuu',
  title: 'バックエンドエンジニア',
  level: 1,
  exp: '1年',
  location: '東京',
  tagline: 'tagline',
  bio: 'bio',
  email: 'test@example.com',
  stats: [],
  skills: [],
  history: [],
  achievements: [],
  projects: [],
  contact: [
    { label: 'GitHub', val: 'github.com/INatsukiI', key: 'gh' },
    { label: 'X', val: 'x.com/ooooomuu', key: 'x' },
    { label: 'Zenn', val: 'zenn.dev/ooooomu', key: 'zenn' },
    { label: 'Email', val: 'test@example.com', key: 'email' },
  ],
}

describe('buildStructuredData', () => {
  it('Person の name / url / jobTitle を profile から生成する', () => {
    const data = buildStructuredData(baseProfile)
    const person = data['@graph'][0]
    expect(person['@type']).toBe('Person')
    expect(person.name).toBe('omu')
    expect(person.url).toBe(SITE_URL)
    expect(person.jobTitle).toBe('バックエンドエンジニア')
  })

  it('sameAs は GitHub / X / Zenn の URL のみを https:// 付きで含む（email は除外）', () => {
    const data = buildStructuredData(baseProfile)
    const person = data['@graph'][0]
    expect(person.sameAs).toEqual([
      'https://github.com/INatsukiI',
      'https://x.com/ooooomuu',
      'https://zenn.dev/ooooomu',
    ])
  })

  it('WebSite の name / url を含む', () => {
    const data = buildStructuredData(baseProfile)
    const site = data['@graph'][1]
    expect(site).toEqual({
      '@type': 'WebSite',
      name: 'OMU/OS',
      url: SITE_URL,
    })
  })

  it('@context を含む', () => {
    const data = buildStructuredData(baseProfile)
    expect(data['@context']).toBe('https://schema.org')
  })
})
