import type { AvailabilitySlot } from "../../../../models/availability-slot";
import type { Service } from "../../../../models/service";

type BookingNewScreenProps = {
  service?: Service;
  slots: AvailabilitySlot[];
  submitAction?: (formData: FormData) => Promise<void>;
};

function formatSlot(startsAt: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul"
  }).format(new Date(startsAt));
}

export function BookingNewScreen({ service, slots, submitAction }: BookingNewScreenProps) {
  if (!service) {
    return (
      <main className="product-shell product-shell-narrow">
        <section className="app-hero" data-testid="app-hero">
          <p className="eyebrow">예약 정보</p>
          <h1>서비스를 예약할 수 없음</h1>
          <p className="hero-copy" data-testid="invalid-service">
            예약을 시작하기 전에 활성 서비스를 선택하세요.
          </p>
        </section>
      </main>
    );
  }

  const availableSlots = slots.filter((slot) => slot.serviceId === service.id && slot.status === "available");

  return (
    <main className="product-shell booking-layout">
      <section className="app-hero" data-testid="app-hero">
        <p className="eyebrow">예약 정보</p>
        <h1>새 예약</h1>
        <p className="hero-copy">
          선택한 서비스의 가능한 시간을 확인하고, 연락 가능한 정보를 남겨 예약을 확정합니다.
        </p>
        <div className="metric-row">
          <span data-testid="selected-service">{service.name}</span>
          <span>{service.durationMinutes}분</span>
        </div>
      </section>

      <aside className="progress-panel" data-testid="booking-progress" aria-label="예약 진행 단계">
        <span>1 / 3</span>
        <strong>예약 정보</strong>
        <p>시간 선택, 연락처 입력, 예약 완료 순서로 진행합니다.</p>
      </aside>

      {availableSlots.length === 0 ? (
        <section className="empty-state" data-testid="no-slots">
          <h2>예약 가능한 시간이 없습니다</h2>
          <p>다른 서비스를 선택하거나 새 시간이 열릴 때 다시 확인하세요.</p>
        </section>
      ) : (
        <form className="form-panel" action={submitAction} data-testid="booking-form-panel">
          <label className="field">
            <span>시간</span>
            <select name="slotId" data-testid="slot-select">
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {formatSlot(slot.startsAt)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>이름</span>
            <input name="customerName" data-testid="customer-name" autoComplete="name" />
          </label>
          <label className="field">
            <span>이메일</span>
            <input name="customerEmail" type="email" data-testid="customer-email" autoComplete="email" />
          </label>
          <label className="field">
            <span>요청사항</span>
            <textarea
              name="customerNote"
              data-testid="customer-note"
              maxLength={500}
              rows={5}
              placeholder="상담 전에 알아야 할 내용이 있으면 적어 주세요."
            />
          </label>
          <button className="button-primary full-width" type="submit">
            예약 생성
          </button>
        </form>
      )}
    </main>
  );
}
