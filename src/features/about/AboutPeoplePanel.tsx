import { useEffect, useState, type KeyboardEvent } from 'react'
import type { StaffMember } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { PhotoPlaceholder } from '../../components/shared/PhotoPlaceholder'
import { RippleFrame } from '../../components/shared/RippleFrame'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { FormField } from '../../components/ui/form-field'
import { MediaInputField } from '../../components/shared/MediaInputField'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { removeDocument, saveDocument } from '../../lib/content-service'
import { useAdminStore } from '../../store/admin-store'
import { Reveal } from '../../components/shared/Reveal'
import { Plus } from 'lucide-react'

/**
 * 사역자소개·장로소개는 동일한 인물 카드 로직을 공유한다. 그룹별로 Firestore 컬렉션과
 * 라벨/스토리지 폴더만 다르다.
 */
interface PeopleGroupConfig {
  /** Firestore 컬렉션 이름 */
  collection: string
  /** 새 문서 ID 접두사 */
  idPrefix: string
  /** 사진 업로드 스토리지 폴더 */
  storageFolder: string
  /** 섹션 눈썹 문구 */
  eyebrow: string
  /** 섹션 제목 */
  heading: string
  /** 추가 버튼 라벨 */
  addLabel: string
  /** 토스트·확인창·빈 목록 문구에 쓰는 단위 명칭 (예: 사역자 / 장로) */
  unit: string
}

const STAFF_GROUP: PeopleGroupConfig = {
  collection: 'staffMembers',
  idPrefix: 'staff',
  storageFolder: 'about/staff',
  eyebrow: '함께 섬기는 이들',
  heading: '사역자소개',
  addLabel: '사역자 추가',
  unit: '사역자',
}

const ELDER_GROUP: PeopleGroupConfig = {
  collection: 'elders',
  idPrefix: 'elder',
  storageFolder: 'about/elders',
  eyebrow: '교회를 세우는 이들',
  heading: '장로소개',
  addLabel: '장로 추가',
  unit: '장로',
}

interface Props {
  members: StaffMember[]
  onUpdated?: () => void
}

export function AboutStaffPanel(props: Props) {
  return <AboutPeoplePanel {...props} group={STAFF_GROUP} />
}

export function AboutEldersPanel(props: Props) {
  return <AboutPeoplePanel {...props} group={ELDER_GROUP} />
}

function AboutPeoplePanel({
  members,
  onUpdated,
  group,
}: Props & { group: PeopleGroupConfig }) {
  const isAdminMode = useAdminStore((s) => s.isAdminMode)
  const pushToast = useAdminStore((s) => s.pushToast)
  const sorted = [...members].sort((a, b) => a.order - b.order)

  const addMember = async () => {
    try {
      const id = `${group.idPrefix}_${Date.now()}`
      const maxOrder = sorted.reduce((m, s) => Math.max(m, s.order), 0)
      await saveDocument(group.collection, id, {
        name: `새 ${group.unit}`,
        role: '직분',
        photoUrl: '',
        order: maxOrder + 1,
      })
      pushToast({
        title: `${group.unit}가 추가되었습니다`,
        description: '사진파일을 업로드하세요.',
        variant: 'default',
      })
      onUpdated?.()
    } catch (err) {
      pushToast({
        title: '추가 실패',
        description: err instanceof Error ? err.message : '',
        variant: 'error',
      })
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3 border-b border-paper-line pb-6">
          <div>
            <p className="index-num text-xs font-semibold tracking-[0.14em] text-gold-deep">
              {group.eyebrow}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-paper-text sm:text-3xl">
              {group.heading}
            </h2>
          </div>
          {isAdminMode ? (
            <Button type="button" size="sm" onClick={() => void addMember()}>
              <Plus className="h-4 w-4" />
              {group.addLabel}
            </Button>
          ) : null}
        </div>
      </Reveal>

      {sorted.length === 0 ? (
        <p className="text-sm text-paper-muted">등록된 {group.unit}가 없습니다.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((m, i) => (
            <Reveal key={m.id} delay={i * 50}>
              <PersonCard member={m} group={group} onUpdated={onUpdated} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

function PersonCard({
  member,
  group,
  onUpdated,
}: {
  member: StaffMember
  group: PeopleGroupConfig
  onUpdated?: () => void
}) {
  const pushToast = useAdminStore((s) => s.pushToast)
  const photo = member.photoUrl.trim()

  return (
    <EditableBlock
      label={`${member.name} ${group.unit}`}
      renderEditor={(close) => (
        <PersonEditor
          member={member}
          group={group}
          onSaved={() => {
            pushToast({ title: '저장됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
          onDeleted={() => {
            pushToast({ title: '삭제됨', variant: 'success' })
            onUpdated?.()
            close()
          }}
          onError={(m) => pushToast({ title: '실패', description: m, variant: 'error' })}
        />
      )}
    >
      <RippleFrame
        as="article"
        className="group aspect-[3/4] w-full rounded-[20px] shadow-[0_16px_40px_-12px_rgba(31,26,22,0.35)]"
      >
        {photo ? (
          <img
            src={photo}
            alt={member.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <PhotoPlaceholder className="absolute inset-0" />
        )}
        {/* 촛불빛이 닿는 순간 — 호버 시 골드 헤어라인 프레임이 번져 나타난다 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-2 z-20 scale-[0.97] border border-gold opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100"
        />
        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-gold/40 bg-ink/85 px-3 py-2 transition-all duration-500 ease-out group-hover:-translate-y-0.5 group-hover:border-gold/90">
          <p className="text-xs font-semibold tracking-wide text-paper/80">{member.role}</p>
          <h3 className="mt-0.5 font-serif font-medium text-paper">{member.name}</h3>
        </div>
      </RippleFrame>
    </EditableBlock>
  )
}

function PersonEditor({
  member,
  group,
  onSaved,
  onDeleted,
  onError,
}: {
  member: StaffMember
  group: PeopleGroupConfig
  onSaved: () => void
  onDeleted: () => void
  onError: (m: string) => void
}) {
  const [form, setForm] = useState(member)
  const [saving, setSaving] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    setForm(member)
  }, [member])

  const save = async () => {
    setSaving(true)
    try {
      await saveDocument(group.collection, member.id, {
        name: form.name.trim() || member.name,
        role: form.role.trim() || member.role,
        photoUrl: form.photoUrl.trim() || member.photoUrl,
        order: Number(form.order) || 0,
      })
      onSaved()
    } catch (err) {
      onError(err instanceof Error ? err.message : '저장 실패')
    } finally {
      setSaving(false)
    }
  }

  /** 단일 행 입력에서 Enter → 저장 (한글 조합 중이거나 저장 중이면 무시) */
  const handleEnterSave = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing || saving) return
    e.preventDefault()
    void save()
  }

  const remove = async () => {
    setSaving(true)
    try {
      await removeDocument(group.collection, member.id)
      setConfirmOpen(false)
      onDeleted()
    } catch (err) {
      onError(err instanceof Error ? err.message : '삭제 실패')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <MediaInputField
        label="프로필 사진"
        imageOnly
        folder={group.storageFolder}
        value={{ mediaUrl: form.photoUrl, mediaType: 'image' }}
        defaultUrl={member.photoUrl}
        hint={
          member.photoUrl.trim()
            ? '프로필 썸네일 · 3:4 세로 표시 · 비우면 현재 사진 유지'
            : '프로필 썸네일 · 3:4 세로 표시 · 사진파일을 업로드하세요'
        }
        onChange={(m) => setForm({ ...form, photoUrl: m.mediaUrl })}
        onError={onError}
      />
      <FormField label="직분" htmlFor={`role-${member.id}`} required>
        <Input
          id={`role-${member.id}`}
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          onKeyDown={handleEnterSave}
        />
      </FormField>
      <FormField label="이름" htmlFor={`name-${member.id}`} required>
        <Input
          id={`name-${member.id}`}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onKeyDown={handleEnterSave}
        />
      </FormField>
      <FormField label="표시 순서" htmlFor={`order-${member.id}`} hint="숫자가 작을수록 앞">
        <Input
          id={`order-${member.id}`}
          type="number"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          onKeyDown={handleEnterSave}
        />
      </FormField>
      <div className="flex flex-wrap justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => setConfirmOpen(true)}
          className="border-wine/30 bg-paper/80 text-wine-deep hover:bg-wine/10"
        >
          삭제
        </Button>
        <Button disabled={saving} onClick={() => void save()}>
          저장 후 게시
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={(v) => !saving && setConfirmOpen(v)}>
        <DialogContent className="w-[min(92vw,24rem)]">
          <DialogHeader>
            <DialogTitle>{group.unit} 삭제</DialogTitle>
            <DialogDescription>
              {member.name} {group.unit} 정보를 삭제할까요? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2 border-t border-paper-line/60 pt-3">
            <Button
              variant="ghost"
              size="sm"
              disabled={saving}
              onClick={() => setConfirmOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={saving}
              onClick={() => void remove()}
              className="border-wine/30 bg-wine/10 text-wine-deep hover:bg-wine/20"
            >
              {saving ? '삭제 중…' : '삭제'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
