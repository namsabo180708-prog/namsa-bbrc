import { Link } from 'react-router-dom'
import { Pin } from 'lucide-react'
import type { NewsPost } from '../../types/content'
import { isDisplayableImageUrl, newsExcerpt } from '../../lib/news-post'
import { formatDate } from '../../lib/utils'

/**
 * 교회소식 목록의 한 줄. 카드·그림자 없이 아래쪽 구분선만 두는 신문 브리프 톤.
 * 썸네일은 있을 때만 우측에 붙고, 없으면 텍스트가 폭을 그대로 채운다.
 */
export function NewsRow({ post }: { post: NewsPost }) {
  return (
    <Link
      to={`/news/${post.id}`}
      className="group flex items-start gap-4 border-b border-paper-line py-6 sm:gap-6"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <time className="index-num text-paper-muted">{formatDate(post.createdAt)}</time>
          {post.category ? (
            <span className="inline-flex items-center rounded-full border border-paper-line px-2 py-0.5 font-medium text-paper-muted">
              {post.category}
            </span>
          ) : null}
          {post.pinned ? (
            <span className="inline-flex items-center gap-1 font-medium text-gold-deep">
              <Pin className="h-3 w-3" aria-hidden />
              고정
            </span>
          ) : null}
          {!post.isPublished ? (
            <span className="font-semibold tracking-wide text-wine">임시저장</span>
          ) : null}
        </div>

        <h2 className="mt-2 line-clamp-2 font-serif text-lg font-medium text-paper-text transition-colors group-hover:text-gold-deep sm:text-xl">
          {post.title}
        </h2>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-paper-muted">
          {newsExcerpt(post)}
        </p>
      </div>

      {isDisplayableImageUrl(post.thumbnail) ? (
        <div className="shrink-0 overflow-hidden rounded-[14px] border border-paper-line">
          <img
            src={post.thumbnail}
            alt=""
            loading="lazy"
            className="h-20 w-20 object-cover transition duration-500 group-hover:scale-[1.03] sm:h-24 sm:w-24"
          />
        </div>
      ) : null}
    </Link>
  )
}
