import type { Area, Problem, User } from "./types"

const now = Date.now()
const HOUR = 3600 * 1000
const DAY = 24 * HOUR

/** helper: ISO string N hours ago */
function ago(hours: number): string {
  return new Date(now - hours * HOUR).toISOString()
}

export const INITIAL_AREAS: Area[] = [
  {
    slug: "compliance",
    name: "Compliance",
    description: "Regulatory requirements, audits, and policy enforcement issues.",
    color: "oklch(0.58 0.17 20)",
    icon: "shield-check",
  },
  {
    slug: "finance",
    name: "Finance",
    description: "Billing, reconciliation, invoicing, and accounting problems.",
    color: "oklch(0.58 0.13 155)",
    icon: "wallet",
  },
  {
    slug: "operations",
    name: "Operations",
    description: "Operational procedures and common operational issues.",
    color: "oklch(0.5 0.19 262)",
    icon: "workflow",
  },
  {
    slug: "sales",
    name: "Sales",
    description: "CRM, pipeline, quoting, and customer onboarding issues.",
    color: "oklch(0.62 0.16 50)",
    icon: "trending-up",
  },
  {
    slug: "tech",
    name: "Tech",
    description: "APIs, integrations, infrastructure, and engineering incidents.",
    color: "oklch(0.55 0.16 300)",
    icon: "cpu",
  },
]

export const INITIAL_USERS: User[] = [
  {
    id: "u-admin",
    name: "Alex Morgan",
    email: "alex.morgan@company.com",
    role: "administrator",
    color: "oklch(0.5 0.19 262)",
    position: "Operations Lead",
    joinedAt: ago(365 * 24),
  },
  {
    id: "u-editor",
    name: "Sam Rivera",
    email: "sam.rivera@company.com",
    role: "editor",
    color: "oklch(0.58 0.13 155)",
    position: "Tech Lead",
    joinedAt: ago(280 * 24),
  },
  {
    id: "u-viewer",
    name: "Jordan Lee",
    email: "jordan.lee@company.com",
    role: "viewer",
    color: "oklch(0.62 0.16 50)",
    position: "Sales Manager",
    joinedAt: ago(180 * 24),
  },
  {
    id: "u-editor-2",
    name: "Priya Nair",
    email: "priya.nair@company.com",
    role: "editor",
    color: "oklch(0.55 0.16 300)",
    position: "Compliance Analyst",
    joinedAt: ago(90 * 24),
  },
]

let seq = 0
function pid(): string {
  seq += 1
  return `p-${seq.toString().padStart(3, "0")}`
}

export const INITIAL_PROBLEMS: Problem[] = [
  // ---------------- OPERATIONS ----------------
  {
    id: pid(),
    areaSlug: "operations",
    title: "Transaction remains in WAITING",
    description:
      "The transaction remains in WAITING status after the expected processing time. This usually happens when the payment provider has not returned a final status callback, or when the settlement job has not yet picked up the record.",
    solution:
      "1. Check the Transaction ID in the payments dashboard.\n2. Verify the payment method used by the customer.\n3. Check the provider response payload for a final status.\n4. Verify the transaction amount matches the order total.\n5. If the transaction remains pending after 30 minutes, escalate it to the Payments team.",
    tags: ["transaction", "waiting", "payment"],
    images: [],
    author: "Support Team",
    createdAt: ago(72),
    updatedAt: ago(2),
  },
  {
    id: pid(),
    areaSlug: "operations",
    title: "Webhook not received",
    description:
      "A downstream service reports that an expected webhook event was never delivered. Events may be delayed, dropped due to a 5xx response, or filtered out by an incorrect subscription.",
    solution:
      "1. Open the webhook delivery log and search by event ID.\n2. Confirm the endpoint returned a 2xx response.\n3. If the endpoint returned 5xx, trigger a manual redelivery.\n4. Verify the subscription includes the relevant event type.\n5. Check for signature verification failures on the receiver side.",
    tags: ["webhook", "api", "integration"],
    images: [],
    author: "Priya Nair",
    createdAt: ago(120),
    updatedAt: ago(26),
  },
  {
    id: pid(),
    areaSlug: "operations",
    title: "Batch export stuck at 0%",
    description:
      "Scheduled batch exports do not progress and remain at 0% completion. Typically caused by a stalled worker or a lock held by a previous failed run.",
    solution:
      "1. Check the export worker queue depth.\n2. Look for stale locks in the jobs table.\n3. Release the lock for the affected export ID.\n4. Requeue the export job.\n5. Monitor progress and confirm completion.",
    tags: ["export", "batch", "jobs"],
    images: [],
    author: "Sam Rivera",
    createdAt: ago(200),
    updatedAt: ago(50),
  },
  {
    id: pid(),
    areaSlug: "operations",
    title: "Duplicate orders created on retry",
    description:
      "Customers occasionally see two identical orders when the checkout request is retried after a timeout. The root cause is a missing idempotency key on the order creation call.",
    solution:
      "1. Identify the duplicate orders by customer and timestamp.\n2. Cancel the duplicate that has no payment attached.\n3. Confirm the surviving order reflects the correct total.\n4. Ensure the client sends an idempotency key on retries.\n5. Document the incident in the operations log.",
    tags: ["orders", "duplicate", "idempotency"],
    images: [],
    author: "Support Team",
    createdAt: ago(320),
    updatedAt: ago(96),
  },

  // ---------------- FINANCE ----------------
  {
    id: pid(),
    areaSlug: "finance",
    title: "Incorrect merchant amount",
    description:
      "The amount settled to the merchant does not match the expected payout. This is frequently caused by currency conversion rounding or an unapplied fee schedule.",
    solution:
      "1. Pull the settlement report for the affected payout.\n2. Compare gross, fees, and net against the fee schedule.\n3. Check the currency conversion rate applied.\n4. Recalculate the expected payout amount.\n5. If a discrepancy remains, open a finance adjustment ticket.",
    tags: ["payout", "merchant", "reconciliation"],
    images: [],
    author: "Alex Morgan",
    createdAt: ago(48),
    updatedAt: ago(28),
  },
  {
    id: pid(),
    areaSlug: "finance",
    title: "Invoice not generated after payment",
    description:
      "A successful payment did not produce an invoice document. The invoicing service may have failed silently or the billing profile may be incomplete.",
    solution:
      "1. Confirm the payment status is captured.\n2. Check the billing profile has a valid tax ID and address.\n3. Inspect the invoicing service logs for the order.\n4. Manually trigger invoice generation.\n5. Send the invoice to the customer and note the fix.",
    tags: ["invoice", "billing", "payment"],
    images: [],
    author: "Priya Nair",
    createdAt: ago(160),
    updatedAt: ago(70),
  },
  {
    id: pid(),
    areaSlug: "finance",
    title: "Refund stuck in processing",
    description:
      "A refund shows as processing for longer than expected. This can occur when the provider queues refunds for batch settlement or when the original charge is not fully captured.",
    solution:
      "1. Verify the original charge was captured, not just authorized.\n2. Check the refund status directly with the provider.\n3. Confirm sufficient balance for the refund.\n4. If queued, communicate the expected settlement window.\n5. Escalate if unresolved after the provider SLA.",
    tags: ["refund", "processing", "payment"],
    images: [],
    author: "Support Team",
    createdAt: ago(240),
    updatedAt: ago(140),
  },

  // ---------------- TECH ----------------
  {
    id: pid(),
    areaSlug: "tech",
    title: "Webhook authentication error",
    description:
      "Incoming webhooks are rejected with a 401 authentication error. Usually the signing secret is out of date or the signature header is being stripped by a proxy.",
    solution:
      "1. Confirm the signing secret matches the provider dashboard.\n2. Verify the signature header reaches your server unmodified.\n3. Check the timestamp tolerance to prevent replay rejections.\n4. Rotate the signing secret if it may be compromised.\n5. Redeploy and redeliver a test event to confirm.",
    tags: ["webhook", "authentication", "api", "error"],
    images: [],
    author: "Sam Rivera",
    createdAt: ago(72),
    updatedAt: ago(72),
  },
  {
    id: pid(),
    areaSlug: "tech",
    title: "API rate limit exceeded (429)",
    description:
      "Clients receive HTTP 429 responses during peak traffic. The default rate limit is being hit because requests are not batched or backed off.",
    solution:
      "1. Inspect the rate limit headers on the 429 response.\n2. Implement exponential backoff with jitter on the client.\n3. Batch requests where the API supports it.\n4. Request a higher rate limit tier if justified.\n5. Add caching for frequently repeated calls.",
    tags: ["api", "rate-limit", "error"],
    images: [],
    author: "Priya Nair",
    createdAt: ago(180),
    updatedAt: ago(18),
  },
  {
    id: pid(),
    areaSlug: "tech",
    title: "Database connection pool exhausted",
    description:
      "The application throws timeout errors under load because the database connection pool is exhausted. Connections are being held open longer than necessary.",
    solution:
      "1. Review current pool size and active connection count.\n2. Ensure connections are released back to the pool promptly.\n3. Add a statement timeout to prevent long-running queries.\n4. Increase pool size if the database can support it.\n5. Add monitoring and alerting on pool saturation.",
    tags: ["database", "performance", "infrastructure"],
    images: [],
    author: "Sam Rivera",
    createdAt: ago(400),
    updatedAt: ago(210),
  },

  // ---------------- SALES ----------------
  {
    id: pid(),
    areaSlug: "sales",
    title: "Lead not syncing to CRM",
    description:
      "New leads captured on the marketing site are not appearing in the CRM. The sync integration may be failing validation or hitting a field-mapping error.",
    solution:
      "1. Open the integration run history for failures.\n2. Inspect the payload for required fields.\n3. Confirm the field mapping matches the CRM schema.\n4. Reprocess the failed leads.\n5. Add validation on the capture form to prevent bad data.",
    tags: ["crm", "leads", "integration"],
    images: [],
    author: "Jordan Lee",
    createdAt: ago(90),
    updatedAt: ago(30),
  },
  {
    id: pid(),
    areaSlug: "sales",
    title: "Quote total does not match line items",
    description:
      "A generated quote shows a total that does not equal the sum of its line items. Usually caused by a stale discount rule or currency mismatch between items.",
    solution:
      "1. Open the quote and expand all line items.\n2. Verify each item uses the same currency.\n3. Check applied discounts and their scope.\n4. Recalculate the total from the line items.\n5. Regenerate the quote and confirm the total.",
    tags: ["quote", "pricing", "discount"],
    images: [],
    author: "Alex Morgan",
    createdAt: ago(260),
    updatedAt: ago(115),
  },

  // ---------------- COMPLIANCE ----------------
  {
    id: pid(),
    areaSlug: "compliance",
    title: "KYC verification stuck in review",
    description:
      "A customer's KYC verification stays in manual review beyond the expected window. Documents may be low quality or a sanctions check may require a second reviewer.",
    solution:
      "1. Open the verification case and review submitted documents.\n2. Check whether any automated check flagged the case.\n3. Request re-submission if documents are unreadable.\n4. Assign a second reviewer for sanctions matches.\n5. Record the decision with an audit note.",
    tags: ["kyc", "verification", "audit"],
    images: [],
    author: "Alex Morgan",
    createdAt: ago(140),
    updatedAt: ago(6),
  },
  {
    id: pid(),
    areaSlug: "compliance",
    title: "Data retention policy not applied",
    description:
      "Records that should have been purged under the retention policy are still present. The scheduled purge job may be disabled or misconfigured for the region.",
    solution:
      "1. Confirm the retention policy configuration for the region.\n2. Check the purge job schedule and last successful run.\n3. Run the purge job in dry-run mode to preview affected records.\n4. Execute the purge and capture the audit log.\n5. Re-enable the schedule and verify the next run.",
    tags: ["retention", "policy", "audit", "gdpr"],
    images: [],
    author: "Priya Nair",
    createdAt: ago(300),
    updatedAt: ago(180),
  },
]
