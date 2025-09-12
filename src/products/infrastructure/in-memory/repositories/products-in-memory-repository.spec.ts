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

    describe('applyFilter', () => {
        it('should not filter items when the filter param is null', async () => {
            const data = productsDataBuilder();
            sut.items.push(data);

            const spy = jest.spyOn(sut.items, 'filter' as any);
            const result = await sut['applyFilter'](sut.items, null);

            expect(spy).not.toHaveBeenCalled();
            expect(result).toStrictEqual(sut.items);
        });

        it('must filter the items using the filter param', async () => {
            const items = [
                productsDataBuilder({ name: 'test' }),
                productsDataBuilder({ name: 'TEST' }),
                productsDataBuilder({ name: 'fake' }),
            ];

            sut.items.push(...items);

            const spy = jest.spyOn(sut.items, 'filter' as any);
            let result = await sut['applyFilter'](sut.items, 'test');

            expect(spy).toHaveBeenCalledTimes(1);
            expect(result).toStrictEqual([items[0], items[1]]);
        });
    });

    describe('applySort', () => {
        it('should sort items by created_at when no sort parameters are provided', async () => {
            const created_at = new Date();

            const items = [
                productsDataBuilder({ name: 'test', created_at: created_at }),
                productsDataBuilder({
                    name: 'TEST',
                    created_at: new Date(created_at.getTime() + 100),
                }),
                productsDataBuilder({
                    name: 'fake',
                    created_at: new Date(created_at.getTime() + 200),
                }),
            ];

            sut.items.push(...items);

            const result = await sut['applySort'](sut.items, null, null);

            expect(result).toStrictEqual([items[2], items[1], items[0]]);
        });

        it('must sort items using the name', async () => {
            const items = [
                productsDataBuilder({ name: 'c' }),
                productsDataBuilder({
                    name: 'a',
                }),
                productsDataBuilder({
                    name: 'b',
                }),
            ];

            sut.items.push(...items);

            const result = await sut['applySort'](sut.items, 'name', 'desc');
            expect(result).toStrictEqual([items[0], items[2], items[1]]);
        });
    });
});
