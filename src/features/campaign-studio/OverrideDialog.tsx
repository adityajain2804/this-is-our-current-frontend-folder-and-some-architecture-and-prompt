import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Callout } from "@/components/common/states";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerAllocation } from "@/data/types";
import { fmtCOP, fmtPct } from "@/lib/formatters";

const REASONS = [
  { value: "commercial_judgment", label: "Commercial Judgment" },
  { value: "supplier_negotiation", label: "Supplier Negotiation" },
  { value: "competitive_response", label: "Competitive Response" },
  { value: "inventory_clearance", label: "Inventory Clearance" },
];

/** Statutory ceiling from silver_constraint_table_unified (Colombia / INVIMA). */
const STATUTORY_CAP = 40;

export function OverrideDialog({
  row,
  onClose,
}: {
  row: CustomerAllocation | null;
  onClose: () => void;
}) {
  const [reason, setReason] = useState(REASONS[0]!.value);
  const [note, setNote] = useState("");
  const [regular, setRegular] = useState(15);
  const [prime, setPrime] = useState(20);

  useEffect(() => {
    if (!row) return;
    setRegular(Math.round(row.regular_discount_pct * 100));
    setPrime(Math.round(row.prime_discount_pct * 100));
    setReason(REASONS[0]!.value);
    setNote("");
  }, [row]);

  if (!row) return null;

  const primeViolation = prime < regular;
  const capViolation = regular > STATUTORY_CAP || prime > STATUTORY_CAP + 8;
  const baseNim = row.prime_status === "prime" ? row.nim_prime_cop : row.nim_regular_cop;
  const depthDelta = (regular - row.regular_discount_pct * 100) / 100;
  const nimDelta = Math.round(-baseNim * depthDelta * 2.4);
  const blocked = primeViolation || capViolation;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Override recommended depth</DialogTitle>
          <DialogDescription>
            {row.product_name} ({row.product_code}) · Customer {row.customer_id}. Submitting writes
            an auditable row to gold_planner_override_log.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Override reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ov-regular">New regular discount (%)</Label>
              <Input
                id="ov-regular"
                type="number"
                min={0}
                max={STATUTORY_CAP}
                value={regular}
                onChange={(e) => setRegular(Number(e.target.value))}
              />
              <p className="text-[11px] text-ink-3">Capped at {STATUTORY_CAP}% by INVIMA.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ov-prime">New Prime discount (%)</Label>
              <Input
                id="ov-prime"
                type="number"
                min={0}
                max={STATUTORY_CAP + 8}
                value={prime}
                onChange={(e) => setPrime(Number(e.target.value))}
              />
              <p className="text-[11px] text-ink-3">Must stay ≥ regular depth.</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ov-note">Note (max 200 chars)</Label>
            <Textarea
              id="ov-note"
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Document the commercial rationale an auditor would need."
            />
          </div>

          {primeViolation ? (
            <Callout tone="danger">
              Prime depth ({prime}%) is below regular ({regular}%). The dual-discount rule
              D_prime ≥ D_regular is enforced — fix before submitting.
            </Callout>
          ) : capViolation ? (
            <Callout tone="danger">
              Proposed depth exceeds the statutory ceiling in
              silver_constraint_table_unified.
            </Callout>
          ) : (
            <Callout tone={nimDelta >= 0 ? "success" : "warning"}>
              Estimated NIM delta at {fmtPct(regular / 100, 0)} regular /{" "}
              {fmtPct(prime / 100, 0)} Prime:{" "}
              <strong>
                {nimDelta >= 0 ? "+" : "−"}
                {fmtCOP(Math.abs(nimDelta))}
              </strong>{" "}
              against the model recommendation.
            </Callout>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={blocked}
            onClick={() => {
              toast.success("Override logged", {
                description: `${row.customer_id} · ${regular}% / ${prime}% → gold_planner_override_log`,
              });
              onClose();
            }}
          >
            Submit override
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
