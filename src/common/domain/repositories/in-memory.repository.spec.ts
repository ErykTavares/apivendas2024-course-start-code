import { randomUUID } from 'crypto';
import { InMemoryRepository } from './in-memory.repository';

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

    it('should be able to create a new model', () => {
        const result = sut.create(props);
        expect(result.name).toStrictEqual('teste01');
    });

    it('should be able to inserts a new model', async () => {
        const result = await sut.insert(model);
        expect(result).toStrictEqual(sut.items[0]);
    });
});
