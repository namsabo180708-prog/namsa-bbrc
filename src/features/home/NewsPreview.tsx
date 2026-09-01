import { Link } from 'react-router-dom'
import type { NewsPost } from '../../types/content'
import { formatDate } from '../../lib/utils'

interface Props {
  posts: NewsPost[]
}

/** 홈 소식 — 1 featured + 2 compact (동일 3카드 그리드 금지) */
export function NewsPreview({ posts }: Props) {
  const list = posts.slice(0, 3)
  const featured = list[0]
  const rest = list.slice(1)

  return (
    <section className="bg-paper py-20 sm:py-28">
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
              <div className="aspect-[16/10] overflow-hidden bg-paper-line">
                {featured.thumbnail ? (
                  <img
                    src={featured.thumbnail}
                    alt=""
                    className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    loading="lazy"
                  />
                ) : null}
              </div>
              <p className="mt-5 text-xs text-paper-muted">{formatDate(featured.createdAt)}</p>
              <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug tracking-tight text-paper-text transition-colors group-hover:text-gold-deep sm:text-[1.65rem]">
                {featured.title}
              </h3>
            </Link>

            <ul className="flex flex-col justify-center divide-y divide-paper-line border-y border-paper-line">
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
