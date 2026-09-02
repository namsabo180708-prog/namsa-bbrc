import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { EducationPage } from './EducationPage'
import { useAdminStore } from '../store/admin-store'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <EducationPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

// 부서명은 관리자가 편집할 수 있어(Firestore) seed 라벨을 assert하지 않는다.
// 삭제 불가 기본 3부서는 항상 병합돼 최소 3개 탭이 렌더된다.
describe('EducationPage admin-only manage tab', () => {
  afterEach(() => {
    useAdminStore.setState({ isAdminMode: false })
  })

  it('hides the manage tab for regular visitors', async () => {
    renderPage()
    await waitFor(
      () => expect(screen.getAllByRole('tab').length).toBeGreaterThanOrEqual(3),
      { timeout: 5000 },
    )
    expect(screen.queryByRole('tab', { name: '부서추가/삭제' })).not.toBeInTheDocument()
  })

  it('appends the manage tab as the last tab in admin mode', async () => {
    useAdminStore.setState({ isAdminMode: true })
    renderPage()
    await waitFor(
      () => expect(screen.getByRole('tab', { name: '부서추가/삭제' })).toBeInTheDocument(),
      { timeout: 5000 },
    )
    const tabs = screen.getAllByRole('tab')
    expect(tabs.at(-1)).toHaveTextContent('부서추가/삭제')
  })
})
