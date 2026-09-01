import type { RouteIconType } from '../../types/content'

/** 교통수단별 시각 액센트 — Stone & Leaf 위에 얹는 구분 색 */
export const ROUTE_ACCENT: Record<
  RouteIconType,
  { chip: string; ink: string; bar: string; label: string }
> = {
  subway: {
    chip: 'bg-[#4a6fa5]/15 text-[#4a6fa5]',
    ink: 'text-[#4a6fa5]',
    bar: 'bg-[#4a6fa5]',
    label: '지하철',
  },
  bus: {
    chip: 'bg-[#3d6ea8]/15 text-[#3d6ea8]',
    ink: 'text-[#3d6ea8]',
    bar: 'bg-[#3d6ea8]',
    label: '버스',
  },
  walk: {
    chip: 'bg-gold/15 text-gold-deep',
    ink: 'text-gold-deep',
    bar: 'bg-gold',
    label: '도보',
  },
}
