import Link from "next/link";
import type { Service } from "../../../models/service";

const serviceDescriptions: Record<string, string> = {
  consultation: "첫 상담에 필요한 현황 파악과 다음 단계를 함께 정리합니다.",
  "follow-up": "이전 상담 이후의 진행 상황을 점검하고 필요한 조정을 합니다."
};

export function ServiceListScreen({ services }: { services: Service[] }) {
  const activeServices = services.filter((service) => service.active);

  return (
    <main className="product-shell">
      <section className="app-hero" data-testid="app-hero">
        <p className="eyebrow">상담 예약</p>
        <h1>상담 예약하기</h1>
        <p className="hero-copy">
          필요한 상담을 고르고 가능한 시간으로 바로 이어갑니다. 예약 가능한 서비스만 보여주며, 각 서비스에서 다음 단계로 이동할 수 있습니다.
        </p>
      </section>

      {activeServices.length === 0 ? (
        <section className="empty-state" data-testid="empty-services">
          <h2>현재 예약 가능한 서비스가 없습니다</h2>
          <p>새 예약 시간이 열리면 이 화면에서 다시 시작할 수 있습니다.</p>
        </section>
      ) : (
        <ul aria-label="서비스" className="service-grid" data-testid="service-grid">
          {activeServices.map((service) => (
            <li key={service.id} className="service-card" data-testid="service-card">
              <div>
                <p className="card-kicker">{service.durationMinutes}분</p>
                <h2>{service.name}</h2>
                <p>{serviceDescriptions[service.id] ?? "상담 목적에 맞는 시간을 선택합니다."}</p>
              </div>
              <Link className="button-primary" href={`/bookings/new?serviceId=${service.id}`}>
                예약 시작
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
