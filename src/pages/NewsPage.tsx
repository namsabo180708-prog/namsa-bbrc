import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/dialog'
import { NewsEditorForm } from '../features/news/NewsEditorForm'
import { NewsRow } from '../features/news/NewsRow'
import { CategoryFilter, type NewsFilter } from '../features/news/CategoryFilter'
import { getNewsPosts, saveDocument } from '../lib/content-service'
import { getPageNumbers } from '../lib/pagination'
import { sanitizeHtml } from '../lib/sanitize'
import { cn } from '../lib/utils'
import { NEWS_CATEGORIES, type NewsCategory, type NewsPost } from '../types/content'
import { seedNews } from '../data/seed'
import { useAdminStore } from '../store/admin-store'

const PAGE_SIZE = 8

/** category가 없는 글은 '일반'으로 취급한다(목록·필터 일관성). */
const catOf = (p: NewsPost): NewsCategory => p.category ?? '일반'
const byNewest = (a: NewsPost, b: NewsPost) => b.createdAt.localeCompare(a.createdAt)

export function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>(seedNews)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<NewsFilter>('전체')
  const [editorOpen, setEditorOpen] = useState(false)
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const user = useAdminStore((s) => s.user)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = useCallback(async () => {
    setPosts(await getNewsPosts({ publishedOnly: !isAdminMode, pageSize: 100 }))
  }, [isAdminMode])

  useEffect(() => {
    void reload()
  }, [reload])

  const categoriesPresent = useMemo(() => {
    const set = new Set(posts.map(catOf))
    return NEWS_CATEGORIES.filter((c) => set.has(c))
  }, [posts])

  const { pinned, rest } = useMemo(() => {
    const filtered =
      filter === '전체' ? posts : posts.filter((p) => catOf(p) === filter)
    return {
      pinned: filtered.filter((p) => p.pinned).sort(byNewest),
      rest: filtered.filter((p) => !p.pinned).sort(byNewest),
    }
  }, [posts, filter])

  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => rest.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [rest, currentPage],
  )
  const isEmpty = pinned.length === 0 && rest.length === 0

  const changeFilter = (next: NewsFilter) => {
    setFilter(next)
    setPage(1)
  }

  return (
    <>
      <Seo title="교회소식" path="/news" />
      <PageShell title="교회소식" description="교회의 소식과 안내를 전합니다." current="교회소식">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <CategoryFilter value={filter} onChange={changeFilter} categories={categoriesPresent} />
          {isAdminMode ? (
            <Button className="ml-auto" onClick={() => setEditorOpen(true)}>
              새 글 작성
            </Button>
          ) : null}
        </div>

        <div className="border-t border-paper-line">
          {isEmpty ? (
            <p className="py-16 text-center text-sm text-paper-muted">
              {filter === '전체'
                ? '아직 등록된 소식이 없습니다.'
                : `'${filter}' 분류의 소식이 없습니다.`}
            </p>
          ) : (
            <>
              {currentPage === 1
                ? pinned.map((post) => <NewsRow key={post.id} post={post} />)
                : null}
              {pageItems.map((post) => (
                <NewsRow key={post.id} post={post} />
              ))}
            </>
          )}
        </div>

        {totalPages > 1 ? (
          <nav
            aria-label="교회소식 페이지 이동"
            className="mt-12 flex items-center justify-center gap-1"
          >
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
              aria-label="이전 페이지"
              className="inline-flex h-8 w-8 items-center justify-center text-paper-muted transition hover:text-gold-deep disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {getPageNumbers(currentPage, totalPages).map((token, i) =>
              token === 'ellipsis' ? (
                <span
                  key={`ellipsis-${i}`}
                  aria-hidden
                  className="index-num inline-flex h-8 w-8 items-center justify-center text-sm text-paper-muted"
                >
                  …
                </span>
              ) : (
                <button
                  key={token}
                  type="button"
                  aria-current={token === currentPage ? 'page' : undefined}
                  onClick={() => setPage(token)}
                  className={cn(
                    'index-num inline-flex h-8 w-8 items-center justify-center text-sm transition',
                    token === currentPage
                      ? 'font-semibold text-gold-deep'
                      : 'text-paper-muted hover:text-paper-text',
                  )}
                >
                  {token}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
              aria-label="다음 페이지"
              className="inline-flex h-8 w-8 items-center justify-center text-paper-muted transition hover:text-gold-deep disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        ) : null}

        <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
          <DialogContent className="w-[min(92vw,40rem)]">
            <DialogHeader>
              <DialogTitle>교회소식 작성</DialogTitle>
              <DialogDescription>
                리치텍스트는 HTML로 저장되며 DOMPurify로 sanitize 됩니다. 긴 본문은 모달 안에서
                스크롤하세요.
              </DialogDescription>
            </DialogHeader>
            <NewsEditorForm
              onSubmit={async (payload) => {
                try {
                  const id = `news_${Date.now()}`
                  await saveDocument('newsPosts', id, {
                    title: payload.title,
                    contentHtml: sanitizeHtml(payload.contentHtml),
                    thumbnail: payload.thumbnail,
                    category: payload.category,
                    pinned: payload.pinned,
                    summary: payload.summary,
                    authorUid: user?.uid ?? 'admin',
                    createdAt: new Date().toISOString(),
                    isPublished: true,
                    viewCount: 0,
                  })
                  pushToast({ title: '게시 완료', variant: 'success' })
                  setEditorOpen(false)
                  await reload()
                } catch (err) {
                  pushToast({
                    title: '저장 실패',
                    description: err instanceof Error ? err.message : '',
                    variant: 'error',
                  })
                }
              }}
              onError={(m) => pushToast({ title: '업로드 실패', description: m, variant: 'error' })}
            />
          </DialogContent>
        </Dialog>
      </PageShell>
    </>
  )
}
