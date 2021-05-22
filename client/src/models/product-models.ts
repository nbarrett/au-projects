export interface Product {
    id?: string;
    createdAt?: number;
    title: string;
    description?: string;
    specificGravity: number;
    type?: string;
    price?: number;
    colour?: string;
    hardness?: string;
    grade?: string;
    media?: any;
}

export interface ProductConfiguration {
    lossesAllowance: number;
    thicknesses: [3, 4, 5, 6, 7, 8, 9, 10, 12, 15]
}
