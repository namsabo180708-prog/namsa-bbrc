import { NEWS_CATEGORIES, type NewsCategory, type NewsPost } from '../types/content'
import { detectMediaType, isYoutubeUrl } from './media'

/**
 * 대표 이미지로 실제 렌더할 수 있는 값인지. YouTube·영상 링크나 빈 값은 거른다.
 * (관리자가 이미지 필드에 유튜브 URL을 붙여 넣어 목록에 깨진 이미지가 뜨던 문제 방지)
 */
export function isDisplayableImageUrl(url: string | undefined | null): boolean {
  const s = url?.trim()
  if (!s) return false
  if (s.startsWith('data:image/')) return true
  if (isYoutubeUrl(s)) return false
  return detectMediaType(s) === 'image'
}

/** Firestore 값이 유효한 분류가 아니면 undefined ('일반'으로 취급). */
export function parseNewsCategory(value: unknown): NewsCategory | undefined {
  return (NEWS_CATEGORIES as readonly string[]).includes(String(value))
    ? (value as NewsCategory)
    : undefined
}

/** 태그 제거 + 흔한 엔티티 복원 + 공백 정리. 짧은 목록 발췌용. */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 목록 행 요약: summary가 있으면 그대로, 없으면 본문 텍스트를 max자 이내로 자른다. */
export function newsExcerpt(
  post: Pick<NewsPost, 'summary' | 'contentHtml'>,
  max = 140,
): string {
  const base = post.summary?.trim() || stripHtml(post.contentHtml)
  if (base.length <= max) return base
  return `${base.slice(0, max).replace(/\s+\S*$/, '')}…`
}
