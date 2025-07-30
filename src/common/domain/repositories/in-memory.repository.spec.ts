import { randomUUID } from 'crypto';
import { InMemoryRepository } from './in-memory.repository';
import { NotFoundError } from '../errors/not-found-error';

type StubModelProps = {
    id: string;
    name: string;
    price: number;
    created_at: Date;
    updated_at: Date;
};

class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
    constructor() {
        super();
        this.sortableFields = ['name'];
    }

    protected async applyFilter(
        items: StubModelProps[],
        filter: string | null,
    ): Promise<StubModelProps[]> {
        if (!filter) return Promise.resolve(items);
        return Promise.resolve(
            items.filter(item =>
                item.name.toLowerCase().includes(filter.toLowerCase()),
            ),
        );
    }
}

describe('InMemoryRepository Unit Tests', () => {
    let sut: StubInMemoryRepository;
    let model: StubModelProps;
    let props: any;
    let created_at: Date;
    let updated_at: Date;

    beforeEach(() => {
        sut = new StubInMemoryRepository();
        created_at = new Date();
        updated_at = new Date();
        props = {
            name: 'teste01',
            price: 10,
        };
        model = { id: randomUUID(), created_at, updated_at, ...props };
    });

    describe('create', () => {
        it('should be able to create a new model', () => {
            const result = sut.create(props);

            expect(result.name).toStrictEqual('teste01');
        });
    });

    describe('insert', () => {
        it('must be able to insert a model', async () => {
            const result = await sut.insert(model);

            expect(result).toStrictEqual(sut.items[0]);
        });
    });

    describe('findById', () => {
        it('should be able to find a model by id', async () => {
            const data = await sut.insert(model);
            const result = await sut.findById(data.id);

            expect(result).toStrictEqual(data);
        });

        it('an error should be throw when the ID is not found', async () => {
            await expect(sut.findById('fake-id')).rejects.toThrow(
                new NotFoundError('Model not found using ID fake-id.'),
            );
        });
    });

    describe('update', () => {
        it('an error should be throw when the model is not found', async () => {
            await expect(sut.update(model)).rejects.toThrow(
                new NotFoundError(`Model not found using ID ${model.id}.`),
            );
        });

        it('a model must be updated', async () => {
            const data = await sut.insert(model);
            const updatedModel = {
                id: data.id,
                name: 'updated name',
                price: 5000,
                created_at,
                updated_at,
            };
            const result = await sut.update(updatedModel);

            expect(result).toStrictEqual(sut.items[0]);
        });
    });

    describe('delete', () => {
        it('an error should be generated when the model is not found on deletion', async () => {
            await expect(sut.delete('fake-id')).rejects.toThrow(
                new NotFoundError('Model not found using ID fake-id.'),
            );
        });

        it('should be able to deleted a model', async () => {
            const data = await sut.insert(model);

            expect(sut.items.length).toBe(1);

            await sut.delete(data.id);

            expect(sut.items.length).toBe(0);
        });
    });

    describe('applyFilter', () => {
        it('should not filter items when the filter param is null', async () => {
            const items = [model];
            const spy = jest.spyOn(items, 'filter' as any);
            const result = await sut['applyFilter'](items, null);

            expect(spy).not.toHaveBeenCalled();
            expect(result).toStrictEqual(items);
        });

        it('must filter the items using the filter param', async () => {
            const items = [
                {
                    id: randomUUID(),
                    name: 'test',
                    price: 100,
                    created_at,
                    updated_at,
                },
                {
                    id: randomUUID(),
                    name: 'TEST',
                    price: 200,
                    created_at,
                    updated_at,
                },
                {
                    id: randomUUID(),
                    name: 'user01',
                    price: 300,
                    created_at,
                    updated_at,
                },
            ];
            const spy = jest.spyOn(items, 'filter' as any);
            let result = await sut['applyFilter'](items, 'test');

            expect(spy).toHaveBeenCalledTimes(1);
            expect(result).toStrictEqual([items[0], items[1]]);

            result = await sut['applyFilter'](items, 'TEST');

            expect(spy).toHaveBeenCalledTimes(2);
            expect(result).toStrictEqual([items[0], items[1]]);

            result = await sut['applyFilter'](items, 'no match');

            expect(spy).toHaveBeenCalledTimes(3);
            expect(result).toHaveLength(0);
        });
    });

    describe('applySort', () => {
        it('should not sort items', async () => {
            const items = [
                {
                    id: randomUUID(),
                    name: 'test',
                    price: 100,
                    created_at,
                    updated_at,
                },
                {
                    id: randomUUID(),
                    name: 'TEST',
                    price: 200,
                    created_at,
                    updated_at,
                },
                {
                    id: randomUUID(),
                    name: 'user01',
                    price: 300,
                    created_at,
                    updated_at,
                },
            ];
            let result = await sut['applySort'](items, null, null);

            expect(result).toStrictEqual(items);

            result = await sut['applySort'](items, 'id', null);

            expect(result).toStrictEqual(items);
        });

        it('must sort items using the name', async () => {
            const items = [
                {
                    id: randomUUID(),
                    name: 'user02',
                    price: 100,
                    created_at,
                    updated_at,
                },
                {
                    id: randomUUID(),
                    name: 'user03',
                    price: 200,
                    created_at,
                    updated_at,
                },
                {
                    id: randomUUID(),
                    name: 'user01',
                    price: 300,
                    created_at,
                    updated_at,
                },
            ];
            let result = await sut['applySort'](items, 'name', 'desc');

            expect(result).toStrictEqual([items[1], items[0], items[2]]);

            result = await sut['applySort'](items, 'name', 'asc');

            expect(result).toStrictEqual([items[2], items[0], items[1]]);
        });
    });
});
