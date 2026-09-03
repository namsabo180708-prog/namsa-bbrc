import { useEffect, useState } from 'react'
import type { HeroSlide } from '../../types/content'
import { resolveMediaKind, toYoutubeEmbedUrl } from '../../lib/media'

export function HeroMediaBackground({ slide }: { slide: HeroSlide }) {
  const url = slide.mediaUrl?.trim() ?? ''
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    setImgFailed(false)
  }, [url, slide.id])

  // 배경 미디어가 설정되지 않았거나 로드에 실패하면 기본 이미지로 폴백하지 않고
  // 빈 화면(섹션 bg-ink)만 보여준다. 안내는 HeroSlider에서 토스트로 처리한다.
  if (!url || imgFailed) return null

  const kind = resolveMediaKind(url, slide.mediaType)

  if (kind === 'youtube') {
    const embed = toYoutubeEmbedUrl(url)
    if (!embed) return null
    return (
      <div className="absolute inset-0 overflow-hidden bg-ink">
        <iframe
          key={slide.id + embed}
          src={embed}
          title={slide.title || 'YouTube'}
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-video h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }

  if (kind === 'video') {
    return (
      <video
        key={slide.id + url}
        className="absolute inset-0 h-full w-full object-cover"
        src={url}
        autoPlay
        muted
        loop
        playsInline
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
    )
  }

  return (
    <img
      key={slide.id + url}
      src={url}
      alt={slide.title}
      className="absolute inset-0 h-full w-full object-cover"
      fetchPriority="high"
      onError={() => setImgFailed(true)}
    />
  )
}
