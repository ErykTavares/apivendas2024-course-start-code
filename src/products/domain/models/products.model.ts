export interface ProductModel {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    created_at: Date;
    updated_at: Date;
}
