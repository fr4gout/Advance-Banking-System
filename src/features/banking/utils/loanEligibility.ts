import type { Account, Character, LoanProduct, LoanProductStatus } from "../types/banking";

export interface LoanEligibility {
  eligible: boolean;
  effectiveStatus: LoanProductStatus;
  lockReason?: string;
}

const BUSINESS_ROLES = new Set(["Owner", "Manager"]);

export function getLoanEligibility(
  product: LoanProduct,
  character: Character,
  account: Account,
): LoanEligibility {
  if (product.requiredJob) {
    const hasJob = character.job === product.requiredJob;
    const hasSocietyRole =
      product.requiredAccountKind === "society" &&
      account.kind === "society" &&
      account.role !== undefined &&
      BUSINESS_ROLES.has(account.role);

    if (!hasJob && !hasSocietyRole) {
      return {
        eligible: false,
        effectiveStatus: "locked",
        lockReason: "REQUIRES A SPECIFIC JOB",
      };
    }
  }

  if (product.requiredAccountKind && account.kind !== product.requiredAccountKind) {
    return {
      eligible: false,
      effectiveStatus: "locked",
      lockReason: `REQUIRES ${product.requiredAccountKind.toUpperCase()} ACCOUNT`,
    };
  }

  if (product.status === "locked") {
    return {
      eligible: false,
      effectiveStatus: "locked",
      lockReason: "NOT AVAILABLE",
    };
  }

  return {
    eligible: true,
    effectiveStatus: product.preApproved ? "pre_approved" : product.status,
  };
}

export function countEligibleProducts(
  products: LoanProduct[],
  character: Character,
  account: Account,
): number {
  return products.filter((p) => getLoanEligibility(p, character, account).eligible).length;
}

export function tierLabel(tier: string): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
