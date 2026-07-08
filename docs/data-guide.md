# 데이터 가이드

BLOGLE 체험단 블로거 플랫폼의 더미 데이터와 DB 연결 기준을 정리합니다.

## 목적

- 체험단 캠페인, 블로거 프로필, 캠페인 신청 데이터를 같은 이름으로 사용합니다.
- 더미 데이터와 실제 Firebase 구조가 크게 달라지지 않게 합니다.
- AI가 화면마다 임의의 컬렉션, 필드, 상태값을 만들지 않게 합니다.

## 기본값

### 핵심 전제

- 현재 첫 화면은 공통 캠페인 탐색 화면입니다.
- 역할 값은 기존 레포 규칙을 유지합니다.
- BLOGLE에서는 기존 역할 값을 아래처럼 해석합니다.
  - `candidate`: 블로거 또는 체험단 신청자
  - `recruiter`: 광고주 또는 브랜드 담당자
  - `interviewer`: 캠페인 검수자 또는 운영 담당자

### 데이터 작성 기준

- 필드명은 영어 `camelCase`를 사용합니다.
- 각 데이터에는 가능하면 `id`, `createdAt`, `updatedAt`을 포함합니다.
- 날짜는 문자열 또는 Firebase Timestamp 중 하나로 통일합니다.
- 상태값은 자유 텍스트가 아니라 정해진 값만 사용합니다.
- 같은 의미의 필드를 화면마다 다른 이름으로 만들지 않습니다.

### 공통 이름 사전 운영

- DB를 처음부터 완성하지 않고, 공통으로 부를 이름만 먼저 맞춥니다.
- 새 컬렉션, 필드, 상태값, 역할 값이 필요하면 구현 전에 이 문서에 먼저 추가합니다.
- 기존 이름과 의미가 같으면 새 이름을 만들지 않습니다.
- 기능별 임시 더미 데이터는 최소로 만들고, 공통 이름은 이 문서의 사전을 따릅니다.

### 더미 데이터

- 더미 데이터는 기능 검증에 필요한 최소만 만듭니다.
- Firebase 연결 전에도 캠페인 탐색, 필터, 상세 확인, 신청 CTA 흐름을 확인할 수 있어야 합니다.
- 화면만 맞추기 위한 임시 필드는 실제 DB 연결 전 제거 또는 확정 여부를 검토합니다.

### DB 연결 기준

- DB 구조가 정해지기 전에는 화면 컴포넌트와 데이터 접근 코드를 분리합니다.
- Firebase 연결 코드는 한 곳에서 관리합니다.
- 화면 컴포넌트는 가능한 한 데이터 형태에만 의존하게 만듭니다.

## 공통 이름 사전

### 컬렉션 이름

- `users`: 유저
- `companies`: 광고주 또는 브랜드 기업
- `bloggerProfiles`: 블로거 프로필
- `bloggerCampaigns`: 체험단 캠페인
- `campaignApplications`: 체험단 캠페인 신청
- `campaignReviews`: 발행 리뷰 또는 검수 대상 리뷰

### 공통 필드 이름

- `id`: 문서 또는 항목 식별자
- `userId`: 유저 식별자
- `companyId`: 기업 식별자
- `bloggerProfileId`: 블로거 프로필 식별자
- `campaignId`: 체험단 캠페인 식별자
- `applicationId`: 캠페인 신청 식별자
- `reviewId`: 리뷰 식별자
- `status`: 상태값
- `title`: 제목
- `description`: 설명
- `brandName`: 브랜드명
- `category`: 카테고리
- `region`: 지역
- `platform`: 리뷰 발행 채널
- `imageUrl`: 이미지 URL
- `reward`: 제공 내역 또는 보상
- `dueDate`: 화면 표시용 마감일
- `applicantCount`: 신청자 수
- `recruitmentCount`: 모집 인원
- `featured`: 추천 또는 프리미엄 노출 여부
- `tags`: 태그 목록
- `source`: 생성 또는 판단 근거
- `createdAt`: 생성 시각
- `updatedAt`: 수정 시각

### 역할 값

- `candidate`: 블로거 또는 체험단 신청자
- `recruiter`: 광고주 또는 브랜드 담당자
- `interviewer`: 캠페인 검수자 또는 운영 담당자

### 상태값 초안

- `draft`: 초안
- `submitted`: 제출됨
- `pending`: 대기 중
- `approved`: 승인됨
- `declined`: 거절됨
- `selected`: 선정됨
- `published`: 발행됨
- `completed`: 완료
- `cancelled`: 취소됨

## 데이터 모델 초안

### users

- `id`
- `name`
- `role`
- `email`
- `createdAt`
- `updatedAt`

### companies

- `id`
- `brandName`
- `description`
- `createdAt`
- `updatedAt`

### bloggerProfiles

- `id`
- `userId`
- `displayName`
- `platform`
- `category`
- `region`
- `description`
- `createdAt`
- `updatedAt`

### bloggerCampaigns

- `id`
- `companyId`
- `brandName`
- `title`
- `description`
- `category`
- `region`
- `platform`
- `reward`
- `dueDate`
- `recruitmentCount`
- `applicantCount`
- `imageUrl`
- `tags`
- `featured`
- `status`
- `createdAt`
- `updatedAt`

### campaignApplications

- `id`
- `campaignId`
- `userId`
- `bloggerProfileId`
- `status`
- `message`
- `createdAt`
- `updatedAt`

### campaignReviews

- `id`
- `campaignId`
- `applicationId`
- `userId`
- `platform`
- `source`
- `status`
- `createdAt`
- `updatedAt`

## 최종 결정

- 주요 컬렉션: `users`, `companies`, `bloggerProfiles`, `bloggerCampaigns`, `campaignApplications`, `campaignReviews`
- 역할 기준: 기존 레포 역할 값 유지, BLOGLE 맥락으로 해석
- 필드명 규칙: 영어 `camelCase`
- 상태값 기준: 자유 텍스트가 아니라 정해진 값만 사용
- 더미 데이터 기준: 캠페인 탐색과 신청 CTA 검증에 필요한 최소 데이터만 작성
- DB 연결 기준: 화면 컴포넌트와 데이터 접근 코드를 분리하고 Firebase 연결 코드는 한 곳에서 관리
- 공통 이름 사전 기준: 새 컬렉션, 필드, 상태값, 역할 값은 구현 전에 이 문서에 먼저 추가

## 변경 이력

- 2026-07-08: 기존 다른 아이템 데이터 기준을 제거하고 BLOGLE 체험단 캠페인 데이터 기준으로 정리
