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
        <h1>Service unavailable</h1>
        <p data-testid="invalid-service">Choose an active service before booking.</p>
      </main>
    );
  }

  const availableSlots = slots.filter((slot) => slot.serviceId === service.id && slot.status === "available");

  return (
    <main>
      <h1>New booking</h1>
      <p data-testid="selected-service">{service.name}</p>
      {availableSlots.length === 0 ? (
        <p data-testid="no-slots">No available slots for this service.</p>
      ) : (
        <form>
          <label>
            Slot
            <select name="slotId" data-testid="slot-select">
              {availableSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.startsAt}
                </option>
              ))}
            </select>
          </label>
          <label>
            Name
            <input name="customerName" data-testid="customer-name" />
          </label>
          <label>
            Email
            <input name="customerEmail" type="email" data-testid="customer-email" />
          </label>
          <button type="submit">Create booking</button>
        </form>
      )}
    </main>
  );
}
