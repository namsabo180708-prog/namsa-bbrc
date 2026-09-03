import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { NewsPost } from '../../types/content'
import { PhotoPlaceholder } from '../../components/shared/PhotoPlaceholder'
import { useAdminStore } from '../../store/admin-store'
import { formatDate } from '../../lib/utils'

interface Props {
  posts: NewsPost[]
}

/** 홈 소식 — 1 featured + 최대 3 compact (동일 카드 그리드 금지) */
export function NewsPreview({ posts }: Props) {
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const pushToast = useAdminStore((s) => s.pushToast)

  const list = posts.slice(0, 4)
  const featured = list[0]
  const rest = list.slice(1)

  const featuredThumb = featured?.thumbnail?.trim() ?? ''

  // 대표 소식 썸네일이 없으면 기본 이미지로 채우지 않고 관리자에게 등록 안내 토스트를 띄운다.
  useEffect(() => {
    if (!isAdminMode || !featured || featuredThumb) return
    pushToast({ title: '대표 소식 썸네일을 등록해 주세요!', variant: 'default' })
  }, [isAdminMode, featured, featuredThumb, pushToast])

  return (
    <section className="bg-paper-dim pt-20 pb-20 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-paper-text sm:text-3xl">
            교회소식
          </h2>
          <Link
            to="/news"
            className="inline-flex min-h-11 items-center text-sm font-medium text-gold-deep transition-colors hover:text-paper-text"
          >
            전체 보기
          </Link>
        </div>

        {!featured ? (
          <p className="text-paper-muted">등록된 소식이 없습니다.</p>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
            <Link to={`/news/${featured.id}`} className="group block min-w-0">
              {featuredThumb ? (
                <div className="map-ripple relative aspect-[16/10] overflow-hidden rounded-[20px] bg-paper-line shadow-[0_18px_40px_-14px_rgba(90,102,96,0.45)]">
                  <img
                    src={featuredThumb}
                    alt=""
                    className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    loading="lazy"
                  />
                  <span className="map-ripple__wave" aria-hidden />
                </div>
              ) : isAdminMode ? (
                <PhotoPlaceholder className="aspect-[16/10] w-full rounded-[20px]" />
              ) : null}
              <p className="mt-5 text-xs text-paper-muted">{formatDate(featured.createdAt)}</p>
              <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug tracking-tight text-paper-text transition-colors group-hover:text-gold-deep sm:text-[1.65rem]">
                {featured.title}
              </h3>
            </Link>

            <ul className="flex flex-col divide-y divide-paper-line border-y border-paper-line lg:self-start">
              {rest.map((post) => (
                <li key={post.id}>
                  <Link
                    to={`/news/${post.id}`}
                    className="group flex min-h-20 flex-col justify-center gap-1 py-5 sm:min-h-24"
                  >
                    <p className="text-xs text-paper-muted">{formatDate(post.createdAt)}</p>
                    <h3 className="font-serif text-lg font-medium leading-snug text-paper-text transition-colors group-hover:text-gold-deep">
                      {post.title}
                    </h3>
                  </Link>
                </li>
              ))}
              {rest.length === 0 ? (
                <li className="py-8 text-sm text-paper-muted">추가 소식이 곧 게시됩니다.</li>
              ) : null}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
