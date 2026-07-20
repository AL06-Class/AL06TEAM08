export type NotificationChannel = "kakao" | "email";
export type NotificationDeliveryStatus = "sent" | "simulated";

export type ReviewNotificationRequest = {
  campaignId: number;
  reviewId: number;
  reviewUrl: string;
  submittedAt: string;
  preferredChannel: NotificationChannel;
  fallbackChannel: NotificationChannel;
};

export type ReviewNotificationResult = {
  deliveryId: string;
  channel: NotificationChannel;
  status: NotificationDeliveryStatus;
  sentAt: string;
};

const notificationEndpoint = import.meta.env.VITE_REVIEW_NOTIFICATION_ENDPOINT?.trim();

export const reviewNotificationMode = notificationEndpoint ? "live" : "demo";

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export async function sendReviewPublishedNotification(
  request: ReviewNotificationRequest
): Promise<ReviewNotificationResult> {
  if (!notificationEndpoint) {
    await wait(450);
    return {
      deliveryId: `demo-${Date.now()}`,
      channel: request.preferredChannel,
      status: "simulated",
      sentAt: new Date().toISOString()
    };
  }

  const response = await fetch(notificationEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    throw new Error(`알림 서버가 ${response.status} 상태로 응답했습니다.`);
  }

  const body = (await response.json().catch(() => ({}))) as Partial<ReviewNotificationResult>;
  return {
    deliveryId: body.deliveryId ?? `remote-${Date.now()}`,
    channel: body.channel ?? request.preferredChannel,
    status: "sent",
    sentAt: body.sentAt ?? new Date().toISOString()
  };
}

