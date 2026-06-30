import Link from "next/link";
import type { AvailabilitySlot } from "../../../../models/availability-slot";
import type { Booking } from "../../../../models/booking";
import type { Service } from "../../../../models/service";

type BookingCompleteScreenProps = {
  booking?: Booking;
  service?: Service;
  slot?: AvailabilitySlot;
};

function formatSlot(startsAt?: string) {
  if (!startsAt) return "선택한 시간";
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul"
  }).format(new Date(startsAt));
}

export function BookingCompleteScreen({ booking, service, slot }: BookingCompleteScreenProps) {
  if (!booking) {
    return (
      <main className="product-shell product-shell-narrow">
        <section className="app-hero" data-testid="app-hero">
          <p className="eyebrow">예약 완료</p>
          <h1>예약을 찾을 수 없음</h1>
          <p className="hero-copy">예약 링크를 다시 확인하거나 서비스 선택부터 새로 시작하세요.</p>
        </section>
        <Link className="button-secondary" href="/services">
          서비스 선택하기
        </Link>
      </main>
    );
  }

  return (
    <main className="product-shell product-shell-narrow">
      <section className="app-hero" data-testid="app-hero">
        <span className="status-badge status-confirmed" data-testid="status-badge">
          {booking.status}
        </span>
        <p className="eyebrow">예약 완료</p>
        <h1>예약 완료</h1>
        <p className="hero-copy">예약이 확정되었습니다. 아래 내용을 확인하고 필요하면 예약 상세에서 관리하세요.</p>
      </section>

      <section className="summary-panel" data-testid="booking-summary-panel" aria-label="예약 요약">
        <dl>
          <div>
            <dt>서비스</dt>
            <dd data-testid="booking-summary">{service?.name ?? "서비스"}</dd>
          </div>
          <div>
            <dt>시간</dt>
            <dd>{formatSlot(slot?.startsAt)}</dd>
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

      <div className="action-row">
        <Link className="button-primary" href={`/bookings/${booking.id}`}>
          예약 관리
        </Link>
        <Link className="button-secondary" href="/services">
          다른 예약 보기
        </Link>
      </div>
    </main>
  );
}
