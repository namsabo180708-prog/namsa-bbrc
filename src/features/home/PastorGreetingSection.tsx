import { useEffect, useState } from 'react'
import type { PastorGreeting } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { PhotoPlaceholder } from '../../components/shared/PhotoPlaceholder'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { extractFirstSentence, saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'

interface Props {
  greeting: PastorGreeting
  onUpdated?: () => void
}

export function PastorGreetingSection({ greeting, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const isAdminMode = useAdminStore((s) => s.isAdminMode)

  const photo = greeting.photoUrl?.trim() ?? ''

  const quote =
    greeting.quote?.trim() ||
    extractFirstSentence(greeting.message) ||
    greeting.message.slice(0, 80)

  // 사진이 설정되지 않았으면 기본 이미지로 폴백하지 않고, 관리자에게 저장 안내 토스트를 띄운다.
  useEffect(() => {
    if (!isAdminMode || photo) return
    pushToast({ title: '인사말 사진을 저장해 주세요!', variant: 'default' })
  }, [isAdminMode, photo, pushToast])

  return (
    <EditableBlock
      label="담임목사 인사말"
      className="h-full"
      renderEditor={(close) => (
        <GreetingEditor
          greeting={greeting}
          onSaved={() => {
            pushToast({ title: '인사말 저장됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
          onError={(m) => pushToast({ title: '저장 실패', description: m, variant: 'error' })}
        />
      )}
    >
      {/* 왼쪽: 사진 + 성함 / 오른쪽: 인사말 내용 */}
      <article className="grid gap-8 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-10">
        <div className="flex flex-col">
          <div className="map-ripple relative overflow-hidden rounded-[20px] shadow-[0_16px_40px_-12px_rgba(31,26,22,0.35)]">
            {photo ? (
              <img
                src={photo}
                alt={greeting.pastorName}
                className="aspect-[3/4] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <PhotoPlaceholder className="aspect-[3/4] w-full" />
            )}
            <span className="map-ripple__wave" aria-hidden />
          </div>
          <div className="mt-4 text-center sm:text-left">
            <h2 className="font-serif text-xl font-semibold text-paper-text sm:text-2xl">
              {greeting.pastorName}
            </h2>
            <p className="mt-1 text-sm text-paper-muted">담임목사</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          <blockquote className="border-l-2 border-gold pl-5 sm:pl-6">
            <p className="font-serif text-2xl font-medium leading-snug tracking-tight text-paper-text sm:text-[1.75rem]">
              {quote}
            </p>
          </blockquote>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-paper-muted sm:mt-8 sm:text-[1.05rem] sm:leading-7">
            {greeting.message}
          </p>
        </div>
      </article>
    </EditableBlock>
  )
}

function GreetingEditor({
  greeting,
  onSaved,
  onError,
}: {
  greeting: PastorGreeting
  onSaved: () => void
  onError: (m: string) => void
}) {
  const [form, setForm] = useState(greeting)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(greeting)
  }, [greeting])

  const save = async () => {
    setSaving(true)
    try {
      // 새 값이 없으면 기존 값 유지 — 둘 다 없으면 빈 값으로 저장(기본 이미지 폴백 없음).
      const photoUrl = form.photoUrl.trim() || greeting.photoUrl.trim()
      await saveDocument('pastorGreeting', 'main', {
        pastorName: form.pastorName.trim() || greeting.pastorName,
        photoUrl,
        message: form.message.trim() || greeting.message,
        quote: form.quote?.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      setForm((p) => ({ ...p, photoUrl }))
      onSaved()
    } catch (err) {
      onError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  const clearPhoto = async () => {
    setSaving(true)
    try {
      await saveDocument('pastorGreeting', 'main', {
        photoUrl: '',
        updatedAt: new Date().toISOString(),
      })
      setForm((p) => ({ ...p, photoUrl: '' }))
      onSaved()
    } catch (err) {
      onError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <FormField label="성함" htmlFor="pastor-name" required hint="화면에 표시되는 담임목사 성함·호칭">
        <Input
          id="pastor-name"
          value={form.pastorName}
          onChange={(e) => setForm({ ...form, pastorName: e.target.value })}
          placeholder="예: 유병구 목사"
        />
      </FormField>

      <div>
        <MediaInputField
          label="사진"
          imageOnly
          folder="pastor"
          value={{ mediaUrl: form.photoUrl, mediaType: 'image' }}
          defaultUrl={greeting.photoUrl}
          hint={
            greeting.photoUrl.trim()
              ? '세로 비율(3:4) 권장 · 비우면 현재 사진 유지'
              : '세로 비율(3:4) 권장 · 사진파일을 업로드해 주세요'
          }
          onChange={(m) => setForm({ ...form, photoUrl: m.mediaUrl })}
          onError={onError}
        />
        {greeting.photoUrl.trim() ? (
          <button
            type="button"
            disabled={saving}
            onClick={() => void clearPhoto()}
            className="mt-1.5 text-xs font-medium text-wine-deep underline-offset-2 transition hover:underline disabled:opacity-50"
          >
            현재 사진 제거 (안내 문구로 표시)
          </button>
        ) : null}
      </div>

      <FormField
        label="인용구 (Pull-quote)"
        htmlFor="pastor-quote"
        hint="크게 강조할 한 문장. 비우면 본문 첫 문장을 사용합니다"
      >
        <Textarea
          id="pastor-quote"
          value={form.quote ?? ''}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          placeholder="강조 문장"
          className="min-h-[72px]"
        />
      </FormField>

      <FormField label="인사말 본문" htmlFor="pastor-message" required hint="전체 인사 문구">
        <Textarea
          id="pastor-message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="인사말 본문"
          className="min-h-[140px]"
        />
      </FormField>

      <div className="flex justify-end gap-2">
        <Button disabled={saving} onClick={() => void save()}>
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
