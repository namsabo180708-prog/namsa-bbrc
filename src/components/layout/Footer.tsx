import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { SITE_NAME } from '../../types/content'
import { useAdminStore } from '../../store/admin-store'
import { getSiteSettings } from '../../lib/content-service'
import { cn, toTelHref } from '../../lib/utils'

/** 푸터 고정 연락처 — prd/남사보배로운교회-info.txt */
const FOOTER_CONTACT = {
  postal: '17115',
  addressKo: '경기도 용인시 처인구 남사읍 처인성로 896',
  addressEn: '896 Cheoinseong-ro, Namsa-eup, Cheoin-gu, Yongin-si, Gyeonggi-do 17115',
  tel: '031-322-0191',
  fax: '031-322-0199',
  website: 'https://남사보배로운교회.kr',
  email: 'namsabo180708@gmail.com',
} as const

/** Firestore(siteSettings/main)에 값이 없을 때 쓰는 기본 설립 연도 */
const FOUNDED_YEAR = 2005

/**
 * 푸터 바로가기 6개 — 2열(grid-flow-col)
 * 1열: 교회소개 / 예배안내 / 교육부서
 * 2열: 선교사역 / 교회소식 / 오시는길
 */
const FOOTER_LINKS = [
  { label: '교회소개', path: '/about' },
  { label: '예배안내', path: '/worship' },
  { label: '교육부서', path: '/education' },
  { label: '선교사역', path: '/missions' },
  { label: '교회소식', path: '/news' },
  { label: '오시는길', path: '/contact' },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const setLoginOpen = useAdminStore((s) => s.setLoginOpen)

  const [foundedYear, setFoundedYear] = useState(FOUNDED_YEAR)
  useEffect(() => {
    getSiteSettings()
      .then((s) => {
        if (s.foundedYear && s.foundedYear > 0) setFoundedYear(s.foundedYear)
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="site-footer mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {/* 2열 stretch: 좌측 메타 하단 = Quick Link 메뉴 마지막 행 기준선 */}
        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-stretch sm:gap-14 lg:gap-20">
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
              <img
                src="/logo-image/webp/03-namsa-main-trans-logo.webp"
                alt={SITE_NAME}
                className="h-12 w-auto shrink-0 sm:h-14"
              />
              <address className="not-italic max-w-xl space-y-1.5 text-sm leading-relaxed text-ink-muted">
                <p className="text-paper">
                  <span className="index-num">{FOOTER_CONTACT.postal}</span>{' '}
                  {FOOTER_CONTACT.addressKo}
                </p>
                <p className="text-xs sm:text-sm">{FOOTER_CONTACT.addressEn}</p>
                <p className="pt-1">
                  <span className="font-medium text-paper">Tel</span> :{' '}
                  <a
                    href={toTelHref(FOOTER_CONTACT.tel)}
                    className="underline-offset-2 transition-colors duration-200 hover:text-gold hover:underline"
                  >
                    {FOOTER_CONTACT.tel}
                  </a>
                  <span className="mx-2 text-ink-line" aria-hidden>
                    |
                  </span>
                  <span className="font-medium text-paper">Fax</span> : {FOOTER_CONTACT.fax}
                </p>
                <p>
                  <span className="font-medium text-paper">Web</span> :{' '}
                  <a
                    href={FOOTER_CONTACT.website}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-2 transition-colors duration-200 hover:text-gold hover:underline"
                  >
                    {FOOTER_CONTACT.website.replace(/^https?:\/\//, '')}
                  </a>
                </p>
              </address>
            </div>

            {/* BackToTop default 버튼 바탕(bg-gold)과 동일 톤 */}
            <p className="mt-auto pt-8 text-xs leading-relaxed text-gold sm:pt-10 sm:text-[13px]">
              © {foundedYear}-{currentYear} {SITE_NAME}. All rights reserved.
              <span className="mx-1.5 text-gold/45" aria-hidden>
                |
              </span>
              Email :{' '}
              <a
                href={`mailto:${FOOTER_CONTACT.email}`}
                className="text-gold underline-offset-2 transition-colors duration-200 hover:text-paper hover:underline"
              >
                {FOOTER_CONTACT.email}
              </a>
              {!isAdminMode ? (
                <>
                  <span className="mx-1.5 text-gold/45" aria-hidden>
                    |
                  </span>
                  <button
                    type="button"
                    onClick={() => setLoginOpen(true)}
                    aria-label="관리자 로그인"
                    className="text-gold underline-offset-2 transition-colors duration-200 hover:text-paper hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                  >
                    Admin
                  </button>
                </>
              ) : null}
            </p>
          </div>

          <nav aria-label="바로가기" className="flex min-w-0 flex-col sm:pt-1">
            <p className="mb-3 flex justify-center">
              <span className="inline-flex items-center rounded-full border border-gold/55 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-gold">
                Quick Link
              </span>
            </p>
            <ul className="grid grid-flow-col grid-cols-2 grid-rows-3 gap-x-10 gap-y-1">
              {FOOTER_LINKS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'group relative inline-flex min-h-9 cursor-pointer items-center px-0.5 py-1.5 text-sm font-medium tracking-[0.04em] text-ink-muted transition-colors hover:text-paper',
                        isActive && 'text-paper',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {/* Topbar와 동일: 호버 시 scale-x 언더바 (금→민트) */}
                        <span
                          aria-hidden
                          className={cn(
                            'pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100',
                            isActive && 'scale-x-100',
                          )}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}
