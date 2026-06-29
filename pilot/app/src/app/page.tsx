import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell home-page">
      <h1>Mini Booking Pilot</h1>
      <p>A small Wiki-Driven Development booking app.</p>
      <div className="home-actions">
        <Link href="/wiki">Open pilot wiki</Link>
        <Link href="/services">Choose a service</Link>
      </div>
    </main>
  );
}
