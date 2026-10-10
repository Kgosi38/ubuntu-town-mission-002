export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return <p className="state" role="status">{label}</p>;
}
