import { HasAuditTimestamps } from "./common-models";

export interface Company extends HasAuditTimestamps {
    id?: string;
    name?: string;
    address?: Address,
    vatNumber?: string;
    registrationNumber?: string;
    avatarUrl?: string;
    primaryContact?: string;
    website?: string;
    notes?: string;
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
