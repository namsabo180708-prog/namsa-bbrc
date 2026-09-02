import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage } from '../components/shared/TabbedPage'
import { AboutChurchPanel } from '../features/about/AboutChurchPanel'
import { AboutPastorPanel } from '../features/about/AboutPastorPanel'
import { AboutEldersPanel, AboutStaffPanel } from '../features/about/AboutPeoplePanel'
import {
  getAboutChurch,
  getAboutPastor,
  getElders,
  getStaffMembers,
} from '../lib/content-service'
import type { AboutChurch, AboutPastor, StaffMember } from '../types/content'

interface AboutData {
  church: AboutChurch
  pastor: AboutPastor
  elders: StaffMember[]
  staff: StaffMember[]
}

/**
 * 세션 캐시: 라우팅 왕복·새로고침마다 state가 초기화되면서 seed 사진(교회전경·담임목사 사진 등)이
 * 2~3초 노출된 뒤 Firestore 응답으로 교체되는 깜빡임을 막는다. 세션 내 마지막으로 불러온 값을
 * 보관해 두었다가 다음 마운트의 초기값으로 재사용한다.
 * 강력 새로고침 시에는 null → 스켈레톤 → Firestore 실제 데이터.
 */
let cachedAbout: AboutData | null = null

/** 세션 내 첫 로딩 동안 노출: seed 사진 대신 중립 스켈레톤 — 실제 콘텐츠로 오인되지 않게 한다. */
function AboutSkeleton() {
  return (
    <div className="py-6 sm:py-10" aria-busy="true" aria-label="교회소개 불러오는 중">
      <div className="mx-auto flex max-w-md gap-2">
        <div className="h-9 flex-1 animate-pulse rounded-full bg-paper-dim" />
        <div className="h-9 flex-1 animate-pulse rounded-full bg-paper-dim" />
        <div className="h-9 flex-1 animate-pulse rounded-full bg-paper-dim" />
      </div>
      <div className="mx-auto mt-8 grid w-full max-w-6xl items-stretch gap-6 px-4 md:grid-cols-3 md:gap-8 sm:px-6 lg:gap-10">
        <div className="aspect-[16/10] w-full animate-pulse bg-paper-dim md:col-span-2 md:aspect-auto md:min-h-[320px]" />
        <div className="space-y-3 border-l border-paper-line pl-6 md:col-span-1 md:pl-8">
          <div className="h-7 w-40 animate-pulse rounded bg-paper-dim" />
          <div className="h-4 w-full animate-pulse rounded bg-paper-dim" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-paper-dim" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-paper-dim" />
        </div>
      </div>
    </div>
  )
}

/** 아직 콘텐츠가 없는 탭용 안내 화면. */
function AboutComingSoon({ label }: { label: string }) {
  return (
    <div className="flex min-h-[calc(100dvh-16rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="index-num text-xs font-semibold tracking-[0.14em] text-gold-deep">{label}</p>
      <p className="mt-3 font-serif text-lg text-paper-muted sm:text-xl">곧 구현할 예정입니다.</p>
    </div>
  )
}

export function AboutPage() {
  const [data, setData] = useState<AboutData | null>(cachedAbout)

  const reload = useCallback(async () => {
    const [church, pastor, elders, staff] = await Promise.all([
      getAboutChurch(),
      getAboutPastor(),
      getElders(),
      getStaffMembers(),
    ])
    cachedAbout = { church, pastor, elders, staff }
    setData(cachedAbout)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return (
    <>
      <Seo title="교회소개" path="/about" />
      <PageShell
        title="교회소개"
        description="교회의 비전과 사역, 섬기는 이들을 소개합니다."
        current="교회소개"
      >
        {data ? (
          <TabbedPage
            variant="segmented"
            tabs={[
              {
                key: 'church',
                label: '교회소개',
                content: <AboutChurchPanel data={data.church} onUpdated={() => void reload()} />,
              },
              {
                key: 'history',
                label: '교회연혁',
                content: <AboutComingSoon label="교회연혁" />,
              },
              {
                key: 'pastor',
                label: '담임목사소개',
                content: <AboutPastorPanel data={data.pastor} onUpdated={() => void reload()} />,
              },
              {
                key: 'elders',
                label: '장로소개',
                content: <AboutEldersPanel members={data.elders} onUpdated={() => void reload()} />,
              },
              {
                key: 'staff',
                label: '사역자소개',
                content: <AboutStaffPanel members={data.staff} onUpdated={() => void reload()} />,
              },
            ]}
          />
        ) : (
          <AboutSkeleton />
        )}
      </PageShell>
    </>
  )
}
