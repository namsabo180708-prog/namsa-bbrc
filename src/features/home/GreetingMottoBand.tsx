import type { AnnualMotto, PastorGreeting } from '../../types/content'
import { PastorGreetingSection } from './PastorGreetingSection'
import { AnnualMottoSection } from './AnnualMottoSection'

interface Props {
  greeting: PastorGreeting
  motto: AnnualMotto
  onUpdated?: () => void
}

/**
 * Stone & Leaf 홈 밴드 — 담임목사 인사말(좌, 7) · 연간 표어(우, 3)를 1×2 그리드로 배치.
 * 모바일에서는 인사말 → 표어 순으로 세로 스택.
 */
export function GreetingMottoBand({ greeting, motto, onUpdated }: Props) {
  return (
    <section className="bg-paper pt-20 sm:pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[7fr_3fr] md:items-stretch lg:gap-12">
          <div className="rounded-[20px] border border-paper-line bg-paper p-7 sm:p-9">
            <PastorGreetingSection greeting={greeting} onUpdated={onUpdated} />
          </div>
          <div className="rounded-[20px] border border-paper-line bg-paper-dim p-7 sm:p-9">
            <AnnualMottoSection motto={motto} onUpdated={onUpdated} />
          </div>
        </div>
      </div>
    </section>
  )
}
