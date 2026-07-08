# BLOGLE

BLOGLE은 브랜드와 블로거를 연결하는 체험단 캠페인 모집 SPA입니다.

Revu의 탐색 구조를 참고하되, 새 브랜드와 새 데이터 기준으로 블로거가 캠페인을 찾고 신청하는 첫 화면을 구현합니다.

## 프로젝트 전제

- React, TypeScript, Vite 기반 SPA입니다.
- 현재 첫 화면은 공통 캠페인 탐색 화면입니다.
- 기존 레포 규칙에 따라 역할 값은 유지하되, BLOGLE에서는 아래처럼 해석합니다.
  - `candidate`: 블로거 또는 체험단 신청자
  - `recruiter`: 광고주 또는 브랜드 담당자
  - `interviewer`: 캠페인 검수자 또는 운영 담당자
- 협업과 실행 규칙은 `AGENTS.md`와 `docs` 문서를 따릅니다.

## 현재 구현 범위

- 상단 공지, 검색, 주요 메뉴
- 추천 배너 3개
- 빠른 카테고리 필터
- 체험단 캠페인 카드 목록
- 선택한 캠페인 상세 패널
- 캠페인 신청 CTA와 신청 상태 메시지
- 광고주 상담 플로팅 안내

## 실행 방법

1. 의존성을 설치합니다.
   - 권장: `bun install`
2. 환경변수 파일이 필요하면 `.env.example`을 참고해 `.env`를 만듭니다.
3. 개발 서버를 실행합니다.
   - `bun run dev`
4. 배포 전 빌드를 확인합니다.
   - `bun run build`

## 문서 검토 순서

모든 작업에서 모든 문서를 매번 읽지 않고, 작업 성격에 맞는 문서만 추가 확인합니다.

1. `AGENTS.md`
   - AI가 지켜야 할 실행 규칙
2. `docs/project-rules.md`
   - 협업, 브랜치, PR, 승인, 병합 기준
3. `docs/data-guide.md`
   - BLOGLE 체험단 캠페인 데이터 이름과 더미 데이터 기준
4. `docs/design-system.md`
   - 화면 톤, 레이아웃, 컴포넌트, 반응형 기준
5. `docs/firebase-guide.md`
   - Firebase 사용 범위, 환경변수, 배포 기준

## 현재 기획 문서

- `docs/blogger-platform-plan.md`: 체험단 블로거 플랫폼 1차 기획
- `docs/data-guide.md`: BLOGLE 데이터 이름 사전과 모델 초안
- `design-qa.md`: 구현 화면 QA 기록

## 현재 기술 기준

- React
- TypeScript
- Vite
- Firebase 준비
- Bun 권장

## 주의사항

- `.env`는 Git에 올리지 않습니다.
- Firebase 키는 `.env.example`에 값 없이 이름만 공유합니다.
- 디자인 기준은 `docs/design-system.md` 기준을 따릅니다.
