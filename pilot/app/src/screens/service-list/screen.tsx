import Link from "next/link";
import type { Service } from "../../models/service";

export function ServiceListScreen({ services }: { services: Service[] }) {
  const activeServices = services.filter((service) => service.active);

  return (
    <main>
      <h1>Book a consultation</h1>
      {activeServices.length === 0 ? (
        <p data-testid="empty-services">No services are currently available.</p>
      ) : (
        <ul aria-label="Services">
          {activeServices.map((service) => (
            <li key={service.id} data-testid="service-card">
              <h2>{service.name}</h2>
              <p>{service.durationMinutes} minutes</p>
              <Link href={`/bookings/new?serviceId=${service.id}`}>Start booking</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
