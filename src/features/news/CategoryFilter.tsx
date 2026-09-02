import type { NewsCategory } from '../../types/content'
import { cn } from '../../lib/utils'

export type NewsFilter = '전체' | NewsCategory

interface Props {
  value: NewsFilter
  onChange: (next: NewsFilter) => void
  /** 실제 글에 존재하는 분류만 노출 */
  categories: NewsCategory[]
}

/**
 * '오시는길'의 세그먼트 컨트롤과 동일한 로직 — 테두리로 감싼 트랙 안에 알약 버튼,
 * 선택 항목만 bg-gold 채움. 항목이 많을 수 있어 트랙 안에서 가로 스크롤만 허용한다.
 */
export function CategoryFilter({ value, onChange, categories }: Props) {
  const items: NewsFilter[] = ['전체', ...categories]
  if (items.length <= 1) return null

  return (
    <div
      role="tablist"
      aria-label="교회소식 분류"
      className="no-scrollbar inline-flex max-w-full items-stretch gap-1.5 overflow-x-auto rounded-full border border-paper-line bg-paper-dim/70 p-1.5"
    >
      {items.map((label) => {
        const active = value === label
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(label)}
            className={cn(
              'seg-pill inline-flex min-h-[48px] shrink-0 items-center justify-center whitespace-nowrap rounded-full px-5 text-base font-semibold transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45',
              active
                ? 'bg-gold text-paper shadow-sm'
                : 'text-paper-text/70 hover:text-paper-text',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
