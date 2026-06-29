import Link from "next/link";
import type { AvailabilitySlot } from "../../../../models/availability-slot";
import type { Booking } from "../../../../models/booking";
import type { Service } from "../../../../models/service";

type BookingCompleteScreenProps = {
  booking?: Booking;
  service?: Service;
  slot?: AvailabilitySlot;
};

export function BookingCompleteScreen({ booking, service, slot }: BookingCompleteScreenProps) {
  if (!booking) {
    return (
      <main>
        <h1>예약을 찾을 수 없음</h1>
        <Link href="/services">서비스 선택하기</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>예약 완료</h1>
      <p data-testid="booking-summary">
        {service?.name ?? "서비스"} / {slot?.startsAt ?? "선택한 시간"}
      </p>
      <Link href={`/bookings/${booking.id}`}>예약 관리</Link>
    </main>
  );
}
