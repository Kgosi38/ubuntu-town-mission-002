import type { SkillKind, SkillStatus } from "@/lib/types";

export function StatusBadge({ kind, status }: { kind: SkillKind; status: SkillStatus }) {
  if (status === "withdrawn") return <span className="badge badge-withdrawn">Withdrawn</span>;
  return kind === "offer"
    ? <span className="badge badge-offer">Offers help</span>
    : <span className="badge badge-request">Needs help</span>;
}
