import { ImagePlus } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * 사진이 아직 등록되지 않은 자리를 채우는 공용 빈 박스.
 * 교회소개·담임목사소개·장로소개·사역자소개·교육부서에서 동일하게 쓴다 —
 * 기본/시드 이미지를 넣지 않고, 관리자에게 업로드를 안내하는 중립 상태.
 */
export function PhotoPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 bg-paper-dim px-4 text-center',
        className,
      )}
    >
      <ImagePlus className="h-8 w-8 text-paper-muted" aria-hidden />
      <p className="text-xs font-medium leading-relaxed text-paper-muted">
        사진파일을
        <br />
        업로드하세요
      </p>
    </div>
  )
}
