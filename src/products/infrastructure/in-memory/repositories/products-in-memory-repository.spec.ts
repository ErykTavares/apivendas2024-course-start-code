import { NotFoundError } from '@/common/domain/errors/not-found-error';
import { ProductsInMemoryRepository } from './products-in-memory-repository';
import { productsDataBuilder } from '../../testing/helpers/products-data-builder';
import { ConflictError } from '@/common/domain/errors/conflict-error';

describe('ProductsInMemoryRepository Unit Tests', () => {
    let sut: ProductsInMemoryRepository;

    beforeEach(() => {
        sut = new ProductsInMemoryRepository();
    });

    describe('findByName', () => {
        it('should throw error when product is not found', async () => {
            await expect(() => sut.findByName('fake_name')).rejects.toThrow(
                new NotFoundError('Product with name fake_name not found'),
            );

            await expect(() =>
                sut.findByName('fake_name'),
            ).rejects.toBeInstanceOf(NotFoundError);
        });

        it('the product must be found by name', async () => {
            const data = productsDataBuilder({ name: 'Test Product' });
            sut.items.push(data);

            const result = await sut.findByName('Test Product');
            expect(result).toStrictEqual(data);
        });
    });

    describe('conflictingName', () => {
        it('should throw error when there are some products with the same name', async () => {
            const data = productsDataBuilder({ name: 'Test Product' });
            sut.items.push(data);

            await expect(() =>
                sut.conflictingNames('Test Product'),
            ).rejects.toThrow(
                new ConflictError(
                    'Name already in use on another product (Test Product)',
                ),
            );

            await expect(() =>
                sut.conflictingNames('Test Product'),
            ).rejects.toBeInstanceOf(ConflictError);
        });

        it('should not find a product with the same name', async () => {
            expect.assertions(0);
            await sut.conflictingNames('Test Product');
        });
    });
});
