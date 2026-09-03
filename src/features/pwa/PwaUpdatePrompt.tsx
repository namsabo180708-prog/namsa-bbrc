import { useEffect, useRef } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/** 백그라운드 주기 확인 간격 (탭을 계속 켜둔 경우 대비) */
const PERIODIC_CHECK_MS = 60 * 60 * 1000

/**
 * 새 버전(대기 중 서비스워커)이 감지되면 하단 배너로 「새로고침」을 안내한다.
 * registerType: 'prompt' 와 짝 — 배너의 새로고침이 skipWaiting + reload 를 실행한다.
 *
 * 업데이트 감지 트리거:
 *  1) 페이지 로드 시 자동 등록(immediate) → 서버에 새 sw.js가 있으면 즉시 감지
 *  2) 탭이 다시 포커스/가시화될 때 registration.update() — 배포 직후 탭으로 돌아오면 바로 뜸
 *  3) 탭을 계속 켜둔 경우 1시간마다 registration.update()
 */
export function PwaUpdatePrompt() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      registrationRef.current = registration ?? null
      console.info('[PWA] service worker 등록됨:', swUrl, registration ? '(registration OK)' : '(no registration)')
      if (!registration) return
      window.setInterval(() => {
        void registration.update().catch(() => {})
      }, PERIODIC_CHECK_MS)
    },
    onNeedRefresh() {
      console.info('[PWA] 새 버전 감지 — 업데이트 배너 표시')
    },
    onRegisterError(err) {
      console.warn('[PWA] service worker 등록 실패:', err)
    },
  })

  // 탭이 다시 보이거나 포커스될 때 즉시 업데이트 확인 (배포 후 탭 복귀 시나리오)
  useEffect(() => {
    const check = () => {
      if (document.visibilityState !== 'visible') return
      void registrationRef.current?.update().catch(() => {})
    }
    document.addEventListener('visibilitychange', check)
    window.addEventListener('focus', check)
    return () => {
      document.removeEventListener('visibilitychange', check)
      window.removeEventListener('focus', check)
    }
  }, [])

  if (!needRefresh) return null

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-[110] w-[min(92vw,24rem)] rounded-sm border border-gold/50 bg-ink px-4 py-3 text-paper shadow-xl"
    >
      <p className="text-sm font-semibold">새 버전이 준비되었습니다</p>
      <p className="mt-0.5 text-xs text-ink-muted">새로고침하면 최신 화면으로 업데이트됩니다.</p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="rounded-sm px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-paper"
        >
          나중에
        </button>
        <button
          type="button"
          onClick={() => void updateServiceWorker(true)}
          className="rounded-sm bg-gold px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-gold-deep hover:text-paper"
        >
          새로고침
        </button>
      </div>
    </div>
  )
}
