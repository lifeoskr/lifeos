# Life OS 자동배포 설정

## 배포 구조

- GitHub: 코드, Pull Request, 자동 검사
- Cloudflare Workers: 프론트엔드 운영 배포
- Firebase: Authentication, Firestore, 보안 규칙

Firebase Hosting에는 같은 프론트엔드를 중복 배포하지 않는다.

## GitHub 저장소 설정

저장소: `lifeoskr/lifeos`

권장 Branch protection:

- `main`에 Pull Request 필수
- 승인 1명 필수
- `validate` 검사 통과 필수
- 관리자도 규칙 적용
- Force push와 branch 삭제 금지

## GitHub Actions Secrets

저장소 `Settings > Secrets and variables > Actions`에 다음 값을 등록한다.

### Cloudflare

- `CLOUDFLARE_API_TOKEN`: Workers Scripts Edit 권한이 있는 토큰
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

### Firebase

- `FIREBASE_PROJECT_ID`: Firebase 프로젝트 ID
- `FIREBASE_SERVICE_ACCOUNT`: Firebase Admin 서비스 계정 JSON 전체 내용

서비스 계정 JSON 파일을 저장소에 올리지 않는다.

## GitHub Actions Variables

저장소 `Settings > Secrets and variables > Actions > Variables`에 다음 Firebase 웹앱 값을 등록한다.

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Firebase 웹앱 설정은 브라우저에 전달되는 공개 식별자다. 실제 관리자 권한을 가진 서비스 계정과 Cloudflare 토큰은 반드시 Secrets에 넣는다.

## 자동 실행

- Pull Request: lint와 build
- `main` 반영: Cloudflare 프론트엔드 자동배포
- Firebase 규칙 파일 변경 후 `main` 반영: Firestore 규칙과 인덱스 자동배포

## 로컬 확인

```bash
npm run lint
npm run build
npm run dev
```

Firebase 로그인 후 규칙 배포:

```bash
npx firebase login
npx firebase deploy --only firestore:rules,firestore:indexes --project YOUR_PROJECT_ID
```
