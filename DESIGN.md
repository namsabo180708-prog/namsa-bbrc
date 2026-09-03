# Design System — 대한예수교장로회 남사보배로운교회

> 코드가 원본(single source of truth)입니다. 토큰은 `src/index.css`,
> 원시 컴포넌트는 `src/components/ui/*`, 공용 패턴은 `src/components/shared/*`.
> 이 문서는 그 규칙을 사람이 읽을 수 있게 정리한 것입니다.

---

## 1. 개요 — "Stone & Leaf"

쿨 스톤(cool stone) 캔버스 + 틸 블랙 잉크(ink) + 리프 그린(leaf) 액센트.
주보(예배 순서지)에서 온 절제된 타이포와 번호 색인의 인상을 웹으로 옮긴다.
장식 요소를 반복하지 않고(같은 3카드 그리드 금지 등), 여백·활자 위계·한 번의
포인트 모션으로 리듬을 만든다.

- 활자 우선. 아이콘·썸네일·화살표를 과밀하게 늘어놓지 않는다.
- 액센트 색(`gold`)은 "여기 한 곳"에만. 넓은 면을 칠하지 않는다.
- 모션은 항상 `transform`/`opacity`만. `prefers-reduced-motion`에서 반드시 정지/축소.

---

## 2. 색상 토큰

`src/index.css`의 `@theme`. Tailwind 유틸리티는 `bg-ink`, `text-gold-deep` 처럼 접두사만 붙여 쓴다.
과거 명칭(`gold`)은 코드 호환용으로 유지하고 값만 Stone & Leaf로 교체됐다 — `gold`는 실제로 리프 그린이다.

### Ink (딥 틸 블랙 — 헤더·푸터·다크 서피스)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-ink` | `#121816` | 헤더 바탕, 히어로 바탕, 토스트/편집칩 바탕 |
| `--color-ink-soft` | `#1a221e` | 푸터 바탕(`.site-footer`), 다크 hover |
| `--color-ink-line` | `#2a3530` | 다크 서피스 위 구분선·테두리 |
| `--color-ink-muted` | `#a8b5ae` | 다크 서피스 위 보조 텍스트 |

### Paper (쿨 스톤 — 본문 캔버스)
| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-paper` | `#eef1ef` | 기본 페이지 바탕(`body`) |
| `--color-paper-dim` | `#e4e8e5` | 한 단계 낮춘 섹션·카드·플레이스홀더 바탕, hover 회색 |
| `--color-paper-line` | `#cfd6d2` | 라이트 서피스 구분선·테두리 |
| `--color-paper-text` | `#141a17` | 본문 텍스트 |
| `--color-paper-muted` | `#5a6660` | 보조 텍스트, 날짜, 캡션 |

### Accent
| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-gold` | `#3f6f54` | 리프 그린. 기본 버튼 바탕, 활성 탭, 언더라인, 셀렉션, 포커스 링 |
| `--color-gold-deep` | `#2a4d3a` | hover 심화, 링크, index-num, eyebrow 라벨 |
| `--color-wine` | `#6b3a42` | 파괴적 액션(삭제) 테두리/바탕 |
| `--color-wine-deep` | `#4e2a31` | 파괴적 액션 텍스트 |

### 규칙
- 액센트는 점(dot)으로만. `bg-gold`로 넓은 면을 칠하는 건 기본 버튼과 활성 탭 알약뿐.
- 다크 서피스 위 텍스트 = `text-paper` / `text-paper/80`(보조) / `text-ink-muted`(더 약하게). `text-gold`는 `#3f6f54`라 다크 위에서 대비가 약하다 — 다크 바탕에선 쓰지 않는다.
- 삭제 등 파괴적 버튼: `border-wine/30 bg-wine/10 text-wine-deep hover:bg-wine/20`.

---

## 3. 타이포그래피

| | 폰트 | 스택 |
|---|---|---|
| 제목/강조 | `font-serif` | `'Noto Serif KR', 'Georgia', serif` |
| 본문/UI | `font-sans` (기본) | `'Noto Sans KR', 'Apple SD Gothic Neo', system-ui, sans-serif` |

웹폰트는 `index.html`에서 `Noto Sans KR 400/500/600/700`, `Noto Serif KR 500/600/700`을 `display=swap`으로 로드.

### 위계 (실사용 스케일)
| 역할 | 클래스 |
|---|---|
| 페이지 타이틀(H1, PageShell) | `font-serif text-3xl font-semibold tracking-tight sm:text-[2.75rem]` |
| 히어로 headline | `font-serif text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl` |
| 섹션 제목(H2) | `font-serif text-2xl font-semibold tracking-tight sm:text-3xl` |
| 카드 제목(H3) | `font-serif text-lg font-semibold` (큰 카드는 `text-2xl sm:text-[1.65rem]`) |
| pull-quote | `font-serif text-2xl font-medium leading-snug tracking-tight sm:text-[1.75rem]` |
| eyebrow 라벨 | `index-num text-xs font-semibold tracking-[0.14em] text-gold-deep` |
| 본문 | `text-base leading-relaxed text-paper-muted sm:text-[1.05rem] sm:leading-7` |
| 보조/날짜/캡션 | `text-xs`~`text-sm text-paper-muted` |

### 명명 규칙
- **`.index-num`** — 주보의 찬송 번호 감성. `font-variant-numeric: tabular-nums; letter-spacing: 0.02em`. 연도·우편번호·eyebrow 숫자에 사용.
- 제목은 거의 항상 `font-serif` + `tracking-tight`. 본문/버튼/라벨은 sans.
- 대비는 굵기와 색으로. 크기 점프를 남발하지 않는다.

---

## 4. 레이아웃 & 간격

- **콘텐츠 폭**: `mx-auto max-w-6xl px-4 sm:px-6` (72rem). 거의 모든 섹션·셸이 이 컨테이너.
- **내부 페이지 셸**(`PageShell`): `py-10 sm:py-14`, 헤더 블록은 `mb-10 border-b border-paper-line pb-8`, 우측 상단에 `Breadcrumb`.
- **홈 섹션 리듬 — "A"**: 인접 섹션 사이 `margin`은 두지 않는다. **아래쪽 섹션이 `pt`로 간격을 소유**한다(히어로→인사말이 이 방식). 표준값:
  - `pt-20`(80px, 모바일) / `sm:pt-24`(96px, ≥640px) = **"A"**
  - 섹션 콘텐츠 자체 여백은 `py-16 sm:py-20`(협력기관) ~ `py-20 sm:py-28`(교회소식 하단) 범위.
- **반응형 기준**: `sm` 640 / `md` 768 / `lg` 1024. 카드 그리드는 `sm:grid-cols-2` → `lg:grid-cols-4`(사역자) 또는 `lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]`(비대칭 스플릿).
- 비대칭 스플릿을 선호: 인사말 `md:grid-cols-[7fr_3fr]`, 교육 `md:grid-cols-3` + `md:col-span-2` 이미지.

---

## 5. 형태 · 깊이 (radius / elevation)

### Radius
| 값 | 용도 |
|---|---|
| `rounded-sm` | 버튼, 입력, 다이얼로그 본체, 토스트, 편집칩 |
| `rounded-[14px]` | 내부 카드(연락처 필드, 협력기관 카드, 관리 목록 행) |
| `rounded-[20px]` | **대표 이미지 프레임**(`RippleFrame`), `EditableBlock` 안내 오버레이 |
| `rounded-full` | 세그먼트 탭 트랙·알약, eyebrow 뱃지, 인디케이터 dot |

### Elevation
그림자는 절제. 팝오버/토스트/다이얼로그에만 강한 그림자, 그 외엔 테두리(`border-paper-line`)로 면을 나눈다.
- 다이얼로그: `shadow-2xl` · 토스트/팝업: `shadow-xl` · 툴팁: `shadow-lg` · BackToTop: `shadow-lg`
- **떠 있는 대표 이미지**: `shadow-[0_16px_40px_-12px_rgba(31,26,22,0.35)]` (잉크 톤, About·교육·선교·인사말) / `shadow-[0_18px_40px_-14px_rgba(90,102,96,0.45)]` (회색 톤, 교회소식)

---

## 6. 모션

- **원칙**: `transform` / `opacity` / `background-position`만. compositor에서 처리되게. 모든 시그니처 모션은 `@media (prefers-reduced-motion: reduce)`에서 정지 또는 즉시 상태.
- **duration**: 마이크로 200–300ms · 리빌/프레임 500–700ms · 툴팁 130–170ms · 모바일 메뉴 200–240ms.
- **easing**: `ease-out` 기본 · 펼침 `cubic-bezier(0.16,1,0.3,1)` · 세그먼트 언더라인 `cubic-bezier(0.22,1,0.36,1)`.

### 시그니처 애니메이션 (`src/index.css`)
| 이름 | 무엇 | 어디에 |
|---|---|---|
| **`.map-ripple` + `.map-ripple__wave`** | 컨테이너 중앙에서 바깥으로 흰색 링 3개(`::before`·`::after`·`.wave`)가 0.8s 시차로 `scale(0.15)→scale(5)`·페이드, hover 시 무한 반복 | 오시는길 약도, 그리고 `RippleFrame`을 통해 교회소개·인사말·장로/사역자·교육·선교·교회소식 대표 이미지 |
| **`.seg-pill`** | 세그먼트 탭 알약 hover/focus 시 그린 언더라인이 왼쪽에서 `scaleX` 펼쳐지고, 머무는 동안 밝은 점이 라인을 따라 흐름 | 세그먼트형 탭, 교회소식 분류 |
| `mobile-menu-unfurl` / `mobile-menu-rollup` | `transform-origin: top` + `scaleY`로 펼쳐지고 말려 올라감 | 헤더 모바일 햄버거 메뉴 |
| **`Reveal`** (컴포넌트) | 뷰포트 인뷰 시 1회 `opacity 0→1` + `translateY(20px→0)` 700ms. `stagger delay` 지원 | About/교육/선교 패널, 홈 콘텐츠 섹션(히어로·푸터 제외) |
| 히어로 패럴랙스 | 배경 미디어를 스크롤량 × 0.3 만큼 아래로 되돌려 (1−0.3) 속도로 따라오게 함 | `HeroSlider` |
| 네비 언더라인 | `scale-x-0 → scale-x-100` 그린 밑줄 | 헤더/푸터 링크, underline형 탭 |
| 골드 헤어라인 프레임 | hover 시 `inset-2` 골드 테두리가 `scale`+`opacity`로 번짐 (`z-20`) | 사역자소개·선교 카드 (물결과 겹쳐 사용) |

---

## 7. 컴포넌트

### 버튼 (`components/ui/button.tsx`, cva)
기본형: `inline-flex items-center gap-2 rounded-sm text-sm font-medium tracking-wide` + `focus-visible:ring-2 ring-gold/50`.

| variant | 스타일 |
|---|---|
| `default` | `bg-gold text-ink hover:bg-gold-deep hover:text-paper` |
| `secondary` | `bg-ink text-paper hover:bg-ink-soft` |
| `outline` | `border border-paper-line text-paper-text hover:border-gold-deep/50 hover:bg-paper-dim` |
| `ghost` | `text-paper-text hover:bg-paper-dim` |
| `link` | `text-gold-deep underline-offset-4 hover:underline` |

size: `default h-10 px-4` · `sm h-8 px-3 text-xs` · `lg h-11 px-8` · `icon h-10 w-10`.

### 탭 (`components/ui/tabs.tsx`, Radix)
- **`underline`**(기본): `border-b border-paper-line` 트랙, 트리거는 `text-paper-muted`, 활성/hover 시 `bg-gold` 밑줄이 `scale-x`.
- **`segmented`**: `rounded-full border border-paper-line bg-paper-dim/70 p-1.5` 트랙 안의 `rounded-full` 알약. 활성 = `bg-gold text-paper shadow-sm`. hover는 `.seg-pill` 언더라인 흐름. 항목이 많으면(교육부서) 트랙 내부 가로 스크롤만(`no-scrollbar overflow-x-auto`). **오시는길·교회소개·교육부서·선교사역이 segmented 사용.**
- URL은 탭 전환에 바뀌지 않는다(state 기반).

### 카드 / 패널
- 라이트 카드: `rounded-[14px]`(또는 `[20px]`) `border border-paper-line bg-paper` / 낮춘 톤은 `bg-paper-dim`.
- 리스트 행: `border-t border-paper-line` 구분 + 큰 터치 타깃(`min-h-16`~`min-h-24`, `py-5`).
- 같은 3카드 균등 그리드 반복 금지 — featured 1 + 목록 N, 비대칭 스플릿 등으로 변주.

### 입력 / 필드
- `Input`: `h-10 rounded-sm border border-paper-line bg-paper px-3 text-sm` + `focus-visible:ring-2 ring-gold/40`.
- `FormField`: 라벨 + `required` 표시 + `hint`. 힌트는 상태 인지형(사진 있음/없음에 따라 문구 전환).
- `MediaInputField`: 로컬 파일 픽커 + URL 붙여넣기 듀얼 입력. "비우면 현재 유지" 정책.

### 다이얼로그 / 토스트 / 툴팁 (Radix)
- `DialogContent`: `w-[min(92vw,32rem)] max-h-[min(90dvh,90vh)] rounded-sm border border-paper-line bg-paper shadow-2xl`. 상단 `3px` 골드 바. 오버레이 `bg-ink/70`.
- 토스트(`ToastViewport`): `fixed bottom-4 right-4 z-[100] w-[min(92vw,22rem)]`. 항상 `bg-ink` + variant별 테두리/텍스트 색(success 에메랄드 / error 와인 / default paper).
- 삭제 확인은 `window.confirm`이 아니라 중첩 `Dialog` 모달.

### 시그니처 컴포넌트
- **Index List (`QuickIndex` 등)** — 번호·썸네일·화살표를 뺀 2열 텍스트 색인. `border-t` 행 + `font-serif` 라벨 + `text-paper-muted` 설명 + hover 시 우측에 라이브 정보(`item.live()`).
- **`RippleFrame`** (`components/shared/RippleFrame.tsx`) — `map-ripple relative overflow-hidden` + `.map-ripple__wave` 자식을 제공하는 이미지 프레임. 크기·`rounded-[20px]`·`shadow-[…]`는 `className`으로 전달. `as="div" | "article"`.
- **`PhotoPlaceholder`** — 사진 미등록 자리. `bg-paper-dim` + `ImagePlus` 아이콘 + "사진파일을 업로드하세요". 기본/시드 이미지로 폴백하지 않는 정책의 시각적 표현.
- **`EditableBlock`** — 관리자 모드에서만 우상단 `편집` 칩(잉크 바탕) + hover/tap 안내 오버레이. 클릭 시 편집 다이얼로그.

---

## 8. 관리자 편집 UX

- 편집 진입은 항상 `EditableBlock`의 우상단 `편집` 칩 → 다이얼로그. 저장 = "게시"(Firestore 반영).
- **기본 이미지 폴백 금지**: 히어로 배경, 담임목사·사역자·장로 사진, 교육 대표사진, 인사말 사진, 교회소식 썸네일은 미설정 시 시드/기본 이미지를 넣지 않는다. 대신:
  - 화면: 빈 상태(`PhotoPlaceholder`) 또는 빈 다크 히어로
  - 관리자에게: **`useAdminHintToast`** 로 "…를 저장해 주세요!" 안내 토스트 (관리자 모드에서만, 슬라이드/항목 전환 시 재알림)
- 항목 추가(슬라이드/부서/사역자/장로) 시에도 같은 안내 토스트.
- 파괴적 액션(삭제)은 와인 색 + 확인 모달. 기본 부서 등 삭제 불가 항목은 명시.

---

## 9. 홈 페이지 섹션 스택

| 순서 | 섹션 | 바탕 | 비고 |
|---|---|---|---|
| 1 | Hero (`HeroSlider`) | `bg-ink` | `h-[100svh]`, 헤더 뒤로 파고듦(`-marginTop: var(--header-h)`), 배경 미디어 `object-cover` + 패럴랙스. **Reveal 미적용** |
| 2 | 담임목사 인사말 · 연간 표어 (`GreetingMottoBand`) | `bg-paper` (`pt`만, "A") | 1×2 그리드 `md:grid-cols-[7fr_3fr]` — 좌 인사말 카드(`bg-paper`) / 우 표어 카드(`bg-paper-dim`). Reveal |
| 3 | 교회소식 (`NewsPreview`) | `bg-paper-dim` | featured 1(대표 이미지 = `RippleFrame` 회색 그림자) + 최대 3 목록. Reveal |
| 4 | 찾아가기 (`QuickIndex`) | `bg-paper` + 고정 배경 이미지 | `bg-[url(/logo-image/webp/cup-image.webp)] bg-cover bg-center` + `md:bg-fixed`(모바일은 scroll), `bg-paper/60` 오버레이. Reveal은 `bg-fixed` 때문에 **섹션 내부 콘텐츠**에만 적용 |
| 5 | 협력기관 (`PartnerSpotlightRail`) | `bg-paper-dim` + `border-t border-paper-line` | 라이트 카드 3열, 텍스트 중앙정렬, hover `bg-paper-line/50`. Reveal |
| — | Footer | `#1a221e` (`.site-footer`, `!important`) | **Reveal 미적용** |

- 협력기관을 라이트로 둔 이유: 바로 아래 다크 Footer와 명확히 대비시켜 경계 가독성 확보.

---

## 10. 히어로 (`HeroSlider`)

- `<section className="h-[100svh] min-h-[520px] overflow-hidden bg-ink">`. `svh`로 모바일 툴바 스크롤 튐 방지.
- 배경 미디어(`HeroMediaBackground`): 이미지/mp4/유튜브. `object-cover`. **미설정 시 폴백 없음** → 빈 다크 + 관리자 토스트.
- 상단으로 `bg-gradient-to-t from-ink … to-transparent` 스크림 → 하단 정렬 카피 가독성.
- 패럴랙스: 배경 래퍼를 `translate3d(0, scrollY*0.3, 0)`(rAF 스로틀, `[0, innerHeight]` 클램프). reduced-motion 시 미적용.
- 카피 진입: `translate-y-3 opacity-0 → 0/100`, 태그·제목·부제·CTA 순으로 stagger.
- 인디케이터: 필(pill) dot, 활성 `w-6 bg-gold`.

---

## 11. 헤더 / 푸터

### Header
- `sticky top-0 z-40`. `/`(홈) 최상단에선 **투명 오버레이**(스크롤 40px 넘으면 `bg-ink`로 전환), 그 외 페이지는 항상 `bg-ink`.
- 실제 높이를 `ResizeObserver`로 실측해 `--header-h`(CSS 변수)로 퍼블리시 → 히어로가 그만큼 음수 마진으로 파고든다.
- 로고: `siteSettings.logoUrl` 우선, 없으면 `DEFAULT_LOGO_SRC`. 관리자 모드에서 로고 옆 `LogoEditDialog`.
- 하단 스트립: "교회설립 제 N주년 · Since YYYY–현재" (관리자는 연도 편집 버튼).
- 모바일: `rounded-lg border border-ink-line bg-ink-soft` 드롭다운, unfurl/rollup 애니메이션.

### Footer
- `.site-footer` = `#1a221e` + `border-top #2a3530` (CSS `!important`로 강제).
- 2열: 좌(로고 + 주소/Tel/Fax/Web + © + Email + 비관리자용 `Admin` 링크) / 우(Quick Link 뱃지 + 바로가기 6개).
- 주소/연락처는 `contactInfo/main` Firestore 문서를 편집 대상으로 하며 `EditableBlock`으로 감싼다.
- 링크 hover: 헤더와 동일한 `scale-x` 그린 언더바.

---

## 12. 아이콘 · 이미지

- 아이콘: **`lucide-react`** 만. 기본 `h-4 w-4`(버튼 내), 강조 `h-8 w-8`. `aria-hidden` 붙이고 의미는 텍스트로.
- 대표 이미지 비율: 가로형 `aspect-[16/10]`, 인물 `aspect-[3/4]`.
- 대표 이미지 공통 처리 = **`RippleFrame`**: `rounded-[20px]` + 떠 있는 그림자 + hover 원형 물결. 이미지 자체는 `object-cover` 풀컬러(흑백→컬러 hover 없음), `loading="lazy"`.
- 콘텐츠 이미지는 Firebase Storage 업로드분. 프리캐시하지 않고 hosting 1년 immutable 캐시에 의존.

---

## 13. PWA

- `vite-plugin-pwa`, `registerType: 'prompt'`.
- 서비스워커 등록·업데이트 감지는 `<PwaUpdatePrompt />`(`useRegisterSW`).
- 새 버전 대기 시 좌하단 배너: "새 버전이 준비되었습니다" + `[나중에]` `[새로고침]`. 새로고침 = `updateServiceWorker(true)`(skipWaiting + reload). 1시간마다 `registration.update()` 폴링.
- 매니페스트: standalone, `theme_color #3f6f54`, `background_color #eef1ef`, 아이콘 32/48/192/512/512-maskable(`public/icons/`).
- 워크박스: 앱 셸(JS/CSS/HTML)만 프리캐시, `navigateFallback: /index.html`.

---

## 14. 접근성

- 포커스: 전역 `:focus-visible { outline: 2px solid var(--color-gold); outline-offset: 2px }` + 컴포넌트별 `ring-gold/40~50`.
- 터치 타깃 최소 44px(`min-h-11` / `min-h-16`).
- 모든 시그니처 모션에 `prefers-reduced-motion` 대응.
- 캐러셀: `aria-roledescription="carousel"`, `role="tablist"` 인디케이터, `aria-live` 상태 안내. 관리자 모드·hover·focus 시 자동 회전 정지.
- 장식용 이미지/오버레이는 `aria-hidden`, 의미 있는 이미지는 `alt`.

---

## 15. Do / Don't

**Do**
- `max-w-6xl` 컨테이너와 섹션 `pt` 리듬("A")을 지킨다.
- 제목은 `font-serif` + `tracking-tight`, 숫자는 `.index-num`.
- 대표 이미지는 `RippleFrame`으로 통일, 빈 자리는 `PhotoPlaceholder` + 관리자 토스트.
- 액센트(`gold`)는 한 화면에 한 포인트.
- 새 모션은 `transform`/`opacity`로만, reduced-motion 분기 필수.

**Don't**
- 기본/시드 이미지로 폴백하지 않는다(히어로·인물·썸네일 전부).
- 다크 서피스 위에 `text-gold`(대비 부족) — `text-paper` 계열을 쓴다.
- 같은 3카드 균등 그리드를 섹션마다 반복하지 않는다.
- 넓은 면을 `bg-gold`로 칠하지 않는다(기본 버튼·활성 탭 알약 예외).
- `window.confirm` 대신 모달로 확인받는다.
- `background-attachment: fixed` 요소의 조상에 `transform`(예: `Reveal`)을 두지 않는다 — 내부 콘텐츠에만 적용.
