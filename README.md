# DealGuard Frontend

DealGuard는 중고거래 채팅과 게시글 정보를 분석해 거래 조건 누락, 가격 불일치, 모호한 표현, 조건 변경, 위험 결제 패턴을 사전에 감지하는 분쟁 예방 도구입니다.

## 기술 스택

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- TanStack Query
- lucide-react
- clsx, tailwind-merge

## 실행 방법

```bash
npm install
npm run dev
npm run build
```

개발 서버 기본 주소는 Vite가 출력하는 로컬 URL을 사용합니다.

## 환경변수

`.env.example`을 참고해 `.env`를 만들 수 있습니다.

```txt
VITE_API_BASE_URL=http://localhost:8080
```

## 주요 화면

- 로그인 / 회원가입
- 대시보드
- 상품 게시글 목록 / 등록 / 수정 / 상세
- 거래 대화 목록 / 상세
- 채팅 붙여넣기
- 분석 결과
- 조건 변경 이력
- 증거 패키지 목록 / PDF 다운로드
- 내 정보

## API 연동 방식

`src/lib/api.ts`에서 Spring Boot 백엔드 API를 호출합니다. 응답은 다음 공통 포맷을 기준으로 처리합니다.

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

인증 토큰은 `localStorage`에 저장하며 요청 시 `Authorization: Bearer <token>` 헤더를 붙입니다. 인증 실패 시 `/login`으로 이동합니다.

## Mock fallback

백엔드가 실행 중이지 않거나 일부 목록 API가 준비되지 않아도 발표 데모가 가능하도록 `src/lib/mockData.ts`의 mock 데이터를 사용합니다. API 호출 실패 시 화면은 한국어 오류/빈 상태를 보여주거나 mock 데이터로 자연스럽게 대체됩니다.
