import { useCallback, useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Seo } from '../components/shared/Seo'
import { TabbedPage, type TabItem } from '../components/shared/TabbedPage'
import { EducationDeptPanel } from '../features/education/EducationDeptPanel'
import { EducationDeptManagePanel } from '../features/education/EducationDeptManagePanel'
import { getEducationDepartments } from '../lib/content-service'
import type { EducationDepartment } from '../types/content'
import { useAdminStore } from '../store/admin-store'

/**
 * 세션 캐시: 라우팅 왕복·새로고침마다 state가 초기화되면서 seed 대표사진(placeholder)이
 * 2~3초 노출된 뒤 Firestore 응답으로 교체되는 깜빡임을 막는다. 세션 내 마지막으로 불러온
 * 부서 목록을 보관해 두었다가 다음 마운트의 초기값으로 재사용한다.
 * 강력 새로고침 시에는 null → 스켈레톤 → Firestore 실제 데이터.
 */
let cachedDepts: EducationDepartment[] | null = null

/** 세션 내 첫 로딩 동안 노출: seed 사진 대신 중립 스켈레톤 — 실제 콘텐츠로 오인되지 않게 한다. */
function EducationSkeleton() {
  return (
    <div className="py-4 sm:py-6" aria-busy="true" aria-label="교육부서 불러오는 중">
      <div className="mx-auto flex max-w-md gap-2">
        <div className="h-9 flex-1 animate-pulse rounded-full bg-paper-dim" />
        <div className="h-9 flex-1 animate-pulse rounded-full bg-paper-dim" />
        <div className="h-9 flex-1 animate-pulse rounded-full bg-paper-dim" />
      </div>
      <div className="mx-auto mt-8 grid w-full max-w-6xl items-start gap-6 px-1 md:grid-cols-3 md:gap-8 sm:px-0 lg:gap-10">
        <div className="aspect-[16/10] w-full animate-pulse bg-paper-dim md:col-span-2" />
        <div className="space-y-3 border-l border-paper-line pl-6 md:col-span-1 md:pl-8">
          <div className="h-3 w-20 animate-pulse rounded bg-paper-dim" />
          <div className="h-7 w-40 animate-pulse rounded bg-paper-dim" />
          <div className="h-4 w-32 animate-pulse rounded bg-paper-dim" />
          <div className="h-20 w-full animate-pulse rounded bg-paper-dim" />
        </div>
      </div>
    </div>
  )
}

export function EducationPage() {
  const [depts, setDepts] = useState<EducationDepartment[] | null>(cachedDepts)
  const isAdminMode = useAdminStore((s) => s.isAdminMode)

  const reload = useCallback(async () => {
    const next = await getEducationDepartments()
    cachedDepts = next
    setDepts(next)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const tabs: TabItem[] = (depts ?? []).map((dept) => ({
    key: dept.deptKey,
    label: dept.name,
    content: <EducationDeptPanel dept={dept} onUpdated={() => void reload()} />,
  }))

  if (isAdminMode && depts) {
    tabs.push({
      key: '__manage__',
      label: '부서추가/삭제',
      content: <EducationDeptManagePanel depts={depts} onUpdated={() => void reload()} />,
    })
  }

  return (
    <>
      <Seo title="교육부서" path="/education" />
      <PageShell
        title="교육부서"
        description="다음세대를 말씀으로 양육하는 교육 사역을 소개합니다."
        current="교육부서"
      >
        {depts ? (
          <TabbedPage tabs={tabs} defaultTab="elementary" variant="segmented" />
        ) : (
          <EducationSkeleton />
        )}
      </PageShell>
    </>
  )
}
