import { partners } from './quick-links-data'

/**
 * 협력기관 — 워드마크 레일.
 * 스케일 호버·파스텔 플레이트·eyebrow 제거. 로고 자산 복구 전까지 텍스트 마크.
 */
export function PartnerSpotlightRail() {
  return (
    <section className="bg-ink py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-serif text-xl font-semibold text-paper sm:text-2xl">협력기관</h2>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {partners.map((p) => (
            <li key={p.href}>
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex min-h-24 flex-col justify-center border border-ink-line px-5 py-6 transition-colors hover:border-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                <span className="font-serif text-base font-semibold text-paper transition-colors group-hover:text-gold sm:text-lg">
                  {p.label}
                </span>
                <span className="mt-2 text-xs text-ink-muted">{p.role}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
