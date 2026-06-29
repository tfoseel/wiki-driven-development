import type { AvailabilitySlot, SlotStatus } from "../models/availability-slot";
import type { Booking, BookingStatus } from "../models/booking";
import type { Service } from "../models/service";

const initialServices: Service[] = [
  { id: "consultation", name: "Initial consultation", durationMinutes: 45, active: true },
  { id: "follow-up", name: "Follow-up session", durationMinutes: 30, active: true },
  { id: "legacy-review", name: "Legacy review", durationMinutes: 30, active: false }
];

const initialSlots: AvailabilitySlot[] = [
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

const initialBookings: Booking[] = [
  {
    id: "booking-confirmed-001",
    serviceId: "consultation",
    slotId: "slot-consultation-tomorrow-1100",
    customerName: "Alex Kim",
    customerEmail: "alex@example.com",
    status: "confirmed"
  }
];

let services: Service[] = [];
let slots: AvailabilitySlot[] = [];
let bookings: Booking[] = [];

export function resetSeedStore() {
  services = structuredClone(initialServices);
  slots = structuredClone(initialSlots);
  bookings = structuredClone(initialBookings);
}

export function listServices(): Service[] {
  return [...services];
}

export function listSlots(): AvailabilitySlot[] {
  return [...slots];
}

export function listBookings(): Booking[] {
  return [...bookings];
}

export function getService(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getSlot(id: string): AvailabilitySlot | undefined {
  return slots.find((slot) => slot.id === id);
}

export function getBooking(id: string): Booking | undefined {
  return bookings.find((booking) => booking.id === id);
}

export function setSlotStatus(id: string, status: SlotStatus): AvailabilitySlot | undefined {
  const slot = getSlot(id);
  if (!slot) return undefined;
  slot.status = status;
  return { ...slot };
}

export function addBooking(input: Omit<Booking, "id" | "status"> & { status?: BookingStatus }): Booking {
  const booking: Booking = {
    id: `booking-${bookings.length + 1}`,
    status: input.status ?? "confirmed",
    serviceId: input.serviceId,
    slotId: input.slotId,
    customerName: input.customerName,
    customerEmail: input.customerEmail
  };
  bookings.push(booking);
  return { ...booking };
}

export function updateBooking(id: string, patch: Partial<Booking>): Booking | undefined {
  const booking = getBooking(id);
  if (!booking) return undefined;
  Object.assign(booking, patch);
  return { ...booking };
}

resetSeedStore();
