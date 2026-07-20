# 후기 등록·사장님 알림 자동화

## 구현 흐름

1. QR·GPS 등으로 방문 인증이 끝난 체험단을 선택합니다.
2. 체험단이 발행한 후기 URL을 등록합니다.
3. 브라우저에서 HTTP(S) 형식과 기존 후기 URL 중복 여부를 확인합니다.
4. 후기 상태를 `published`로 바꾸고 알림 서버에 한 번만 요청합니다.
5. 사장님에게 카카오 알림톡을 우선 발송하고, 실패하면 Gmail 이메일로 대체 발송합니다.
6. 발송 채널, 상태, 시각, 발송 ID와 실패 사유를 `reviewNotifications`에 기록합니다.
7. 실패한 건은 후기회수 목록에서 재시도합니다.

## 현재 동작

- `VITE_REVIEW_NOTIFICATION_ENDPOINT`가 비어 있으면 데모 모드입니다.
- 데모 모드는 외부 메시지를 보내지 않고 약 0.45초 후 `simulated` 상태를 반환합니다.
- 엔드포인트를 지정하면 같은 화면에서 실제 서버 요청으로 전환됩니다.
- 브라우저에는 카카오·구글 비밀키를 저장하지 않습니다.

## 알림 서버 계약

요청:

```json
{
  "campaignId": 1,
  "reviewId": 42,
  "reviewUrl": "https://blog.naver.com/example/123",
  "submittedAt": "2026-07-20T04:20:00.000Z",
  "preferredChannel": "kakao",
  "fallbackChannel": "email"
}
```

성공 응답:

```json
{
  "deliveryId": "provider-message-id",
  "channel": "kakao",
  "status": "sent",
  "sentAt": "2026-07-20T04:20:03.000Z"
}
```

실패 시 서버는 4xx 또는 5xx를 반환합니다. 화면은 후기는 보존하고 알림만 `failed`로 표시합니다.

## 운영 구현 기준

- 서버는 Firebase Functions 또는 별도 API로 구현합니다.
- 서버는 로그인 사용자 권한을 검증하고 `campaignId`로 실제 사장님 연락처를 조회합니다. 브라우저가 보낸 수신자 정보는 신뢰하지 않습니다.
- 멱등 키는 `campaignId + reviewId + reviewUrl` 조합을 사용해 중복 발송을 차단합니다.
- 후기 저장과 알림 요청은 분리하고 큐 기반 재시도를 사용합니다.
- 카카오 일반 메시지 API가 아니라 사업자 정보성 메시지용 알림톡 템플릿을 사용합니다.
- Gmail은 서버 측 OAuth 토큰과 `gmail.send` 범위로 발송합니다.
- 카카오 실패 시 이메일 대체 발송 결과도 같은 알림 이력에 기록합니다.
- 수신 거부, 잘못된 연락처, 공급자 장애는 실패 사유를 구분해 운영자가 재처리할 수 있어야 합니다.

## 운영 전 준비

1. 카카오 비즈니스 채널과 알림톡 발신 프로필을 준비합니다.
2. 후기 등록 안내용 정보성 템플릿을 심사받습니다.
3. Google Cloud에서 Gmail API와 OAuth 동의를 구성합니다.
4. 서버 비밀 저장소에 공급자 키와 OAuth 갱신 토큰을 저장합니다.
5. 배포한 알림 API URL을 `.env`의 `VITE_REVIEW_NOTIFICATION_ENDPOINT`에 설정합니다.
6. 실제 번호가 아닌 테스트 수신자로 카카오 성공, 카카오 실패 후 이메일 대체, 전체 실패를 검증합니다.

## 공식 참고

- 카카오톡 메시지 API FAQ: https://developers.kakao.com/docs/latest/ko/kakaotalk-message/faq
- 카카오 알림톡 제작 가이드: https://kakaobusiness.gitbook.io/main/ad/infotalk/content-guide
- Gmail API 메시지 전송: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send
- Gmail API 발송 가이드: https://developers.google.com/workspace/gmail/api/guides/sending
