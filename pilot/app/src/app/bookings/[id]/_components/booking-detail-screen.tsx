import type { AvailabilitySlot } from "../../../../models/availability-slot";
import type { Booking } from "../../../../models/booking";
import type { Service } from "../../../../models/service";

type BookingDetailScreenProps = {
  booking?: Booking;
  service?: Service;
  slot?: AvailabilitySlot;
  canModify: boolean;
  policyReason?: string;
};

function formatSlot(startsAt?: string) {
  if (!startsAt) return "선택한 시간";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul"
  }).format(new Date(startsAt));
}

export function BookingDetailScreen({ booking, service, slot, canModify, policyReason }: BookingDetailScreenProps) {
  if (!booking) {
    return (
      <main className="product-shell product-shell-narrow">
        <section className="app-hero" data-testid="app-hero">
          <p className="eyebrow">예약 관리</p>
          <h1>예약을 찾을 수 없음</h1>
          <p className="hero-copy" data-testid="booking-not-found">
            예약 링크를 확인한 뒤 다시 시도하세요.
          </p>
        </section>
      </main>
    );
  }

  const inactive = booking.status === "cancelled";

  return (
    <main className="product-shell detail-layout">
      <section className="app-hero" data-testid="app-hero">
        <span
          className={`status-badge ${inactive ? "status-cancelled" : "status-confirmed"}`}
          data-testid="status-badge"
        >
          {booking.status}
        </span>
        <p className="eyebrow">예약 관리</p>
        <h1>예약 상세</h1>
        <p className="hero-copy">예약 상태와 요청사항을 확인하고, 정책이 허용하는 경우 일정을 변경하거나 취소할 수 있습니다.</p>
      </section>

      <section className="summary-panel" data-testid="booking-summary-panel" aria-label="예약 상세 요약">
        <dl>
          <div>
            <dt>상태</dt>
            <dd data-testid="booking-status">{booking.status}</dd>
          </div>
          <div>
            <dt>서비스</dt>
            <dd>{service?.name ?? booking.serviceId}</dd>
          </div>
          <div>
            <dt>시간</dt>
            <dd>{formatSlot(slot?.startsAt) || booking.slotId}</dd>
          </div>
          <div>
            <dt>고객</dt>
            <dd>{booking.customerName}</dd>
          </div>
          <div>
            <dt>이메일</dt>
            <dd>{booking.customerEmail}</dd>
          </div>
        </dl>
      </section>

      {booking.customerNote ? (
        <section className="note-panel" data-testid="customer-note">
          <h2>요청사항</h2>
          <p>{booking.customerNote}</p>
        </section>
      ) : null}

      {booking.requestPhoto ? (
        <section className="photo-panel" data-testid="attached-photo">
          <h2>첨부 사진</h2>
          <img src={booking.requestPhoto.dataUrl} alt={`${booking.requestPhoto.name} 첨부 사진`} />
        </section>
      ) : null}

      <section className="action-panel" aria-label="예약 관리 행동">
        <h2>예약 관리</h2>
        {inactive ? <p data-testid="inactive-booking">이 예약은 취소되었습니다.</p> : null}
        {!inactive && canModify ? (
          <div className="action-row">
            <button className="button-secondary" type="button">
              일정 변경
            </button>
            <button className="button-primary" type="button">
              예약 취소
            </button>
          </div>
        ) : null}
        {!inactive && !canModify ? <p data-testid="policy-blocked">{policyReason}</p> : null}
      </section>
    </main>
  );
}
