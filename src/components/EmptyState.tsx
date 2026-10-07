import Link from "next/link";

export function EmptyState({ message, actionHref, actionLabel }: { message: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="state">
      <p>{message}</p>
      {actionHref && actionLabel ? <Link className="btn" href={actionHref}>{actionLabel}</Link> : null}
    </div>
  );
}
