import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsVariant } from '../ui/tabs'

export interface TabItem {
  key: string
  label: string
  content: React.ReactNode
}

interface TabbedPageProps {
  tabs: TabItem[]
  defaultTab?: string
  /** 'underline'(기본) | 'segmented'(테두리로 감싼 세그먼트 컨트롤) */
  variant?: TabsVariant
}

/** State-based tabs — URL does not change on switch (PRD architecture). */
export function TabbedPage({ tabs, defaultTab, variant = 'underline' }: TabbedPageProps) {
  if (!tabs.length) return null
  const first = defaultTab ?? tabs[0]!.key

  return (
    <Tabs defaultValue={first}>
      <TabsList variant={variant}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.key} value={tab.key} variant={variant}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
