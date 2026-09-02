import type { EducationDepartment } from '../types/content'
import { seedEducation } from '../data/seed'

/** 삭제 불가 고정 부서 순서. */
export const EDUCATION_DEPT_ORDER = ['elementary', 'youth', 'youngadult'] as const

/** 삭제 불가 기본 부서 여부. */
export function isDefaultEducationDept(deptKey: string): boolean {
  return (EDUCATION_DEPT_ORDER as readonly string[]).includes(deptKey)
}

function requiredField(remote: string | undefined, fallback: string): string {
  const value = remote?.trim()
  return value || fallback
}

/** 원격에 키가 있으면(빈 문자열 포함) 유지. 키가 없을 때만 시드. */
function optionalField(remote: string | undefined, fallback: string | undefined): string {
  if (remote === undefined) return fallback ?? ''
  return remote
}

function mergeDept(fromRemote: EducationDepartment, fromSeed: EducationDepartment): EducationDepartment {
  return {
    ...fromSeed,
    ...fromRemote,
    name: requiredField(fromRemote.name, fromSeed.name),
    missionText: requiredField(fromRemote.missionText, fromSeed.missionText),
    image: requiredField(fromRemote.image, fromSeed.image),
    scheduleInfo: requiredField(fromRemote.scheduleInfo, fromSeed.scheduleInfo),
    targetAge: optionalField(fromRemote.targetAge, fromSeed.targetAge),
    place: optionalField(fromRemote.place, fromSeed.place),
  }
}

/**
 * 유초등부·중고등부·청년대학부는 고정 순서로 시드와 병합해 항상 노출하고,
 * 관리자가 추가한 부서(기본 3개 외 deptKey)는 그 뒤에 order 오름차순으로 이어붙인다.
 */
export function orderEducationDepartments(
  remote: EducationDepartment[],
  seeds: EducationDepartment[] = seedEducation,
): EducationDepartment[] {
  const defaults = EDUCATION_DEPT_ORDER.flatMap((key) => {
    const fromRemote = remote.find((d) => d.deptKey === key)
    const fromSeed = seeds.find((d) => d.deptKey === key)
    if (!fromSeed) return fromRemote ? [fromRemote] : []
    if (!fromRemote) return [fromSeed]
    return [mergeDept(fromRemote, fromSeed)]
  })

  const customs = remote
    .filter((d) => !isDefaultEducationDept(d.deptKey))
    .sort((a, b) => a.order - b.order)

  return [...defaults, ...customs]
}

/**
 * 관리자 "부서 추가"로 생성되는 빈 부서 — 저장 후 해당 탭에서 개별 수정한다.
 * 대표사진은 기본/시드 이미지를 넣지 않고 빈 값으로 두며, 관리자가 직접 업로드한다
 * (교회소개·담임목사소개·사역자소개·장로소개와 동일한 정책).
 */
export function createBlankEducationDept(order: number, now = Date.now()): EducationDepartment {
  return {
    id: `edu_${now}`,
    deptKey: `custom_${now}`,
    name: '새 부서',
    missionText: '',
    image: '',
    scheduleInfo: '',
    targetAge: '',
    place: '',
    order,
  }
}
