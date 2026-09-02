import { describe, it, expect } from 'vitest'
import {
  parseNewsCategory,
  stripHtml,
  newsExcerpt,
  isDisplayableImageUrl,
} from './news-post'

describe('isDisplayableImageUrl', () => {
  it('rejects empty, YouTube and video links', () => {
    expect(isDisplayableImageUrl('')).toBe(false)
    expect(isDisplayableImageUrl('   ')).toBe(false)
    expect(
      isDisplayableImageUrl('https://www.youtube.com/watch?v=ImLpA9vbjFA&list=RD'),
    ).toBe(false)
    expect(isDisplayableImageUrl('https://youtu.be/ImLpA9vbjFA')).toBe(false)
    expect(isDisplayableImageUrl('https://cdn.example.com/clip.mp4')).toBe(false)
  })

  it('accepts image URLs, data URIs and site-relative paths', () => {
    expect(isDisplayableImageUrl('https://images.example.com/a.jpg?w=600')).toBe(true)
    expect(isDisplayableImageUrl('/photos/church.webp')).toBe(true)
    expect(isDisplayableImageUrl('data:image/png;base64,AAAA')).toBe(true)
    // Firebase Storage 다운로드 URL은 확장자가 없지만 이미지로 취급
    expect(
      isDisplayableImageUrl(
        'https://firebasestorage.googleapis.com/v0/b/x/o/news%2Fa?alt=media&token=1',
      ),
    ).toBe(true)
  })
})

describe('parseNewsCategory', () => {
  it('passes through valid categories and rejects the rest', () => {
    expect(parseNewsCategory('공지')).toBe('공지')
    expect(parseNewsCategory('선교')).toBe('선교')
    expect(parseNewsCategory('없는분류')).toBeUndefined()
    expect(parseNewsCategory(undefined)).toBeUndefined()
    expect(parseNewsCategory(3)).toBeUndefined()
  })
})

describe('stripHtml', () => {
  it('removes tags, restores common entities and collapses whitespace', () => {
    expect(stripHtml('<p>주일 <strong>오후</strong>  1시</p>')).toBe('주일 오후 1시')
    expect(stripHtml('<p>A&nbsp;&amp;&nbsp;B</p>')).toBe('A & B')
  })
})

describe('newsExcerpt', () => {
  it('prefers an explicit summary', () => {
    expect(newsExcerpt({ summary: '한 줄 요약', contentHtml: '<p>본문 전체</p>' })).toBe('한 줄 요약')
  })

  it('falls back to stripped body text when summary is empty', () => {
    expect(newsExcerpt({ summary: '   ', contentHtml: '<p>본문 <em>텍스트</em></p>' })).toBe('본문 텍스트')
  })

  it('truncates long text on a word boundary with an ellipsis', () => {
    const long = `<p>${'가 '.repeat(120)}</p>`
    const out = newsExcerpt({ contentHtml: long }, 20)
    expect(out.endsWith('…')).toBe(true)
    expect(out.length).toBeLessThanOrEqual(21)
  })
})
