import type { ContactRoute } from '../../types/content'
import { EditableBlock } from '../../components/shared/EditableBlock'
import { saveDocument } from '../../lib/content-service'
import { ROUTE_ICON_TYPES, routesByIconType } from '../../lib/contact-route'
import { useAdminStore } from '../../store/admin-store'
import { cn } from '../../lib/utils'
import { RouteIcon } from './RouteIcon'
import { RouteEditor } from './RouteEditor'
import { ROUTE_ACCENT } from './route-accent'

const GROUP_TITLES: Record<string, string> = {
  subway: '지하철로 오실 때',
  bus: '버스로 오실 때',
  walk: '도보로 오실 때',
}

interface Props {
  routes: ContactRoute[]
  onUpdated?: () => void
}

/**
 * 교통편 안내 — 수단별 컬러 칩 + 행 좌측 세로 액센트.
 * 타이틀(세미볼드)과 설명(뮤티드) 위계를 분리해 가독성을 높인다.
 */
export function RouteListPanel({ routes, onUpdated }: Props) {
  const pushToast = useAdminStore((s) => s.pushToast)

  return (
    <EditableBlock
      label="오시는 방법 경로 안내"
      renderEditor={(close) => (
        <RouteEditor
          routes={routes}
          onSave={async (next) => {
            try {
              await saveDocument('contactInfo', 'main', { routes: next })
              pushToast({ title: '경로 안내 저장됨', variant: 'success' })
              onUpdated?.()
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
      <div className="space-y-10">
        {ROUTE_ICON_TYPES.map((iconType) => {
          const group = routesByIconType(routes, iconType)
          if (group.length === 0) return null
          const accent = ROUTE_ACCENT[iconType]
          return (
            <section key={iconType} aria-labelledby={`route-group-${iconType}`}>
              <h3
                id={`route-group-${iconType}`}
                className="mb-4 flex items-center gap-3 font-serif text-lg font-semibold text-paper-text"
              >
                <span
                  className={cn(
                    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    accent.chip,
                  )}
                  aria-hidden
                >
                  <RouteIcon iconType={iconType} className="h-[1.125rem] w-[1.125rem]" />
                </span>
                {GROUP_TITLES[iconType]}
              </h3>

              <ul className="space-y-3">
                {group.map((route) => (
                  <li
                    key={route.id}
                    className="relative overflow-hidden rounded-[14px] border border-paper-line bg-paper py-4 pl-4 pr-4 sm:pl-5"
                  >
                    <span
                      className={cn('absolute inset-y-0 left-0 w-1', accent.bar)}
                      aria-hidden
                    />
                    <div className="min-w-0 pl-2">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-paper-text">
                        <RouteIcon
                          iconType={iconType}
                          className={cn('h-4 w-4 shrink-0', accent.ink)}
                          aria-hidden
                        />
                        <span>{route.title}</span>
                      </p>
                      <p className="mt-2 border-t border-paper-line/80 pt-2 text-sm leading-relaxed text-paper-muted whitespace-pre-line">
                        {route.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        {routes.length === 0 ? (
          <p className="text-sm text-paper-muted">등록된 경로 안내가 없습니다.</p>
        ) : null}
      </div>
    </EditableBlock>
  )
}
