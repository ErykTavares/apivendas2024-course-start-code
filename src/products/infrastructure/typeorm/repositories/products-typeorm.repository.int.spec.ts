import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source';
import { ProductsTypeormRepository } from './products-typeorm.repository';
import { Product } from '../entities/products.entity';
import { NotFoundError } from '@/common/domain/errors/not-found-error';
import { randomUUID } from 'crypto';
import { productsDataBuilder } from '../../testing/helpers/products-data-builder';

describe('ProductsTypeormRepository Integration Tests', () => {
    let ormRepository: ProductsTypeormRepository;

    beforeAll(async () => {
        await testDataSource.initialize();
    });

    afterAll(async () => {
        await testDataSource.destroy();
    });

    beforeEach(async () => {
        await testDataSource.manager.query('DELETE FROM products');
        ormRepository = new ProductsTypeormRepository();
        ormRepository.productsRepository =
            testDataSource.getRepository(Product);
    });

    describe('findById', () => {
        it('should generate an error when the product is not found', async () => {
            const id = randomUUID();

            await expect(ormRepository.findById(id)).rejects.toThrow(
                new NotFoundError(`Product not found using ID ${id}`),
            );
        });

        it('should find a product by ID', async () => {
            const data = productsDataBuilder({});
            const product = testDataSource.manager.create(Product, data);

            await testDataSource.manager.save(product);
            const res = await ormRepository.findById(product.id);

            expect(res.id).toEqual(product.id);
            expect(res.name).toEqual(product.name);
        });
    });

    describe('create', () => {
        it('should create a new product object', () => {
            const data = productsDataBuilder({
                name: 'Product 1',
            });
            const result = ormRepository.create(data);

            expect(result.name).toEqual(data.name);
        });
    });

    describe('insert', () => {
        it('should insert a new product', async () => {
            const data = productsDataBuilder({
                name: 'Product 1',
            });
            const result = await ormRepository.insert(data);

            expect(result.name).toEqual(data.name);
        });
    });

    describe('update', () => {
        it('should generate an error when the product is not found', async () => {
            const data = productsDataBuilder({});

            await expect(ormRepository.update(data)).rejects.toThrow(
                new NotFoundError(`Product not found using ID ${data.id}`),
            );
        });

        it('should update a product', async () => {
            const data = productsDataBuilder({});
            const product = testDataSource.manager.create(Product, data);

            await testDataSource.manager.save(product);

            product.name = 'Product 1 Updated';

            const res = await ormRepository.update(product);

            expect(res.name).toEqual('Product 1 Updated');
        });
    });

    describe('delete', () => {
        it('should generate an error when the product is not found', async () => {
            const id = randomUUID();

            await expect(ormRepository.delete(id)).rejects.toThrow(
                new NotFoundError(`Product not found using ID ${id}`),
            );
        });

        it('should delete a product', async () => {
            const data = productsDataBuilder({});
            const product = testDataSource.manager.create(Product, data);

            await testDataSource.manager.save(product);
            await ormRepository.delete(data.id);

            const result = await testDataSource.manager.findOneBy(Product, {
                id: data.id,
            });

            expect(result).toBeNull();
        });
    });
});
