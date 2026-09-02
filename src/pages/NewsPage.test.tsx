import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { NewsPage } from './NewsPage'
import { useAdminStore } from '../store/admin-store'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <NewsPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('NewsPage renewed board', () => {
  afterEach(() => {
    useAdminStore.setState({ isAdminMode: false })
  })

  it('renders the pinned notice first with a 고정 marker', async () => {
    renderPage()
    await waitFor(() =>
      expect(screen.getByText('2026년 표어 선포 예배 안내')).toBeInTheDocument(),
    )
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings[0]).toHaveTextContent('2026년 표어 선포 예배 안내')
    expect(screen.getByText('고정')).toBeInTheDocument()
  })

  it('only shows category chips that exist, and filtering narrows the list', async () => {
    const user = userEvent.setup()
    renderPage()
    await waitFor(() =>
      expect(screen.getByText('다음세대 여름성경학교 모집')).toBeInTheDocument(),
    )

    // 시드에 '일반' 분류 글이 없으므로 칩도 없어야 한다
    expect(screen.queryByRole('tab', { name: '일반' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: '교육' }))
    expect(screen.getByText('다음세대 여름성경학교 모집')).toBeInTheDocument()
    expect(screen.queryByText('선교 헌신 주일 안내')).not.toBeInTheDocument()
    expect(screen.queryByText('2026년 표어 선포 예배 안내')).not.toBeInTheDocument()
  })

  it('renders a thumbnail-less post as text-only (no image element in the row)', async () => {
    renderPage()
    const textOnly = await screen.findByText('3월 정기 제직회 및 공동의회 안내')
    const withThumb = screen.getByText('2026년 표어 선포 예배 안내')

    expect(textOnly.closest('a')!.querySelector('img')).toBeNull()
    expect(withThumb.closest('a')!.querySelector('img')).not.toBeNull()
  })

  it('hides "새 글 작성" for visitors and shows it for admins', async () => {
    renderPage()
    await waitFor(() =>
      expect(screen.getByText('선교 헌신 주일 안내')).toBeInTheDocument(),
    )
    expect(screen.queryByRole('button', { name: '새 글 작성' })).not.toBeInTheDocument()
  })

  it('shows "새 글 작성" in admin mode', async () => {
    useAdminStore.setState({ isAdminMode: true })
    renderPage()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '새 글 작성' })).toBeInTheDocument(),
    )
  })
})
