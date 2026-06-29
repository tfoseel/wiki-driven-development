import { listServices } from "../../lib/seed-store";
import { ServiceListScreen } from "../../screens/service-list/screen";

export default function ServicesPage() {
  return <ServiceListScreen services={listServices()} />;
}
