import { useRegisterSW } from 'virtual:pwa-register/react'

/** 오래 열어둔 탭에서도 최신본을 받도록 1시간마다 서비스워커 업데이트를 확인한다. */
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000

/**
 * 새 버전(대기 중 서비스워커)이 감지되면 하단 배너로 「새로고침」을 안내한다.
 * registerType: 'prompt' 와 짝 — 배너의 새로고침이 skipWaiting + reload 를 실행한다.
 */
export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return
      window.setInterval(() => {
        void registration.update().catch(() => {})
      }, UPDATE_CHECK_INTERVAL_MS)
    },
  })

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
