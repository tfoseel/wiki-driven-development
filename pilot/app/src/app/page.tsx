import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Mini Booking Pilot</h1>
      <p>A small Wiki-Driven Development booking app.</p>
      <Link href="/services">Choose a service</Link>
    </main>
  );
}
