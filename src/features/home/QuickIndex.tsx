import { Link } from 'react-router-dom'
import { indexItems } from './quick-links-data'

/**
 * 홈 「찾아가기」 — 2열 텍스트 색인.
 * 번호·썸네일·화살표 과밀 구성 대신 큰 터치 행 + 타이포 위계.
 */
export function QuickIndex() {
  return (
    <section className="bg-paper-dim py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-paper-text sm:text-3xl">
          찾아가기
        </h2>

        <ul className="mt-10 grid gap-x-10 gap-y-0 sm:grid-cols-2">
          {indexItems.map((item) => (
            <li key={item.key} className="border-t border-paper-line">
              <Link
                to={item.href}
                className="group flex min-h-16 items-baseline justify-between gap-4 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 sm:min-h-[4.5rem]"
              >
                <span className="min-w-0">
                  <span className="block font-serif text-lg font-semibold text-paper-text transition-colors group-hover:text-gold-deep sm:text-xl">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm text-paper-muted">{item.desc}</span>
                </span>
                <span className="shrink-0 text-sm text-gold-deep opacity-0 transition-opacity group-hover:opacity-100">
                  {item.live()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
