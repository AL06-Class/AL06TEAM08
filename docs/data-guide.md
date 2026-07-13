# 데이터 가이드

줄서 체험단 플랫폼의 더미 데이터와 DB 연결 기준을 정리합니다.

## 목적

- 오프라인 체험단 캠페인, 예약 슬롯, 방문 인증, 후기 회수 데이터를 같은 이름으로 사용합니다.
- 더미 데이터와 실제 Firebase 구조가 크게 달라지지 않게 합니다.
- AI가 화면마다 임의의 컬렉션, 필드, 상태값을 만들지 않게 합니다.

## 기본값

### 핵심 전제

- 현재 첫 화면은 공통 캠페인 탐색 및 MVP 설명 화면입니다.
- 역할 값은 기존 레포 규칙을 유지합니다.
- 줄서에서는 기존 역할 값을 아래처럼 해석합니다.
  - `candidate`: 블로거 또는 체험단 신청자
  - `recruiter`: 오프라인 매장 사장님 또는 브랜드 담당자
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
- Firebase 연결 전에도 캠페인 탐색, 한산 시간대 조건 확인, 방문 인증 가치 설명, 신청 CTA 흐름을 확인할 수 있어야 합니다.
- 화면만 맞추기 위한 임시 필드는 실제 DB 연결 전 제거 또는 확정 여부를 검토합니다.

### DB 연결 기준

- DB 구조가 정해지기 전에는 화면 컴포넌트와 데이터 접근 코드를 분리합니다.
- Firebase 연결 코드는 한 곳에서 관리합니다.
- 화면 컴포넌트는 가능한 한 데이터 형태에만 의존하게 만듭니다.

## 공통 이름 사전

### 컬렉션 이름

- `users`: 유저
- `companies`: 광고주 또는 오프라인 매장
- `ownerCampaignDrafts`: 사장님 체험단 모집 등록 초안
- `bloggerProfiles`: 블로거 프로필
- `bloggerCampaigns`: 체험단 캠페인
- `reservationSlots`: 예약 가능 시간대
- `campaignApplications`: 체험단 캠페인 신청
- `visitCheckIns`: QR·GPS 방문 인증 기록
- `campaignReviews`: 발행 리뷰 또는 검수 대상 리뷰
- `reviewReminders`: 후기 회수 리마인드

### 공통 필드 이름

- `id`: 문서 또는 항목 식별자
- `userId`: 유저 식별자
- `companyId`: 기업 또는 매장 식별자
- `bloggerProfileId`: 블로거 프로필 식별자
- `campaignId`: 체험단 캠페인 식별자
- `slotId`: 예약 슬롯 식별자
- `applicationId`: 캠페인 신청 식별자
- `checkInId`: 방문 인증 식별자
- `reviewId`: 리뷰 식별자
- `status`: 상태값
- `title`: 제목
- `description`: 설명
- `brandName`: 브랜드명 또는 매장명
- `storeName`: 사장님 등록 폼의 매장명
- `ownerName`: 사장님 성함
- `phone`: 사장님 연락처
- `category`: 카테고리
- `region`: 지역
- `platform`: 리뷰 발행 채널
- `imageUrl`: 이미지 URL
- `reward`: 제공 내역 또는 보상
- `offer`: 사장님이 입력한 제공 내역
- `dueDate`: 화면 표시용 마감일
- `applicantCount`: 신청자 수
- `recruitmentCount`: 모집 인원
- `quietTimeSlot`: 한산 시간대
- `reservationStatus`: 예약 연동 상태
- `reservationProvider`: 예약 연동 서비스명
- `verificationMethod`: 방문 인증 방식
- `reviewReminderPolicy`: 후기 회수 또는 리마인드 기준
- `reviewerName`: 후기 작성 대상 체험단 표시 이름
- `reviewDueDate`: 후기 제출 마감일
- `reminderCount`: 후기 리마인드 발송 횟수
- `lastReminderAt`: 마지막 후기 리마인드 발송 시각
- `pricingHypothesis`: 가격 가설
- `campaignGoal`: 캠페인 목표
- `matchingPreference`: 선호 체험단 기준
- `autoRegistrationEnabled`: 시간대 분석 후 자동 등록 사용 여부
- `featured`: 추천 또는 프리미엄 노출 여부
- `tags`: 태그 목록
- `source`: 생성 또는 판단 근거
- `createdAt`: 생성 시각
- `updatedAt`: 수정 시각

### 역할 값

- `candidate`: 블로거 또는 체험단 신청자
- `recruiter`: 오프라인 매장 사장님 또는 브랜드 담당자
- `interviewer`: 캠페인 검수자 또는 운영 담당자

### 상태값 초안

- `draft`: 초안
- `submitted`: 제출됨
- `autoRegistered`: 자동 등록됨
- `pending`: 대기 중
- `approved`: 승인됨
- `declined`: 거절됨
- `selected`: 선정됨
- `matched`: AI 매칭됨
- `reserved`: 예약됨
- `checkInPending`: 체크인 대기 중
- `checkedIn`: 방문 인증됨
- `reminded`: 리마인드 발송됨
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
- `region`
- `createdAt`
- `updatedAt`

### ownerCampaignDrafts

- `id`
- `companyId`
- `storeName`
- `ownerName`
- `phone`
- `category`
- `region`
- `quietTimeSlot`
- `offer`
- `recruitmentCount`
- `reservationProvider`
- `campaignGoal`
- `matchingPreference`
- `autoRegistrationEnabled`
- `status`
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
- `quietTimeSlot`
- `reservationStatus`
- `verificationMethod`
- `reviewReminderPolicy`
- `pricingHypothesis`
- `recruitmentCount`
- `applicantCount`
- `imageUrl`
- `tags`
- `featured`
- `status`
- `createdAt`
- `updatedAt`

### reservationSlots

- `id`
- `campaignId`
- `quietTimeSlot`
- `recruitmentCount`
- `reservationStatus`
- `status`
- `createdAt`
- `updatedAt`

### campaignApplications

- `id`
- `campaignId`
- `slotId`
- `userId`
- `bloggerProfileId`
- `status`
- `message`
- `createdAt`
- `updatedAt`

### visitCheckIns

- `id`
- `campaignId`
- `applicationId`
- `userId`
- `verificationMethod`
- `status`
- `createdAt`
- `updatedAt`

### campaignReviews

- `id`
- `campaignId`
- `applicationId`
- `userId`
- `platform`
- `source`
- `reviewerName`
- `reviewDueDate`
- `status`
- `createdAt`
- `updatedAt`

### reviewReminders

- `id`
- `campaignId`
- `applicationId`
- `reviewId`
- `reviewReminderPolicy`
- `reminderCount`
- `lastReminderAt`
- `status`
- `createdAt`
- `updatedAt`

## 최종 결정

- 주요 컬렉션: `users`, `companies`, `ownerCampaignDrafts`, `bloggerProfiles`, `bloggerCampaigns`, `reservationSlots`, `campaignApplications`, `visitCheckIns`, `campaignReviews`, `reviewReminders`
- 역할 기준: 기존 레포 역할 값 유지, 줄서 맥락으로 해석
- 필드명 규칙: 영어 `camelCase`
- 상태값 기준: 자유 텍스트가 아니라 정해진 값만 사용
- 더미 데이터 기준: 캠페인 탐색, 예약 슬롯 조건 확인, 방문 인증, 후기 회수 흐름 검증에 필요한 최소 데이터만 작성
- DB 연결 기준: 화면 컴포넌트와 데이터 접근 코드를 분리하고 Firebase 연결 코드는 한 곳에서 관리
- 공통 이름 사전 기준: 새 컬렉션, 필드, 상태값, 역할 값은 구현 전에 이 문서에 먼저 추가

## 변경 이력

- 2026-07-08: 기존 다른 아이템 데이터 기준을 제거하고 줄서 체험단 캠페인 데이터 기준으로 정리
- 2026-07-10: 제품 기획 워크시트 기준으로 예약 슬롯, QR·GPS 방문 인증, 후기 리마인드 데이터 기준 보강
- 2026-07-10: 사장님 체험단 모집 등록 폼 기준으로 `ownerCampaignDrafts`, 자동 등록, AI 매칭, 체크인 대기 상태값 보강
- 2026-07-13: 후기회수 관리 화면 기준으로 후기 작성자, 제출 마감일, 리마인드 횟수와 마지막 발송 시각 필드 보강
