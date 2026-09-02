import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage } from '../components/shared/TabbedPage'
import { EditableBlock } from '../components/shared/EditableBlock'
import { ContactInfoEditor } from '../features/contact/ContactInfoEditor'
import { RouteListPanel } from '../features/contact/RouteListPanel'
import { ParkingPanel } from '../features/contact/ParkingPanel'
import { MapImagePanel } from '../features/contact/MapImagePanel'
import { getContactInfo, saveDocument } from '../lib/content-service'
import { toTelHref } from '../lib/utils'
import type { ContactInfo } from '../types/content'
import { seedContact } from '../data/seed'
import { useAdminStore } from '../store/admin-store'
import { Globe, Mail, MapPin, Phone, Printer } from 'lucide-react'

/**
 * 세션 캐시: 다른 메뉴 왕복 시 seed 약도가 잠깐 보이는 깜빡임을 막는다.
 * 강력 새로고침 시에는 null → 스켈레톤 → Firestore 실제 약도.
 */
let cachedContact: ContactInfo | null = null

function ContactSkeleton() {
  return (
    <div className="space-y-10 py-2" aria-busy="true" aria-label="오시는길 불러오는 중">
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <div className="min-h-[280px] animate-pulse rounded-[20px] bg-paper-dim" />
        <div className="min-h-[280px] animate-pulse rounded-[20px] bg-paper-dim" />
      </div>
      <div className="h-40 animate-pulse rounded-[14px] bg-paper-dim" />
    </div>
  )
}

export function ContactPage() {
  const [contact, setContact] = useState<ContactInfo | null>(cachedContact)
  const pushToast = useAdminStore((s) => s.pushToast)

  const reload = useCallback(async () => {
    const next = await getContactInfo()
    cachedContact = next
    setContact(next)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return (
    <>
      <Seo title="오시는길" path="/contact" />
      <PageShell
        title="오시는길"
        description="예배 장소와 연락처, 지도 안내입니다."
        current="오시는길"
      >
        {!contact ? (
          <ContactSkeleton />
        ) : (
        <TabbedPage
          variant="segmented"
          tabs={[
            {
              key: 'directions',
              label: '오시는 방법',
              content: (
                <div className="space-y-10 py-2">
                  <div className="grid items-stretch gap-6 lg:grid-cols-2">
                    <EditableBlock
                      label="연락처 정보"
                      className="h-full"
                      renderEditor={(close) => (
                        <ContactInfoEditor
                          contact={contact}
                          onSave={async (next) => {
                            try {
                              await saveDocument('contactInfo', 'main', {
                                address: next.address,
                                addressEn: next.addressEn,
                                phone: next.phone,
                                fax: next.fax,
                                email: next.email,
                                siteUrl: next.siteUrl,
                              })
                              pushToast({ title: '연락처 저장됨', variant: 'success' })
                              await reload()
                              close()
                            } catch (err) {
                              pushToast({
                                title: '저장 실패',
                                description: err instanceof Error ? err.message : '',
                                variant: 'error',
                              })
                            }
                          }}
                        />
                      )}
                    >
                      <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-[20px] border border-paper-line bg-paper">
                        <div className="shrink-0 border-b border-paper-line px-5 py-4 sm:px-6">
                          <h2 className="font-serif text-lg font-semibold tracking-tight text-paper-text sm:text-xl">
                            교회 연락처
                          </h2>
                        </div>

                        <div className="flex flex-1 flex-col justify-between gap-5 px-5 py-5 sm:px-6">
                          <div className="space-y-4">
                            <p className="flex items-center gap-2 text-xs font-medium text-paper-muted">
                              <MapPin className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                              주소
                            </p>
                            <div className="space-y-4">
                              <AddressLine
                                flag="kr"
                                label="Korea"
                                value={contact.address}
                              />
                              <AddressLine
                                flag="en"
                                label="English"
                                value={contact.addressEn || seedContact.addressEn}
                              />
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <ContactChip
                              icon={Phone}
                              label="전화"
                              value={contact.phone}
                              href={contact.phone ? toTelHref(contact.phone) : undefined}
                            />
                            <ContactChip icon={Printer} label="팩스" value={contact.fax} />
                            <ContactChip
                              icon={Mail}
                              label="이메일"
                              value={contact.email}
                              href={contact.email ? `mailto:${contact.email}` : undefined}
                            />
                            {contact.siteUrl ? (
                              <ContactChip
                                icon={Globe}
                                label="홈페이지"
                                value={contact.siteUrl.replace(/^https?:\/\//, '')}
                                href={contact.siteUrl}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </EditableBlock>

                    <div className="h-full min-h-[280px]">
                      <MapImagePanel contact={contact} onUpdated={() => void reload()} />
                    </div>
                  </div>

                  <RouteListPanel routes={contact.routes} onUpdated={() => void reload()} />
                </div>
              ),
            },
            {
              key: 'parking',
              label: '주차안내',
              content: (
                <div className="py-2">
                  <ParkingPanel contact={contact} onUpdated={() => void reload()} />
                </div>
              ),
            },
          ]}
        />
        )}
      </PageShell>
    </>
  )
}

/** 국기 이모지 배지 — 한글/영문 주소 구분용 */
function FlagBadge({ flag }: { flag: 'kr' | 'en' }) {
  const meta =
    flag === 'kr'
      ? { emoji: '🇰🇷', label: '대한민국' }
      : { emoji: '🇺🇸', label: 'English' }
  return (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-dim text-lg leading-none ring-1 ring-paper-line"
      role="img"
      aria-label={meta.label}
    >
      {meta.emoji}
    </span>
  )
}

function AddressLine({
  flag,
  label,
  value,
}: {
  flag: 'kr' | 'en'
  label: string
  value: string
}) {
  if (!value?.trim()) return null
  return (
    <div className="flex gap-3 rounded-[14px] border border-paper-line bg-paper-dim/60 px-3.5 py-3">
      <FlagBadge flag={flag} />
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-paper-muted">{label}</p>
        <p className="mt-0.5 text-sm font-medium leading-relaxed text-paper-text">{value}</p>
      </div>
    </div>
  )
}

function ContactChip({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof MapPin
  label: string
  value: string
  href?: string
}) {
  if (!value?.trim()) return null
  const valueNode = href ? (
    <a
      href={href}
      className="mt-0.5 block break-all text-sm font-medium text-paper-text underline-offset-2 transition hover:text-gold-deep hover:underline"
    >
      {value}
    </a>
  ) : (
    <p className="mt-0.5 break-all text-sm font-medium text-paper-text">{value}</p>
  )

  return (
    <div className="flex min-h-[4.25rem] items-start gap-3 rounded-[14px] border border-paper-line px-3.5 py-3">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold-deep">
        <Icon className="h-3.5 w-3.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-paper-muted">{label}</p>
        {valueNode}
      </div>
    </div>
  )
}
