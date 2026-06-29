import Link from "next/link";
import type { Service } from "../../../models/service";

export function ServiceListScreen({ services }: { services: Service[] }) {
  const activeServices = services.filter((service) => service.active);

  return (
    <main>
      <h1>상담 예약하기</h1>
      {activeServices.length === 0 ? (
        <p data-testid="empty-services">현재 예약 가능한 서비스가 없습니다.</p>
      ) : (
        <ul aria-label="서비스">
          {activeServices.map((service) => (
            <li key={service.id} data-testid="service-card">
              <h2>{service.name}</h2>
              <p>{service.durationMinutes}분</p>
              <Link href={`/bookings/new?serviceId=${service.id}`}>예약 시작</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
