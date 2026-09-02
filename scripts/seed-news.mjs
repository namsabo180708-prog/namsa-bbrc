#!/usr/bin/env node
/*
 * 교회소식 초기 콘텐츠 1회 시딩 — Firestore `newsPosts` 컬렉션에 기본 공지 5건을 기록한다.
 * (src/data/seed.ts 의 샘플은 로컬/미설정 환경 프리뷰용일 뿐, 실서비스 목록에는 섞이지 않는다.)
 *
 *   node scripts/seed-news.mjs                        # DRY-RUN — 무엇을 쓸지 출력만
 *   node scripts/seed-news.mjs --commit               # 실제 쓰기
 *   node scripts/seed-news.mjs --commit --key <path>  # 서비스 계정 JSON 직접 지정
 *
 * 자격증명 우선순위: --key > $GOOGLE_APPLICATION_CREDENTIALS > prd/*adminsdk*.json (1개일 때)
 * 문서 ID가 고정(seed-news-1..5)이라 여러 번 실행해도 덮어쓰기만 된다(중복 생성 없음).
 * firebase-admin 은 functions/node_modules 것을 재사용한다(루트 의존성 추가 없음).
 */
import { createRequire } from 'node:module'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(new URL('../functions/package.json', import.meta.url))
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PROJECT_ID = 'namsa-bbrc'

const args = process.argv.slice(2)
const commit = args.includes('--commit')
const keyArg = args.includes('--key') ? args[args.indexOf('--key') + 1] : null

function resolveKeyPath() {
  if (keyArg) return path.resolve(keyArg)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
  }
  const prd = path.join(ROOT, 'prd')
  let files = []
  try {
    files = readdirSync(prd).filter((f) => /adminsdk.*\.json$/i.test(f))
  } catch {
    /* prd/ 없음 */
  }
  if (files.length === 1) return path.join(prd, files[0])
  if (files.length > 1) {
    throw new Error(`prd/ 에 서비스 계정 JSON이 여러 개입니다 — --key 로 지정하세요: ${files.join(', ')}`)
  }
  throw new Error('서비스 계정 JSON을 찾을 수 없습니다 — --key 또는 GOOGLE_APPLICATION_CREDENTIALS 를 지정하세요.')
}

/** 초기 게시물 — 모두 텍스트 전용(대표 이미지 없음). 관리자가 필요 시 이미지를 추가한다. */
const POSTS = [
  {
    id: 'seed-news-1',
    title: '2026년 표어 선포 예배 안내',
    contentHtml:
      '<p>새해 표어 <strong>옛 사람을 벗고 새사람을 입자</strong>를 선포하는 예배가 진행됩니다. 온 성도가 함께 모여 한 해의 방향을 확인하는 시간입니다.</p>',
    category: '공지',
    pinned: true,
    summary: '',
    createdAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'seed-news-2',
    title: '다음세대 여름성경학교 모집',
    contentHtml:
      '<p>유치부·유초등부 여름성경학교 신청을 받습니다. 신청서는 교육관 입구에 비치되어 있습니다.</p>',
    category: '교육',
    pinned: false,
    summary: '',
    createdAt: '2026-02-10T00:00:00.000Z',
  },
  {
    id: 'seed-news-3',
    title: '선교 헌신 주일 안내',
    contentHtml: '<p>국내·국외 선교 사역을 위한 헌신 주일을 드립니다.</p>',
    category: '선교',
    pinned: false,
    summary: '',
    createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'seed-news-4',
    title: '3월 정기 제직회 및 공동의회 안내',
    contentHtml:
      '<p>주일 오후 1시 30분, 본당에서 정기 제직회와 공동의회가 열립니다. 각 부서 보고와 상반기 예산 심의가 있으니 직분자께서는 참석해 주시기 바랍니다.</p>',
    category: '공지',
    pinned: false,
    summary: '주일 오후 1시 30분 본당 · 각 부서 보고와 상반기 예산 심의',
    createdAt: '2026-03-08T00:00:00.000Z',
  },
  {
    id: 'seed-news-5',
    title: '전교인 봄 나들이 예배',
    contentHtml:
      '<p>4월 넷째 주일, 예배 후 도보 20분 거리 공원에서 함께 점심을 나눕니다. 자세한 준비물은 주보를 통해 다시 안내합니다.</p>',
    category: '행사',
    pinned: false,
    summary: '',
    createdAt: '2026-03-22T00:00:00.000Z',
  },
]

async function main() {
  const keyPath = resolveKeyPath()
  const serviceAccount = require(keyPath)
  initializeApp({ credential: cert(serviceAccount), projectId: PROJECT_ID })
  const db = getFirestore()

  console.log(`대상 프로젝트 : ${PROJECT_ID}`)
  console.log(`자격증명      : ${keyPath}`)
  console.log(`모드          : ${commit ? '실제 쓰기 (--commit)' : 'DRY-RUN (쓰지 않음)'}`)
  console.log('')

  for (const { id, ...rest } of POSTS) {
    const doc = { ...rest, thumbnail: '', authorUid: 'seed', isPublished: true, viewCount: 0 }
    console.log(`  newsPosts/${id}  ${doc.pinned ? '[고정] ' : ''}${doc.category}  "${doc.title}"`)
    if (commit) await db.collection('newsPosts').doc(id).set(doc)
  }

  if (commit) {
    const snap = await db.collection('newsPosts').orderBy('createdAt', 'desc').get()
    console.log('')
    console.log(`현재 newsPosts 문서 ${snap.size}건:`)
    snap.forEach((d) => console.log(`  - ${d.id}  "${d.get('title')}"`))
    console.log('')
    console.log(`완료: ${POSTS.length}건 기록.`)
  } else {
    console.log('')
    console.log('DRY-RUN 종료. 실제로 쓰려면 --commit 을 붙이세요.')
  }
  process.exit(0)
}

main().catch((err) => {
  console.error(err?.message ?? err)
  process.exit(1)
})
