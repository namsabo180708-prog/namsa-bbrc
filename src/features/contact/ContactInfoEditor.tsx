import { useEffect, useState } from 'react'
import { FormField } from '../../components/ui/form-field'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import type { ContactInfo } from '../../types/content'

/** 오시는길 탭·푸터에서 공용으로 편집하는 연락처 필드 (contactInfo/main) */
export type ContactInfoFields = Pick<
  ContactInfo,
  'address' | 'addressEn' | 'phone' | 'fax' | 'email' | 'siteUrl'
>

const CONTACT_FIELDS = [
  {
    key: 'address' as const,
    label: '한글 주소',
    hint: '예: 17115 경기도 용인시 …',
    placeholder: '우편번호 + 도로명 주소',
    multiline: true,
  },
  {
    key: 'addressEn' as const,
    label: '영문 주소',
    hint: '영문 표기 주소',
    placeholder: '896 Cheoinseong-ro, …',
    multiline: true,
  },
  {
    key: 'phone' as const,
    label: '전화',
    hint: '대표 전화번호',
    placeholder: '031-000-0000',
  },
  {
    key: 'fax' as const,
    label: '팩스',
    hint: '없으면 비워 두어도 됩니다',
    placeholder: '031-000-0001',
  },
  {
    key: 'email' as const,
    label: '이메일',
    hint: '문의용 공개 이메일',
    placeholder: 'info@…',
  },
  {
    key: 'siteUrl' as const,
    label: '홈페이지',
    hint: 'https:// 포함 권장',
    placeholder: 'https://…',
  },
]

export function ContactInfoEditor({
  contact,
  onSave,
}: {
  contact: ContactInfo
  onSave: (c: ContactInfoFields) => Promise<void>
}) {
  const [form, setForm] = useState(contact)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(contact)
  }, [contact])

  return (
    <div className="space-y-4">
      {CONTACT_FIELDS.map((f) =>
        f.multiline ? (
          <FormField key={f.key} label={f.label} htmlFor={`contact-${f.key}`} hint={f.hint}>
            <Textarea
              id={`contact-${f.key}`}
              className="min-h-[80px]"
              value={form[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          </FormField>
        ) : (
          <FormField key={f.key} label={f.label} htmlFor={`contact-${f.key}`} hint={f.hint}>
            <Input
              id={`contact-${f.key}`}
              value={form[f.key]}
              placeholder={f.placeholder}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            />
          </FormField>
        ),
      )}
      <div className="flex justify-end">
        <Button
          disabled={saving}
          onClick={() => {
            setSaving(true)
            void onSave({
              // 비운 필드는 기존 값 유지 (미디어와 동일 정책)
              address: form.address.trim() || contact.address,
              addressEn: form.addressEn.trim() || contact.addressEn,
              phone: form.phone.trim() || contact.phone,
              fax: form.fax.trim() || contact.fax,
              email: form.email.trim() || contact.email,
              siteUrl: form.siteUrl.trim() || contact.siteUrl,
            }).finally(() => setSaving(false))
          }}
        >
          저장 후 게시
        </Button>
      </div>
    </div>
  )
}
