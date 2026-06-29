import type { AvailabilitySlot } from "../../models/availability-slot";
import type { Service } from "../../models/service";

type BookingNewScreenProps = {
  service?: Service;
  slots: AvailabilitySlot[];
};

export function BookingNewScreen({ service, slots }: BookingNewScreenProps) {
  if (!service) {
    return (
      <main>
        <h1>서비스를 예약할 수 없음</h1>
        <p data-testid="invalid-service">예약을 시작하기 전에 활성 서비스를 선택하세요.</p>
      </main>
    );
  }

  const availableSlots = slots.filter((slot) => slot.serviceId === service.id && slot.status === "available");

  return (
    <main>
      <h1>새 예약</h1>
      <p data-testid="selected-service">{service.name}</p>
      {availableSlots.length === 0 ? (
        <p data-testid="no-slots">이 서비스에 예약 가능한 시간이 없습니다.</p>
      ) : (
        <form>
          <label>
            시간
            <select name="slotId" data-testid="slot-select">
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.startsAt}
                </option>
              ))}
            </select>
          </label>
          <label>
            이름
            <input name="customerName" data-testid="customer-name" />
          </label>
          <label>
            이메일
            <input name="customerEmail" type="email" data-testid="customer-email" />
          </label>
          <button type="submit">예약 생성</button>
        </form>
      )}
    </main>
  );
}
