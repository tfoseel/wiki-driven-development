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

export function BookingDetailScreen({ booking, service, slot, canModify, policyReason }: BookingDetailScreenProps) {
  if (!booking) {
    return (
      <main>
        <h1>예약을 찾을 수 없음</h1>
        <p data-testid="booking-not-found">예약 링크를 확인한 뒤 다시 시도하세요.</p>
      </main>
    );
  }

  const inactive = booking.status === "cancelled";

  return (
    <main>
      <h1>예약 상세</h1>
      <p data-testid="booking-status">{booking.status}</p>
      <p>{service?.name ?? booking.serviceId}</p>
      <p>{slot?.startsAt ?? booking.slotId}</p>
      {booking.customerNote ? (
        <section data-testid="customer-note">
          <h2>요청사항</h2>
          <p>{booking.customerNote}</p>
        </section>
      ) : null}
      {inactive ? <p data-testid="inactive-booking">이 예약은 취소되었습니다.</p> : null}
      {!inactive && canModify ? (
        <div>
          <button type="button">일정 변경</button>
          <button type="button">예약 취소</button>
        </div>
      ) : null}
      {!inactive && !canModify ? <p data-testid="policy-blocked">{policyReason}</p> : null}
    </main>
  );
}
