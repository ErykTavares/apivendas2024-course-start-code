import { testDataSource } from '@/common/infrastructure/typeorm/testing/data-source';
import { ProductsTypeormRepository } from './products-typeorm.repository';
import { Product } from '../entities/products.entity';
import { NotFoundError } from '@/common/domain/errors/not-found-error';
import { randomUUID } from 'crypto';

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
    });
});
