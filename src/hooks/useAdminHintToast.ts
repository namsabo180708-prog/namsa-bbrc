import { useEffect } from 'react'
import { useAdminStore } from '../store/admin-store'

/**
 * 관리자 모드에서 `show`가 true인 동안 안내 토스트를 띄운다.
 * (히어로·인사말·교회소식 등 "이미지가 아직 설정되지 않음" 안내에 공통 사용 —
 *  기본/시드 이미지로 폴백하지 않고 관리자에게 등록을 유도하는 패턴)
 *
 * `resetKey`가 바뀌면 다시 띄운다 (예: 캐러셀 슬라이드 전환).
 */
export function useAdminHintToast(show: boolean, title: string, resetKey?: string | number) {
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const pushToast = useAdminStore((s) => s.pushToast)

  useEffect(() => {
    if (!isAdminMode || !show) return
    pushToast({ title, variant: 'default' })
  }, [isAdminMode, show, title, resetKey, pushToast])
}
