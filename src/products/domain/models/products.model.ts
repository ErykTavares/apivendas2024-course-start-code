export interface ProductModel {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
