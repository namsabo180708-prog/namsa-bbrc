import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'flex w-full flex-wrap items-stretch gap-x-6 gap-y-1 border-b border-paper-line',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
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
