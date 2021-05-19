export interface Company {
    id: string;
    address: Address,
    avatarUrl: string;
    createdAt: number,
    primaryContact: string;
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
