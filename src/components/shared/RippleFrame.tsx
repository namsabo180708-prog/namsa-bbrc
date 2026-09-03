import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface RippleFrameProps {
  children: ReactNode
  /** 크기·라운드·그림자 등 개별 스타일 */
  className?: string
  as?: 'div' | 'article'
}

/**
 * 호버 시 중앙 → 바깥으로 퍼지는 원형 물결(.map-ripple)이 이는 이미지 프레임.
 * 오시는길 약도·교회소개·담임목사 인사말·교회소식 대표 이미지에 공통 사용한다.
 * `.map-ripple` 규칙은 `position: relative` + `overflow: hidden` 컨테이너와
 * 세 번째 링 역할의 `.map-ripple__wave` 자식을 요구한다 — 여기서 함께 제공한다.
 */
export function RippleFrame({ children, className, as: Comp = 'div' }: RippleFrameProps) {
  return (
    <Comp className={cn('map-ripple relative overflow-hidden', className)}>
      {children}
      <span className="map-ripple__wave" aria-hidden />
    </Comp>
  )
}
