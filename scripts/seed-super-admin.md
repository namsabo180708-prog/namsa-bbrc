# 최고관리자 시딩 (1회) — namsa-bbrc

Firebase Console 또는 Admin SDK로 다음을 수행한다.
프로젝트: **namsa-bbrc**

## 1) Authentication 사용자

Authentication → 이메일/비밀번호 사용자 생성  
- 이메일: `namsabo180708@gmail.com`  
- 비밀번호: (관리자만 아는 값)

## 2) Firestore `admins/{uid}` 문서

**문서 ID는 반드시 위 사용자의 Auth UID** 여야 한다.  
(Authentication → 사용자 → UID 복사 → Firestore에서 문서 ID로 사용)

```json
{
  "email": "namsabo180708@gmail.com",
  "role": "super",
  "createdAt": "2026-09-01T00:00:00.000Z"
}
```

## 3) 규칙

`firestore.rules`의 `admins` 규칙은 다음과 같아야 한다.

- `get`: 로그인한 본인 UID 문서만 (`request.auth.uid == uid`)
- `list`: 관리자만
- `write`: super만

배포:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/prd/<adminsdk>.json"
npx firebase deploy --only firestore:rules --project namsa-bbrc
```

## 4) 로그인 테스트

Footer → Admin → 위 이메일/비밀번호.

| 증상 | 원인 |
|---|---|
| `admins 컬렉션 읽기 권한 없음` | rules 미배포, 또는 `allow read: if isAdmin()` 순환 규칙 |
| `관리자 권한이 없습니다` | Auth는 됐지만 `admins/{uid}` 문서 없음·UID 불일치 |
| 이메일/비밀번호 오류 | Authentication에 계정 없음 |

> 클라이언트 UI로는 최초 super 계정을 생성하지 않는다 (부트스트랩 전용).
