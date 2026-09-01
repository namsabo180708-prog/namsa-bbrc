import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

export const Tabs = TabsPrimitive.Root

export type TabsVariant = 'underline' | 'segmented'

export function TabsList({
  className,
  variant = 'underline',
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & { variant?: TabsVariant }) {
  return (
    <TabsPrimitive.List
      className={cn(
        variant === 'segmented'
          ? // 시니어 가독성: 테두리로 감싼 세그먼트 컨트롤 — "누르는 버튼"임이 형태로 드러난다
            'flex w-full max-w-md gap-1.5 rounded-full border border-paper-line bg-paper-dim/70 p-1.5'
          : 'flex w-full flex-wrap items-stretch gap-x-6 gap-y-1 border-b border-paper-line',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  children,
  variant = 'underline',
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { variant?: TabsVariant }) {
  if (variant === 'segmented') {
    return (
      <TabsPrimitive.Trigger
        className={cn(
          'inline-flex min-h-[48px] flex-1 items-center justify-center whitespace-nowrap rounded-full px-5 text-base font-semibold transition-colors',
          'text-paper-text/70 hover:text-paper-text',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/45',
          'data-[state=active]:bg-gold data-[state=active]:text-paper data-[state=active]:shadow-sm',
          className,
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    )
  }

  return (
    <TabsPrimitive.Trigger
      className={cn(
        'group relative inline-flex items-center whitespace-nowrap py-3 text-sm font-medium text-paper-muted transition-colors',
        'hover:text-paper-text',
        'data-[state=active]:text-paper-text',
        className,
      )}
      {...props}
    >
      {children}
      {/* 밑줄: 활성/호버 시 leaf accent */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 -bottom-px h-[2px] origin-center scale-x-0 bg-gold transition-transform duration-300 ease-out',
          'group-hover:scale-x-100',
          'group-data-[state=active]:scale-x-100',
        )}
      />
    </TabsPrimitive.Trigger>
  )
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-8 focus-visible:outline-none', className)} {...props} />
}
