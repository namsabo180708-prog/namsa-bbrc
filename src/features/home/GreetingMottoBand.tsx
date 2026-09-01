import type { AnnualMotto, PastorGreeting } from '../../types/content'
import { PastorGreetingSection } from './PastorGreetingSection'
import { AnnualMottoSection } from './AnnualMottoSection'

interface Props {
  greeting: PastorGreeting
  motto: AnnualMotto
  onUpdated?: () => void
}

/**
 * Stone & Leaf 홈 밴드:
 * 1) 인사 — 비대칭 스플릿
 * 2) 표어 — 별도 타이포 스트립 (같은 레이아웃 가족 반복 금지)
 */
export function GreetingMottoBand({ greeting, motto, onUpdated }: Props) {
  return (
    <>
      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <PastorGreetingSection greeting={greeting} onUpdated={onUpdated} compact />
        </div>
      </section>
      <section className="border-y border-paper-line bg-paper-dim py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <AnnualMottoSection motto={motto} onUpdated={onUpdated} />
        </div>
      </section>
    </>
  )
}
