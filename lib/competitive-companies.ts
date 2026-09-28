// Single source of truth for the dropdown - shared by the client component
// and the API route so they can never drift out of sync.
export const COMPANY_DOMAINS: Record<string, string> = {
  Stripe: "stripe.com",
  Ramp: "ramp.com",
  Brex: "brex.com",
  Plaid: "plaid.com",
  Mercury: "mercury.com",
  "Bill.com": "bill.com",
  Rippling: "rippling.com",
  Deel: "deel.com",
  Navan: "navan.com",
  Airbase: "airbase.com",
}

export type Company = keyof typeof COMPANY_DOMAINS

export const COMPANIES = Object.keys(COMPANY_DOMAINS) as Company[]

export function isKnownCompany(value: string): value is Company {
  return Object.prototype.hasOwnProperty.call(COMPANY_DOMAINS, value)
}
