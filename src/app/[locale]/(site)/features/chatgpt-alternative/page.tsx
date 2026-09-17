import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternateLanguageUrls, canonicalUrl, OG_IMAGE } from '@/lib/seo'
import { getSynaplanGithubRepoStats } from '@/lib/github-synaplan-repo'
import { ChatGptAlternativePage } from '@/components/features/chatgpt-alternative-page'

const PATH = '/features/chatgpt-alternative'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'chatgptAlt' })
  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    openGraph: { title, description, url: canonicalUrl(locale, PATH), images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
    alternates: {
      canonical: canonicalUrl(locale, PATH),
      languages: alternateLanguageUrls(PATH),
    },
  }
}

export default async function ChatGptAlternativeRoute({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const githubRepo = getSynaplanGithubRepoStats()
  return <ChatGptAlternativePage githubRepo={githubRepo} />
}
