import type { NewsCategory } from '../../types/content'
import { cn } from '../../lib/utils'

export type NewsFilter = '전체' | NewsCategory

interface Props {
  value: NewsFilter
  onChange: (next: NewsFilter) => void
  /** 실제 글에 존재하는 분류만 칩으로 노출 */
  categories: NewsCategory[]
}

/**
 * 가로 칩 줄. 어제 만든 세그먼트 컨트롤과 같은 색 규칙(활성 = bg-gold text-paper,
 * 비활성 = paper-line 테두리)을 다개용 형태로 스케일한 것.
 */
export function CategoryFilter({ value, onChange, categories }: Props) {
  const items: NewsFilter[] = ['전체', ...categories]
  if (items.length <= 1) return null

  return (
    <div
      role="tablist"
      aria-label="교회소식 분류"
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
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
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45',
              active
                ? 'border-gold bg-gold text-paper'
                : 'border-paper-line text-paper-muted hover:text-paper-text',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
