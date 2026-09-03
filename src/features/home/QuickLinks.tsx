import { Reveal } from '../../components/shared/Reveal'
import { QuickIndex } from './QuickIndex'
import { PartnerSpotlightRail } from './PartnerSpotlightRail'

/** 홈 하단: 찾아가기 색인 + 협력기관(Spotlight Rail) — 각각 스크롤 인뷰 시 리빌 */
export function QuickLinks() {
  return (
    <>
      {/* QuickIndex는 배경이 background-attachment:fixed 라 transform 조상이 있으면 깨진다.
          → 리빌은 QuickIndex 내부(콘텐츠 div)에서 처리한다. */}
      <QuickIndex />
      <Reveal>
        <PartnerSpotlightRail />
      </Reveal>
    </>
  )
}
