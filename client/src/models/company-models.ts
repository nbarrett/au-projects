import { HasAuditTimestamps } from "./common-models";

export interface Company extends HasAuditTimestamps {
    name?: string;
    code?: string;
    compoundOwner?: boolean;
    address?: Address,
    vatNumber?: string;
    registrationNumber?: string;
    avatarUrl?: string;
    primaryContact?: string;
    website?: string;
    notes?: string;
    availableProducts?: string[];
    pricingTier?: string;
}

export interface Address {
    building: string;
    street: string;
    suburb: string;
    province: string;
    postcode: string;
    city: string;
    country: string;
}
