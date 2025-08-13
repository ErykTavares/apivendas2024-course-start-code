import { RepositoryInterface } from '@/common/domain/repositories/repository.interface';
import { ProductModel } from '../models/products.model';

export type CreateProductProps = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
};

export type ProductId = {
    id: string;
};

export interface ProductsRepository
    extends RepositoryInterface<ProductModel, CreateProductProps> {
    findByName(name: string): Promise<ProductModel>;

    findAllByIds(productIds: ProductId[]): Promise<ProductModel[]>;

    conflictingNames(names: string): Promise<void>;
}
