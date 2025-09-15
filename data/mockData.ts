export const mockShipments = [
  { id: "SHP001", title: "Electronics", status: "Pending", destination: "Johannesburg", date: "2025-09-10" },
  { id: "SHP002", title: "Documents", status: "In Transit", destination: "Pretoria", date: "2025-09-11" },
  { id: "SHP003", title: "Clothing", status: "Delivered", destination: "Sandton", date: "2025-09-12" },
  { id: "SHP004", title: "Books", status: "Failed", destination: "Randburg", date: "2025-09-13" },
  { id: "SHP005", title: "Shoes", status: "Pending", destination: "Midrand", date: "2025-09-14" },
  { id: "SHP006", title: "Medicine", status: "Delivered", destination: "Centurion", date: "2025-09-14" },
  { id: "SHP007", title: "Groceries", status: "In Transit", destination: "Rosebank", date: "2025-09-14" },
];

export function getShipmentsByStatus() {
  const statusCount = { pending: 0, in_transit: 0, delivered: 0, failed: 0 };
  for (const shipment of mockShipments) {
    switch (shipment.status) {
      case "Pending":
        statusCount.pending++;
        break;
      case "In Transit":
        statusCount.in_transit++;
        break;
      case "Delivered":
        statusCount.delivered++;
        break;
      case "Failed":
        statusCount.failed++;
        break;
    }
  }
  return statusCount;
}

export function getDriversByStatus() {
  // Mock driver stats
  return {
    active: 5,
    on_delivery: 3,
    inactive: 2,
  };
}
