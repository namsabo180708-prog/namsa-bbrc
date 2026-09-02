import { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { isDisplayableImageUrl } from '../../lib/news-post'
import { NEWS_CATEGORIES, type NewsCategory, type NewsPost } from '../../types/content'

export interface NewsEditorPayload {
  title: string
  contentHtml: string
  thumbnail: string
  category: NewsCategory
  pinned: boolean
  summary: string
}

interface NewsEditorFormProps {
  /** 있으면 수정 모드(필드 프리필) · 없으면 새 글 작성 모드 */
  post?: NewsPost
  submitLabel?: string
  onSubmit: (payload: NewsEditorPayload) => Promise<void>
  onError: (m: string) => void
}

/** 새 글 작성/수정 공용 폼. 저장은 곧 게시 — 별도 임시저장 상태를 두지 않는다. */
export function NewsEditorForm({ post, submitLabel, onSubmit, onError }: NewsEditorFormProps) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [contentHtml, setContentHtml] = useState(post?.contentHtml ?? '<p></p>')
  const [thumbnail, setThumbnail] = useState(post?.thumbnail ?? '')
  const [category, setCategory] = useState<NewsCategory>(post?.category ?? '일반')
  const [pinned, setPinned] = useState(post?.pinned ?? false)
  const [summary, setSummary] = useState(post?.summary ?? '')
  const [saving, setSaving] = useState(false)

  return (
    <div className="space-y-4">
      <FormField label="제목" htmlFor="news-title" required hint="목록·상세에 표시되는 글 제목">
        <Input
          id="news-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="분류" htmlFor="news-category" hint="목록의 분류 필터에 쓰입니다">
          <select
            id="news-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as NewsCategory)}
            className="flex h-10 w-full rounded-sm border border-paper-line bg-paper px-3 py-2 text-sm text-paper-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
          >
            {NEWS_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="상단 고정" htmlFor="news-pinned" hint="목록 맨 위에 고정합니다">
          <label
            htmlFor="news-pinned"
            className="flex h-10 items-center gap-2 text-sm text-paper-text"
          >
            <input
              id="news-pinned"
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            이 소식을 고정
          </label>
        </FormField>
      </div>

      <FormField
        label="요약"
        htmlFor="news-summary"
        hint="1~2줄 · 비우면 본문 첫 부분이 자동 사용됩니다"
      >
        <Textarea
          id="news-summary"
          className="min-h-[60px]"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="목록에 보일 짧은 요약 (선택)"
        />
      </FormField>

      <MediaInputField
        label="대표 이미지"
        imageOnly
        folder="news"
        value={{ mediaUrl: thumbnail, mediaType: 'image' }}
        defaultUrl={post?.thumbnail ?? ''}
        hint="선택 · 이미지 주소만 (YouTube·영상 링크 불가). 비우면 텍스트만 표시됩니다."
        onChange={(m) => setThumbnail(m.mediaUrl)}
        onError={onError}
      />
      {thumbnail.trim() && !isDisplayableImageUrl(thumbnail) ? (
        <p className="text-xs text-wine">
          이미지 주소가 아닙니다. YouTube·영상 링크는 대표 이미지로 쓸 수 없습니다.
        </p>
      ) : null}

      <FormField
        label="본문 (HTML)"
        htmlFor="news-body"
        required
        hint="p, h1~h6, strong 등. 저장 시 서버/클라이언트 sanitize 적용"
      >
        <Textarea
          id="news-body"
          className="min-h-[180px] font-mono text-xs"
          value={contentHtml}
          onChange={(e) => setContentHtml(e.target.value)}
          placeholder="<p>본문…</p>"
        />
      </FormField>

      <div className="flex justify-end">
        <Button
          disabled={saving || !title.trim()}
          onClick={() => {
            const cleanThumb = thumbnail.trim()
            if (cleanThumb && !isDisplayableImageUrl(cleanThumb)) {
              onError('대표 이미지에는 이미지 주소만 넣을 수 있습니다. (YouTube·영상 링크 불가)')
              return
            }
            setSaving(true)
            void onSubmit({
              title: title.trim(),
              contentHtml,
              thumbnail: cleanThumb,
              category,
              pinned,
              summary: summary.trim(),
            }).finally(() => setSaving(false))
          }}
        >
          {submitLabel ?? '게시'}
        </Button>
      </div>
    </div>
  )
}
