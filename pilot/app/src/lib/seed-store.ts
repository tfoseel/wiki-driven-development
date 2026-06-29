export type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  active: boolean;
};

export type SlotStatus = "available" | "booked" | "unavailable";

export type AvailabilitySlot = {
  id: string;
  serviceId: string;
  startsAt: string;
  status: SlotStatus;
};

export type BookingStatus = "confirmed" | "rescheduled" | "cancelled";

export type Booking = {
  id: string;
  serviceId: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  status: BookingStatus;
};

const services: Service[] = [
  { id: "consultation", name: "Initial consultation", durationMinutes: 45, active: true },
  { id: "follow-up", name: "Follow-up session", durationMinutes: 30, active: true },
  { id: "legacy-review", name: "Legacy review", durationMinutes: 30, active: false }
];

const slots: AvailabilitySlot[] = [
  {
    id: "slot-consultation-tomorrow-0900",
    serviceId: "consultation",
    startsAt: "2026-07-01T09:00:00+09:00",
    status: "available"
  },
  {
    id: "slot-consultation-tomorrow-1100",
    serviceId: "consultation",
    startsAt: "2026-07-01T11:00:00+09:00",
    status: "booked"
  },
  {
    id: "slot-follow-up-tomorrow-1400",
    serviceId: "follow-up",
    startsAt: "2026-07-01T14:00:00+09:00",
    status: "available"
  }
];

const bookings: Booking[] = [
  {
    id: "booking-confirmed-001",
    serviceId: "consultation",
    slotId: "slot-consultation-tomorrow-1100",
    customerName: "Alex Kim",
    customerEmail: "alex@example.com",
    status: "confirmed"
  }
];

export function listServices(): Service[] {
  return [...services];
}

export function listSlots(): AvailabilitySlot[] {
  return [...slots];
}

export function listBookings(): Booking[] {
  return [...bookings];
}
