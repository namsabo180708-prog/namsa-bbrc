import type {
  AboutChurch,
  AboutPastor,
  AboutTab,
  AnnualMotto,
  ContactInfo,
  EducationDepartment,
  HeroSlide,
  MissionItem,
  NewsPost,
  PastorGreeting,
  SiteSettings,
  StaffMember,
  WorshipScheduleItem,
} from '../types/content'
import { SITE_NAME } from '../types/content'

export const seedSiteSettings: SiteSettings = {
  id: 'main',
  siteName: SITE_NAME,
  slogan: '옛 사람을 벗고 새사람을 입자',
  mottoLines: [
    '말씀으로 새롭게',
    '사랑으로 하나되어',
    '세상으로 보냄 받는 공동체',
  ],
  footerText: '그리스도의 사랑으로 이웃을 섬기는 교회',
  logoUrl: '',
  foundedYear: 2005,
  contact: {
    phone: '031-322-0191',
    email: 'namsabo180708@gmail.com',
    address: '17115 경기도 용인시 처인구 남사읍 처인성로 896',
  },
}

export const seedHeroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    mediaUrl: '/photos/church-exterior-1.webp',
    mediaType: 'image',
    tag: '2026년 표어',
    title: '옛 사람을 벗고 새사람을 입자',
    subtitle: '에베소서 4:22-24 · 말씀으로 새롭게 되는 한 해',
    order: 1,
    isActive: true,
  },
  {
    id: 'hero-2',
    mediaUrl: '/photos/church-exterior-2.webp',
    mediaType: 'image',
    tag: '주일예배',
    title: '함께 예배하며 새 힘을 얻습니다',
    subtitle: '매주 주일 오전 11시 · 본당 예배',
    linkUrl: '/worship',
    order: 2,
    isActive: true,
  },
  {
    id: 'hero-3',
    mediaUrl: '/photos/mission-cambodia.webp',
    mediaType: 'image',
    tag: '다음세대',
    title: '다음세대를 세우는 교회',
    subtitle: '유초등부부터 청년대학부까지 · 말씀과 관계로 양육',
    linkUrl: '/education',
    order: 3,
    isActive: true,
  },
]

export const seedPastorGreeting: PastorGreeting = {
  id: 'main',
  photoUrl: '/photos/pastor-ryu.webp',
  pastorName: '유병구 목사',
  quote: '지친 마음은 주님께 내려놓고, 서로를 향해 따뜻한 위로와 격려를 건네는 믿음의 공동체가 되기를 소망합니다.',
  message:
    '사랑하는 교회 성도 여러분, 우리 주 예수 그리스도의 이름으로 평안의 인사를 드립니다. 삶의 무게와 예기치 못한 어려움 속에서도 주님의 은혜는 우리를 결코 떠나지 않으십니다. 지친 마음은 주님께 내려놓고, 서로를 향해 따뜻한 위로와 격려를 건네는 믿음의 공동체가 되기를 소망합니다. 우리 교회가 말씀 위에 굳게 서서 사랑으로 하나 되고, 기도로 서로를 붙들며, 복음의 기쁨을 삶으로 증거하는 교회가 되도록 함께 다짐합시다. 주님의 은혜와 평강이 여러분의 가정과 일터 위에 늘 충만하시기를 축복합니다.',
  updatedAt: new Date().toISOString(),
}

/** prd/images/2026년표어.png 내용 기준 시드 */
export const seedAnnualMotto: AnnualMotto = {
  id: 'main',
  year: undefined,
  motto: '옛 사람을 벗고 새사람을 입자!',
  scripture: '에베소서 4:22-24',
  practices: ['생각을 기도처럼!', '언행을 말씀처럼!', '이웃을 주님처럼!'],
  updatedAt: new Date().toISOString(),
}

export const seedWorship: WorshipScheduleItem[] = [
  { id: 'w1', name: '주일 오전예배', time: '오전 11:00', note: '본당', order: 1 },
  { id: 'w2', name: '주일 오후예배', time: '오후 2:00', note: '본당', order: 2 },
  { id: 'w3', name: '수요예배', time: '오후 7:30', note: '본당', order: 3 },
  { id: 'w4', name: '금요기도회', time: '오후 8:00', note: '본당', order: 4 },
  { id: 'w5', name: '새벽기도회', time: '오전 5:30', note: '월~토', order: 5 },
]

export const seedContact: ContactInfo = {
  id: 'main',
  address: '17115 경기도 용인시 처인구 남사읍 처인성로 896',
  addressEn: '896 Cheoinseong-ro, Namsa-eup, Cheoin-gu, Yongin-si, Gyeonggi-do 17115',
  phone: '031-322-0191',
  fax: '031-322-0199',
  email: 'namsabo180708@gmail.com',
  siteUrl: 'https://남사보배로운교회.kr',
  // 옛 약도 플레이스홀더를 넣지 않는다 — Firestore 로딩 전 잘못된 이미지가 깜빡이는 원인.
  mapImageUrl: '',
  mapLinkUrl: undefined,
  routes: [
    {
      id: 'route-bus',
      iconType: 'bus',
      title: '시내버스',
      description: '남사읍·처인성로 방면 정류장 하차 후 도보 이동',
      order: 1,
    },
    {
      id: 'route-walk',
      iconType: 'walk',
      title: '자가용·도보',
      description: '처인성로 896 교회 정문 (주차는 주차안내 탭 참고)',
      order: 1,
    },
  ],
  parkingPhotos: [],
  parkingNotices: [
    '교회 주차장은 주일 예배 시간에 한해 이용 가능합니다.',
    '이중 주차 차량은 연락처를 남기고 기어를 중립에 두어 주세요.',
    '만차 시 인근 공영주차장 또는 대중교통을 이용해 주시기 바랍니다.',
  ],
}

export const seedAboutTabs: AboutTab[] = [
  {
    id: 'about-church',
    tabKey: 'church',
    title: '교회소개',
    content:
      '대한예수교장로회 남사보배로운교회는 예수 그리스도의 십자가 복음을 중심으로, 예배·교육·선교·교제를 통해 하나님의 나라를 이 땅에 이루고자 합니다.',
  },
  {
    id: 'about-pastor',
    tabKey: 'pastor',
    title: '담임목사소개',
    content:
      '담임목사 인사 및 약력 자리입니다. 실제 사진과 소개글은 관리자 모드에서 입력해 주세요.',
  },
  {
    id: 'about-staff',
    tabKey: 'staff',
    title: '사역자소개',
    content: '사역자 목록은 아래 카드에서 확인하실 수 있습니다.',
  },
]

/** /about 교회소개 — 전경 + 본문 */
export const seedAboutChurch: AboutChurch = {
  id: 'main',
  heroImageUrl: '',
  title: '교회소개',
  body: `대한예수교장로회 남사보배로운교회는 예수 그리스도의 십자가 복음을 중심으로, 예배·교육·선교·교제를 통해 하나님의 나라를 이 땅에 이루고자 합니다.

말씀 위에 굳게 서서 세대를 아우르는 공동체를 세우며, 이웃과 열방을 향해 열린 교회로 걸어갑니다.`,
  updatedAt: new Date().toISOString(),
}

/** /about 담임목사소개 — 인물 + 학력/경력 */
export const seedAboutPastor: AboutPastor = {
  id: 'main',
  photoUrl: '',
  name: '유병구 목사',
  title: '담임목사',
  education: [
    '○○대학교 신학과 졸업',
    '○○신학대학원 M.Div.',
  ],
  career: [
    '○○교회 부목사 사역',
    '대한예수교장로회 남사보배로운교회 담임 (현재)',
  ],
  notes:
    '성도와 함께 말씀과 기도로 성장하는 공동체를 소망합니다.',
  updatedAt: new Date().toISOString(),
}

export const seedStaff: StaffMember[] = [
  {
    id: 's1',
    name: '유병구',
    role: '담임목사',
    photoUrl: '',
    order: 1,
  },
  {
    id: 's2',
    name: '마훈희',
    role: '부목사',
    photoUrl: '',
    order: 2,
  },
  {
    id: 's3',
    name: '윤성실',
    role: '전도사',
    photoUrl: '',
    order: 3,
  },
  {
    id: 's4',
    name: '이은성',
    role: '전도사',
    photoUrl: '',
    order: 4,
  },
  {
    id: 's5',
    name: '김현수',
    role: '장로',
    photoUrl: '',
    order: 5,
  },
  {
    id: 's6',
    name: '김단비',
    role: '피아노',
    photoUrl: '',
    order: 6,
  },
]

/** 장로소개 — 실데이터는 Firestore(elders)에서 관리, 관리자가 "장로 추가"로 채운다. */
export const seedElders: StaffMember[] = []

export const seedEducation: EducationDepartment[] = [
  {
    id: 'e2',
    deptKey: 'elementary',
    name: '유초등부',
    missionText: `성경 이야기와 교제를 통해 믿음의 뿌리를 세우는 초등 공동체입니다.

말씀 암송과 소그룹으로 친구와 함께 예수님을 알아가며, 예배하는 아이로 자라도록 동행합니다.`,
    image: '',
    scheduleInfo: '주일 오전 9:40',
    targetAge: '초등 1~6학년',
    place: '유초등부실',
    order: 1,
  },
  {
    id: 'e3',
    deptKey: 'youth',
    name: '중고등부',
    missionText: `청소년의 고민과 꿈을 말씀으로 품는 사역입니다.

주일 예배와  성경 공부모임에서 또래와 멘토가 함께 기도하고, 세상에서 그리스도인으로 서는 연습을 합니다.`,
    image: '',
    scheduleInfo: '주일 오전 10:00',
    targetAge: '중·고등학생',
    place: '중고등부실',
    order: 2,
  },
  {
    id: 'e4',
    deptKey: 'youngadult',
    name: '청년대학부',
    missionText: `청년과 가정이 함께 성장하는 예배와 교제입니다.

말씀 나눔과 주중 소그룹으로 서로를 붙들고, 일터와 가정에서 복음을 살아내는 공동체를 꿈꿉니다.`,
    image: '',
    scheduleInfo: '주일 오후 · 주중 소그룹',
    targetAge: '청년·가정',
    place: '본당 / 소그룹',
    order: 3,
  },
]

/**
 * 관리자가 "사역 추가"로 새 사역을 만들 때 타입별로 순환 배정되는 대표사진 후보군.
 * 국내/해외는 사진 톤이 뚜렷이 달라 하나로 합치지 않고 타입별 풀을 따로 둔다.
 */
export const missionPlaceholderImages: Record<'domestic' | 'overseas', string[]> = {
  domestic: [
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
  ],
  overseas: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
  ],
}

export const seedMissions: MissionItem[] = [
  {
    id: 'm1',
    type: 'domestic',
    name: '국내 이웃 섬김',
    description:
      '동대문구 인근 이웃과 함께하는 나눔·돌봄 사역입니다. 필요를 나누고 기도로 동행합니다.',
    order: 1,
    region: '서울 동대문구',
    image: '/photos/mission-domestic-care.jpeg',
  },
  {
    id: 'm2',
    type: 'domestic',
    name: '국내 미자립 교회 후원',
    description:
      '동역 교회를 후원하고 기도 네트워크로 연결하는 사역입니다.',
    order: 2,
    region: '국내 동역',
    image:
      'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'm3',
    type: 'overseas',
    name: '몽골 선교',
    description:
      '파송 선교사와 현지 사역을 후원하고 중보하는 몽골 선교지입니다.',
    order: 1,
    region: '몽골',
    image: '/photos/mission-mongolia.webp',
  },
  {
    id: 'm4',
    type: 'overseas',
    name: '캄보디아 선교',
    description: '단기 선교와 중보 기도로 함께하는 캄보디아 선교지입니다.',
    order: 2,
    region: '캄보디아',
    image: '/photos/mission-cambodia.webp',
  },
]

/**
 * 관리자가 "새 글 작성" 시 Date.now() 기준으로 순환 배정되는 썸네일 후보군.
 * 뉴스는 부서/사역처럼 고정 카테고리가 없어 시각 기준으로만 순환한다.
 */
export const newsPlaceholderImages: string[] = [
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
]

export const seedNews: NewsPost[] = [
  {
    id: 'n1',
    title: '2026년 표어 선포 예배 안내',
    contentHtml:
      '<p>새해 표어 <strong>옛 사람을 벗고 새사람을 입자</strong>를 선포하는 예배가 진행됩니다. 온 성도가 함께 모여 한 해의 방향을 확인하는 시간입니다.</p>',
    thumbnail:
      'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=600&q=80',
    category: '공지',
    pinned: true,
    authorUid: 'seed',
    createdAt: '2026-01-05T00:00:00.000Z',
    isPublished: true,
    viewCount: 42,
  },
  {
    id: 'n2',
    title: '다음세대 여름성경학교 모집',
    contentHtml: '<p>유치부·유초등부 여름성경학교 신청을 받습니다. 신청서는 교육관 입구에 비치되어 있습니다.</p>',
    thumbnail:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
    category: '교육',
    authorUid: 'seed',
    createdAt: '2026-02-10T00:00:00.000Z',
    isPublished: true,
    viewCount: 28,
  },
  {
    id: 'n3',
    title: '선교 헌신 주일 안내',
    contentHtml: '<p>국내·국외 선교 사역을 위한 헌신 주일을 드립니다.</p>',
    thumbnail:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80',
    category: '선교',
    authorUid: 'seed',
    createdAt: '2026-03-01T00:00:00.000Z',
    isPublished: true,
    viewCount: 19,
  },
  {
    id: 'n4',
    title: '3월 정기 제직회 및 공동의회 안내',
    contentHtml:
      '<p>주일 오후 1시 30분, 본당에서 정기 제직회와 공동의회가 열립니다. 각 부서 보고와 상반기 예산 심의가 있으니 직분자께서는 참석해 주시기 바랍니다.</p>',
    thumbnail: '',
    category: '공지',
    summary: '주일 오후 1시 30분 본당 · 각 부서 보고와 상반기 예산 심의',
    authorUid: 'seed',
    createdAt: '2026-03-08T00:00:00.000Z',
    isPublished: true,
    viewCount: 11,
  },
  {
    id: 'n5',
    title: '전교인 봄 나들이 예배',
    contentHtml:
      '<p>4월 넷째 주일, 예배 후 도보 20분 거리 공원에서 함께 점심을 나눕니다. 자세한 준비물은 주보를 통해 다시 안내합니다.</p>',
    thumbnail: '',
    category: '행사',
    authorUid: 'seed',
    createdAt: '2026-03-22T00:00:00.000Z',
    isPublished: true,
    viewCount: 7,
  },
]
