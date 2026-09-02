import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import { MediaInputField } from './MediaInputField'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'
import { DEFAULT_LOGO_SRC } from '../../types/content'
import { cn } from '../../lib/utils'

/**
 * 헤더·푸터 공용 로고 편집 트리거 + 모달.
 * 저장 대상은 siteSettings/main.logoUrl 단일 필드 — 헤더와 푸터가 같은 값을 공유한다.
 */
export function LogoEditDialog({
  currentLogoUrl,
  onSaved,
  className,
}: {
  currentLogoUrl: string
  onSaved: (url: string) => void
  className?: string
}) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const [open, setOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setLogoUrl(currentLogoUrl)
  }, [open, currentLogoUrl])

  const commit = async (nextUrl: string) => {
    setSaving(true)
    try {
      await saveDocument('siteSettings', 'main', { logoUrl: nextUrl })
      onSaved(nextUrl)
      pushToast({
        title: nextUrl ? '로고 저장됨' : '기본 로고로 되돌림',
        variant: 'success',
      })
      setOpen(false)
    } catch (err) {
      pushToast({
        title: '저장 실패',
        description: err instanceof Error ? err.message : '알 수 없는 오류',
        variant: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex shrink-0 items-center gap-1 rounded-sm bg-ink/85 px-2 py-0.5 text-[11px] font-medium text-gold shadow transition-colors hover:bg-ink',
          className,
        )}
        aria-label="로고 이미지 편집"
      >
        <Pencil className="h-3 w-3" />
        로고 편집
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[min(92vw,30rem)]">
          <DialogHeader>
            <DialogTitle>로고 이미지 편집</DialogTitle>
            <DialogDescription>
              저장하면 헤더와 푸터 로고가 함께 바뀝니다. 투명 배경 PNG·WebP를 권장합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <MediaInputField
              label="로고 이미지"
              imageOnly
              folder="branding"
              value={{ mediaUrl: logoUrl, mediaType: 'image' }}
              defaultUrl={currentLogoUrl || DEFAULT_LOGO_SRC}
              hint="가로형 로고 · 투명 배경 권장 · 비우면 현재 로고 유지"
              onChange={(m) => setLogoUrl(m.mediaUrl)}
              onError={(msg) =>
                pushToast({ title: '업로드 실패', description: msg, variant: 'error' })
              }
            />
            <div className="flex items-center justify-between border-t border-paper-line/60 pt-3">
              <Button
                variant="ghost"
                size="sm"
                disabled={saving || (!currentLogoUrl && !logoUrl.trim())}
                onClick={() => void commit('')}
              >
                기본 로고로 초기화
              </Button>
              <Button
                size="sm"
                disabled={saving}
                onClick={() => void commit(logoUrl.trim() || currentLogoUrl)}
              >
                저장 후 게시
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
