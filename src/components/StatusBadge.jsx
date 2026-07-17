export default function StatusBadge({ status }) {
  const cls = {
    pending: "badge-pending",
    confirmed: "badge-confirmed",
    completed: "badge-completed",
    cancelled: "badge-cancelled",
    declined: "badge-declined",
  }[status] || "badge";
  return <span className={cls}>{status}</span>;
}
