import { useEffect, useRef, useState } from 'react'
import type { HeroSlide } from '../../types/content'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { saveDocument } from '../../lib/content-service'
import { detectMediaType } from '../../lib/media'

export function HeroEditor({
  slide,
  onSaved,
  onError,
}: {
  slide: HeroSlide
  onSaved: () => void
  onError: (msg: string) => void
}) {
  const [form, setForm] = useState(slide)
  const [saving, setSaving] = useState(false)
  const editingSlideId = useRef(slide.id)

  // slide는 부모(HeroSlider)가 자동 회전·재조회로 언제든 새 객체를 내려줄 수 있다.
  // 실제로 "다른 슬라이드"로 전환됐을 때(id 변경)만 폼을 리셋하고, 같은 슬라이드의
  // 객체 참조만 바뀐 경우엔 입력 중이던 값을 덮어쓰지 않는다.
  useEffect(() => {
    if (slide.id !== editingSlideId.current) {
      editingSlideId.current = slide.id
      setForm(slide)
    }
  }, [slide])

  const resolveMedia = () => {
    // 새 값이 있으면 사용, 없으면 기존 값 유지 — 둘 다 없으면 빈 값으로 저장한다
    // (기본 이미지로 폴백하지 않음).
    const keep = form.mediaUrl.trim() || slide.mediaUrl.trim()
    return {
      mediaUrl: keep,
      mediaType: keep ? detectMediaType(keep) : 'image',
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      const media = resolveMedia()
      await saveDocument('heroSlides', form.id, {
        tag: form.tag,
        title: form.title,
        subtitle: form.subtitle,
        // Firestore는 undefined를 거부한다 — 선택 필드는 항상 문자열로 정규화
        linkUrl: (form.linkUrl ?? '').trim(),
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
        isActive: form.isActive !== false,
        order: form.order ?? 0,
        updatedAt: new Date().toISOString(),
      })
      setForm((prev) => ({
        ...prev,
        mediaUrl: media.mediaUrl,
        mediaType: media.mediaType,
      }))
      onSaved()
    } catch (err) {
      onError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <FormField
        label="태그 (상단 배지)"
        htmlFor="hero-tag"
        hint="슬라이드 좌상단에 작게 표시되는 배지 문구입니다. 예: 2026년 표어, 주일예배, 다음세대"
      >
        <Input
          id="hero-tag"
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          placeholder="예: 다음세대"
        />
      </FormField>

      <FormField label="제목" htmlFor="hero-title" required hint="메인 헤드라인. 한 줄 권장.">
        <Input
          id="hero-title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="슬라이드 제목"
        />
      </FormField>

      <FormField
        label="부제 / 설명"
        htmlFor="hero-subtitle"
        hint="제목 아래 보조 문구입니다. 2~3줄 이내로 작성해 주세요."
      >
        <Textarea
          id="hero-subtitle"
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          placeholder="부제 또는 설명 문구"
        />
      </FormField>

      <MediaInputField
        label="배경 미디어 (이미지 / mp4 / 유튜브)"
        value={{ mediaUrl: form.mediaUrl, mediaType: form.mediaType }}
        defaultUrl={slide.mediaUrl}
        folder="hero"
        hint={
          slide.mediaUrl.trim()
            ? '비우면 현재 미디어 유지 · 이미지/mp4 URL·파일 또는 유튜브 URL · 파일 최대 15MB'
            : '슬라이드 이미지를 업로드해 주세요 · 이미지/mp4 URL·파일 또는 유튜브 URL · 파일 최대 15MB'
        }
        onChange={(media) =>
          setForm((prev) => ({
            ...prev,
            mediaUrl: media.mediaUrl,
            mediaType: media.mediaType,
          }))
        }
        onError={onError}
      />

      <FormField
        label="링크 URL (선택)"
        htmlFor="hero-link"
        hint="「자세히 보기」 버튼이 이동할 경로입니다. 내부 경로(/education) 또는 외부 https URL."
      >
        <Input
          id="hero-link"
          value={form.linkUrl ?? ''}
          onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
          placeholder="/education 또는 https://…"
        />
      </FormField>

      <div className="flex justify-end pt-1">
        <Button disabled={saving} onClick={() => void save()}>
          게시
        </Button>
      </div>
    </div>
  )
}
