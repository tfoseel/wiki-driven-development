import Link from "next/link";
import { listServices } from "../lib/seed-store";

export default function HomePage() {
  const services = listServices().filter((service) => service.active);

  return (
    <main>
      <h1>Mini Booking Pilot</h1>
      <p>Choose a service to start a booking.</p>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            <Link href={`/bookings/new?serviceId=${service.id}`}>{service.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
