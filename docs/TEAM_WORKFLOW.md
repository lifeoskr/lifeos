# Life OS 2인 개발 규칙

## 기본 원칙

- `main`에서 직접 개발하지 않는다.
- 한 작업은 한 브랜치와 한 Pull Request로 끝낸다.
- 다른 개발자 한 명의 확인을 받은 뒤 `main`에 합친다.
- 같은 파일의 같은 기능을 두 사람이 동시에 수정하지 않는다.
- 통화 원본, API 키, Firebase 서비스 계정 파일은 Git에 올리지 않는다.

## 브랜치 이름

- 새 기능: `feature/작업명`
- 오류 수정: `fix/작업명`
- 문서: `docs/작업명`

예:

```text
feature/firebase-login
feature/call-upload
fix/mobile-bottom-bar
```

## 매일 작업 순서

1. GitHub Issue 또는 작업 문서에 담당자를 적는다.
2. 최신 `main`에서 새 브랜치를 만든다.
3. 한 기능만 구현한다.
4. `npm run lint`와 `npm run build`를 실행한다.
5. Pull Request를 만든다.
6. 다른 개발자가 화면과 동작을 확인한다.
7. 자동 검사가 통과한 뒤 `main`에 합친다.
8. `main` 반영 후 Cloudflare와 Firebase 자동배포 결과를 확인한다.

## 역할 권장

### 사용자 경험 담당

- 화면 문구와 버튼 위치
- 모바일 실기기 확인
- 빈 화면·오류 화면 확인
- 실제 통화 파일로 전체 흐름 테스트

### 기능·데이터 담당

- Firebase Auth와 Firestore
- 사용자별 데이터 분리
- Cloudflare 파일 업로드와 서버 처리
- API 키와 배포 설정

역할은 고정 직책이 아니라 충돌을 줄이기 위한 당일 작업 구분이다.
