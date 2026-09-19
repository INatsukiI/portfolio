// JSON-LD 構造化データ（Person / WebSite）を profile.ts から生成する純粋関数。
// vite.config.js の transformIndexHtml プラグインから呼び出し、
// index.html とプロフィール情報が二重管理にならないようにする。
import type { Profile } from '@/profile'

export const SITE_URL = 'https://inatsukii.github.io/portfolio/'

interface PersonJsonLd {
  '@type': 'Person'
  name: string
  url: string
  jobTitle: string
  sameAs: string[]
}

interface WebSiteJsonLd {
  '@type': 'WebSite'
  name: string
  url: string
}

export interface StructuredData {
  '@context': 'https://schema.org'
  '@graph': [PersonJsonLd, WebSiteJsonLd]
}

// PROFILE.contact の val は "github.com/xxx" のようなホスト名以降のみを持つため、
// sameAs 用に https:// を補う。
const SAME_AS_KEYS = ['gh', 'x', 'zenn']

export function buildStructuredData(profile: Profile): StructuredData {
  const sameAs = profile.contact
    .filter(c => SAME_AS_KEYS.includes(c.key))
    .map(c => `https://${c.val}`)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: profile.name,
        url: SITE_URL,
        jobTitle: profile.title,
        sameAs,
      },
      {
        '@type': 'WebSite',
        name: 'OMU/OS',
        url: SITE_URL,
      },
    ],
  }
}
